import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import neo4j, { Integer, Node as Neo4jNode, Relationship as Neo4jRelationship, Session, Result, Record as Neo4jRecord } from 'neo4j-driver';
import logger from '@/lib/logger';

// Types - Use only identity as primary key
export interface LocalNode {
    identity: string;
    labels: string[];
    properties: Record<string, any>;
}

export interface LocalRelationship {
    identity: string;
    type: string;
    start: string; // Start node identity
    end: string;   // End node identity
    properties: Record<string, any>;
}

// Mimic Neo4j Record structure for compatibility
export interface LocalRecord {
    _fields: any[];
    _fieldLookup: { [key: string]: number };
    get: (key: string) => any;
    keys: string[];
    length: number;
    toObject: () => Record<string, any>;
}

const DB_DIR = path.resolve(process.cwd(), '.local-graph-db');
const NODES_FILE = path.join(DB_DIR, 'nodes.json');
const RELS_FILE = path.join(DB_DIR, 'relationships.json');

export class LocalGraphDatabase {
    private dbPath: string;
    private nodesFile: string;
    private relsFile: string;
    private nodes: Map<string, LocalNode>;
    private relationships: Map<string, LocalRelationship>;
    public initialized: boolean = false;
    private initializingPromise: Promise<void> | null = null;
    isDirty: boolean = false;
    private lastSaveTime: number = 0;
    private readonly SAVE_DEBOUNCE_MS = 3000;

    constructor() {
        this.dbPath = DB_DIR;
        this.nodesFile = NODES_FILE;
        this.relsFile = RELS_FILE;
        this.nodes = new Map();
        this.relationships = new Map();
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;
        if (this.initializingPromise) return this.initializingPromise;
        this.initializingPromise = (async () => {
            try {
                await this.ensureDbDir();
                await this.loadData();
                this.initialized = true;
                logger.info('[LocalDB] Initialization complete.');
            } catch (err) {
                logger.error('[LocalDB] Initialization failed:', { error: err });
                // Handle initialization failure - maybe clear maps?
                this.nodes.clear();
                this.relationships.clear();
                this.initialized = false; // Mark as not successfully initialized
            } finally {
                this.initializingPromise = null;
            }
        })();
        return this.initializingPromise;
    }

    private async ensureDbDir(): Promise<void> {
        try {
            await fs.access(this.dbPath);
        } catch {
            logger.info(`[LocalDB] Creating database directory: ${this.dbPath}`);
            await fs.mkdir(this.dbPath, { recursive: true });
        }
    }

    private async loadData(): Promise<void> {
        logger.info('[LocalDB] Attempting to load data...');
        try {
            // Load nodes
            try {
                await fs.access(this.nodesFile);
                const nodesData = await fs.readFile(this.nodesFile, 'utf-8');
                const nodeArray: LocalNode[] = JSON.parse(nodesData);
                this.nodes.clear();
                nodeArray.forEach(node => this.nodes.set(node.identity, node));
                logger.info(`[LocalDB] Loaded ${this.nodes.size} nodes from ${this.nodesFile}`);
            } catch (nodeError) {
                logger.warn(`[LocalDB] Nodes file not found or invalid (${this.nodesFile}). Initializing empty map.`);
                this.nodes.clear();
            }

            // Load relationships
            try {
                await fs.access(this.relsFile);
                const relsData = await fs.readFile(this.relsFile, 'utf-8');
                const relArray: LocalRelationship[] = JSON.parse(relsData);
                this.relationships.clear();
                relArray.forEach(rel => this.relationships.set(rel.identity, rel));
                logger.info(`[LocalDB] Loaded ${this.relationships.size} relationships from ${this.relsFile}`);
            } catch (relError) {
                logger.warn(`[LocalDB] Relationships file not found or invalid (${this.relsFile}). Initializing empty map.`);
                this.relationships.clear();
            }
        } catch (error) {
            logger.error('[LocalDB] Critical error during data load process:', { error });
            this.nodes.clear();
            this.relationships.clear();
            throw error; // Re-throw critical errors
        }
    }

    private async saveData(): Promise<void> {
        logger.info(`[LocalDB] Saving ${this.nodes.size} nodes and ${this.relationships.size} relationships...`);
        try {
            const nodesJson = JSON.stringify(Array.from(this.nodes.values()), null, 2);
            const relsJson = JSON.stringify(Array.from(this.relationships.values()), null, 2);

            // Ensure directory exists before writing
            await this.ensureDbDir();

            await fs.writeFile(this.nodesFile, nodesJson, 'utf-8');
            await fs.writeFile(this.relsFile, relsJson, 'utf-8');

            logger.info('[LocalDB] Data saved successfully.');
        } catch (error) {
            logger.error('[LocalDB] Error saving data:', { error });
            throw error; // Re-throw save errors
        }
    }

    async saveState(force: boolean = false): Promise<void> {
        if (!this.initialized) {
            logger.warn('[LocalDB] Cannot save state, not initialized.');
            return;
        }
        if (!force && !this.isDirty) return;

        const now = Date.now();
        if (!force && now - this.lastSaveTime < this.SAVE_DEBOUNCE_MS) return;

        try {
            await this.saveData();
            this.lastSaveTime = now;
            this.isDirty = false;
            logger.info('Saved local graph database state (debounced/forced)');
        } catch (error) {
            logger.error('Failed to save local graph database state:', { error });
        }
    }

    // --- CRUD Methods --- >
    createNode(labels: string[], properties: Record<string, any>): LocalNode {
        const nodeId = uuidv4(); // Use uuid as the identity
        const node: LocalNode = { identity: nodeId, labels, properties };
        this.nodes.set(nodeId, node);
        this.isDirty = true;
        return node;
    }

    findOrCreateNode(labels: string[], properties: Record<string, any>): LocalNode {
        // Use Array.from for iteration
        for (const node of Array.from(this.nodes.values())) {
            // Use uniqueId for matching if present, otherwise might need more complex logic
            if (labels.every(l => node.labels.includes(l)) && node.properties.uniqueId && node.properties.uniqueId === properties.uniqueId) {
                // Basic update example
                const needsUpdate = Object.keys(properties).some(key => properties[key] !== node.properties[key]);
                if (needsUpdate) {
                     node.properties = { ...node.properties, ...properties };
                     this.isDirty = true;
                 }
                 return node;
            }
        }
        return this.createNode(labels, properties);
    }

    createRelationship(startNodeId: string, endNodeId: string, type: string, properties: Record<string, any> = {}): LocalRelationship | null {
        if (!this.nodes.has(startNodeId) || !this.nodes.has(endNodeId)) {
            logger.error(`[LocalDB] Cannot create relationship: node(s) not found (${startNodeId} or ${endNodeId})`);
            return null;
        }
        // Simplified: Check if *any* relationship of this type exists between these nodes
        // A more robust check might consider properties or allow multiple relationships
        for (const rel of Array.from(this.relationships.values())) {
             if (rel.start === startNodeId && rel.end === endNodeId && rel.type === type) {
                 logger.warn(`[LocalDB] Relationship ${type} from ${startNodeId} to ${endNodeId} already exists. Skipping creation.`);
                 return rel; // Return existing one
             }
        }

        const relId = uuidv4(); // Use uuid as the identity
        const relationship: LocalRelationship = { identity: relId, type, start: startNodeId, end: endNodeId, properties };
        this.relationships.set(relId, relationship);
        this.isDirty = true;
        return relationship;
    }

    findNodes(label: string | null, properties?: Record<string, any>): LocalNode[] {
        // Basic filtering - replace with actual matching logic
        return Array.from(this.nodes.values()).filter(node => {
            if (label && !node.labels.includes(label)) return false;
            if (properties) {
                 if (properties.projectId && node.properties.projectId !== properties.projectId) return false;
                 // Add other property checks as needed
            }
            return true;
        });
    }

    findRelationships(type: string | null, properties?: Record<string, any>): LocalRelationship[] {
         // Basic filtering
        return Array.from(this.relationships.values()).filter(rel => {
            if (type && rel.type !== type) return false;
            // Add property checks if needed
            return true;
        });
    }

    findNodeRelationships(nodeId: string, direction?: 'outgoing' | 'incoming' | 'both'): LocalRelationship[] {
        const results: LocalRelationship[] = [];
        const both = direction === 'both' || !direction;
        for (const rel of this.relationships.values()) {
            if ((direction === 'outgoing' || both) && rel.start === nodeId) results.push(rel);
            else if ((direction === 'incoming' || both) && rel.end === nodeId) results.push(rel);
        }
        return results;
    }

    // --- Query Execution (Simplified) --- >
    async executeQuery(query: string, params: Record<string, any> = {}): Promise<LocalRecord[]> {
        // Ensure initialized FIRST
        if (!this.initialized) {
            logger.info('[LocalDB - executeQuery] Not initialized, awaiting initialization...');
            await this.initialize(); // Await the init promise here
             if (!this.initialized) { // Check again after awaiting
                logger.error('[LocalDB - executeQuery] Initialization failed. Returning empty results.');
                return [];
            }
             logger.info('[LocalDB - executeQuery] Initialization complete. Proceeding with query.');
        }

        logger.debug(`[LocalDB] Executing query: ${query.substring(0, 100)}...`, { params });
        const records: LocalRecord[] = [];
        let changesMade = false;

        try {
             // --- Basic Query Parsing Logic --- >

             // 1. Handle MERGE File & Module & Potential Feature
            const mergeFileMatch = query.match(/MERGE \(f:File \{path: \$filePath, projectId: \$projectId\}\)/);
            if (mergeFileMatch) {
                const filePath = params.filePath;
                const projectId = params.projectId;
                const fileName = path.basename(filePath);
                const directoryPath = path.dirname(filePath);
                const normalizedDirPath = directoryPath === '.' ? '/' : directoryPath;
                const fileId = `${projectId}::${filePath}`;
                const moduleId = `Module::${projectId}::${normalizedDirPath}`;
                const moduleName = normalizedDirPath === '/' ? 'root' : path.basename(normalizedDirPath);

                // Merge File Node
                const fileNode = this.findOrCreateNode(['File'], { identity: fileId, path: filePath, projectId: projectId, name: fileName });
                changesMade = this.isDirty;

                // Merge Module Node
                const moduleNode = this.findOrCreateNode(['Module'], { identity: moduleId, path: normalizedDirPath, name: moduleName, projectId: projectId });
                if(this.isDirty && !changesMade) changesMade = true;

                // Merge PART_OF Relationship (File -> Module)
                const partOfRel = this.createRelationship(fileNode.identity, moduleNode.identity, 'PART_OF');
                if(partOfRel && !changesMade) changesMade = true;

                // --- Feature Detection (Example: based on path) ---
                const featureMatch = normalizedDirPath.match(/\/?features\/([^\/]+)/i); // Look for /features/FeatureName/
                if (featureMatch) {
                    const featureName = featureMatch[1];
                    const featureId = `Feature::${projectId}::${featureName}`;
                    // Merge Feature Node
                    const featureNode = this.findOrCreateNode(['Feature'], { identity: featureId, name: featureName, projectId: projectId });
                     if(this.isDirty && !changesMade) changesMade = true;
                    // Merge Module BELONGS_TO_FEATURE Relationship
                    const belongsToRel = this.createRelationship(moduleNode.identity, featureNode.identity, 'BELONGS_TO_FEATURE');
                    if(belongsToRel && !changesMade) changesMade = true;
                    logger.info(`[LocalDB] Linked Module ${moduleName} to Feature ${featureName}`);
                }
                // --- End Feature Detection ---

                // Mimic RETURN id(f)
                records.push(this.createRecord(['fileNodeId'], [fileNode.identity]));
            }

            // 2. Handle MERGE Function/Class linked to File
            const mergeContainedNodeMatch = query.match(/MATCH \(f:File \{path: \$filePath, projectId: \$projectId\}\) *MERGE \((\w+):(\w+) \{uniqueId: \$uniqueId\}\).*MERGE \(f\)-\[:CONTAINS\]->\(\1\)/);
            if (mergeContainedNodeMatch) {
                const label = mergeContainedNodeMatch[2]; // Function or Class
                const uniqueId = params.uniqueId;
                const fileId = `${params.projectId}::${params.filePath}`;

                // Merge the contained node (Function/Class)
                const containedNode = this.findOrCreateNode([label], { ...params.props, uniqueId: uniqueId, identity: uniqueId });
                if (this.isDirty && !changesMade) changesMade = true;

                // Merge the relationship
                const containsRel = this.createRelationship(fileId, containedNode.identity, 'CONTAINS');
                if (containsRel && !changesMade) changesMade = true;

                // Mimic RETURN id(r)
                records.push(this.createRecord(['relId'], [containsRel?.identity || null]));
            }

            // 3. Handle MATCH for graph route
            const matchGraphMatch = query.match(/MATCH \(n \{projectId: \$projectId\}\) *OPTIONAL MATCH \(n\)-\[r\]->\(m \{projectId: \$projectId\}\) *RETURN n, r, m/);
            if (matchGraphMatch) {
                const projectId = params.projectId;
                const projectNodes = Array.from(this.nodes.values()).filter(n => n.properties.projectId === projectId);
                const projectNodeIds = new Set(projectNodes.map(n => n.identity));

                projectNodes.forEach(n => {
                    // Use Array.from for iteration here
                    const outgoingEdges = Array.from(this.relationships.values()).filter(e => e.start === n.identity && projectNodeIds.has(e.end));
                    if (outgoingEdges.length > 0) {
                         outgoingEdges.forEach(r => {
                            const m = this.nodes.get(r.end);
                            records.push(this.createRecord(['n', 'r', 'm'], [this.toNeo4jNode(n), this.toNeo4jRelationship(r), m ? this.toNeo4jNode(m) : null]));
                        });
                    } else {
                        records.push(this.createRecord(['n', 'r', 'm'], [this.toNeo4jNode(n), null, null]));
                    }
                });
            }
            // ... (other query handlers)

             if (changesMade) {
                this.isDirty = true;
                await this.saveState(); // Await save if changes were made
            }
             return records;

        } catch (error) {
             logger.error('Error executing local database query:', { error });
             throw error;
        }
    }

    // --- Helper Methods --- >
    private createRecord(keys: string[], fields: any[]): LocalRecord {
        const lookup = keys.reduce((acc, key, i) => { acc[key] = i; return acc; }, {} as Record<string, number>);
        const record = {
            keys,
            length: keys.length,
            _fields: fields,
            _fieldLookup: lookup,
            get: (key: string) => record._fields[record._fieldLookup[key]] ?? null,
            toObject: () => keys.reduce((obj, key, i) => { obj[key] = fields[i]; return obj; }, {} as Record<string, any>),
        };
        return record;
    }

    private toNeo4jNode(node: LocalNode): Partial<Neo4jNode> {
        // Use a simple numeric conversion of uuid for mock integer ID, or just use string identity
        const mockId = neo4j.int(parseInt(node.identity.substring(0, 8), 16)); // Example conversion
        return {
            identity: mockId,
            labels: node.labels,
            properties: node.properties,
            elementId: node.identity
        };
    }

    private toNeo4jRelationship(rel: LocalRelationship): Partial<Neo4jRelationship> {
        const mockId = neo4j.int(parseInt(rel.identity.substring(0, 8), 16));
        const startId = neo4j.int(parseInt(rel.start.substring(0, 8), 16)); // Example conversion
        const endId = neo4j.int(parseInt(rel.end.substring(0, 8), 16));
        return {
            identity: mockId,
            type: rel.type,
            start: startId, // Use mock integer ID
            end: endId,   // Use mock integer ID
            properties: rel.properties,
            elementId: rel.identity,
            startNodeElementId: rel.start,
            endNodeElementId: rel.end
        };
    }
}

// Singleton instance management
let localDbInstance: LocalGraphDatabase | null = null;

export function getLocalDbInstance(): LocalGraphDatabase {
    if (!localDbInstance) {
        logger.info('[LocalDB] Creating singleton instance.');
        localDbInstance = new LocalGraphDatabase();
        // Trigger async initialization but don't await here
        localDbInstance.initialize().catch(err => {
            logger.error('[LocalDB] Singleton initialization failed in background:', err);
        });
    }
    return localDbInstance;
}

// Helper to ensure DB is initialized before use
export async function ensureDbInitialized(): Promise<LocalGraphDatabase> {
    const instance = getLocalDbInstance();
    await instance.initialize();
    if (!instance.initialized) {
         throw new Error('[LocalDB] Failed to initialize database.');
    }
    return instance;
}

// --- RE-ADD Simplified LocalSession --- >
// Mimics the essential parts of the Neo4j Session interface
export class LocalSession /* implements Partial<Session> */ {
    private dbInstancePromise: Promise<LocalGraphDatabase>;

    constructor() {
        // Ensure the DB is initialized when session is created
        this.dbInstancePromise = ensureDbInitialized();
    }

    // Simplified run method - return Promise<any>
    async run(query: string, parameters?: Record<string, any>): Promise<any> {
        const db = await this.dbInstancePromise;
        const records = await db.executeQuery(query, parameters || {});
        // Mimic the Result object structure loosely
        return {
            records: records as any, // Cast to any to bypass type mismatch
            summary: { /* Basic Mock Summary */
                 query: { text: query, parameters },
                 queryType: query.includes('CREATE') || query.includes('MERGE') ? 'w' : 'r',
                 counters: { containsUpdates: () => false },
                 server: { address: 'localfile' },
            } as any,
        };
    }

    // Simplified transaction methods - adjust run type
    async readTransaction<T>(work: (tx: { run: (q: string, p?: any) => Promise<any> }) => Promise<T>): Promise<T> {
        return work({ run: this.run.bind(this) });
    }

    async writeTransaction<T>(work: (tx: { run: (q: string, p?: any) => Promise<any> }) => Promise<T>): Promise<T> {
        return work({ run: this.run.bind(this) });
    }

    // Close method - potentially save state
    async close(): Promise<void> {
        const db = await this.dbInstancePromise;
        if (db.isDirty) {
            try {
                await db.saveState(true); // Force save on close
                logger.info('[LocalSession] Saved state on close.');
            } catch (error) {
                logger.error('Error saving database state on session close:', { error });
            }
        }
    }

    // Add dummy methods for other Session requirements if needed by types
    lastBookmark(): string | null { return null; } // Correct return type
    lastBookmarks(): string[] { return []; } // Correct return type
    // beginTransaction(): Transaction { /* ... */ } // Avoid implementing full transaction
}
// < --- End LocalSession --- 