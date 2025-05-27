// lib/refactor/local-graph-db.ts
import fs from "fs/promises";
import path from "path";

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
import { randomFillSync } from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
import { randomUUID } from "crypto";
var native_default = { randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// lib/refactor/local-graph-db.ts
var LocalGraphDatabase = class {
  constructor() {
    this.initialized = false;
    this.dbPath = path.join(process.cwd(), ".local-graph-db");
    this.nodesFile = path.join(this.dbPath, "nodes.json");
    this.relsFile = path.join(this.dbPath, "relationships.json");
    this.nodes = /* @__PURE__ */ new Map();
    this.relationships = /* @__PURE__ */ new Map();
  }
  async init() {
    if (this.initialized) return;
    try {
      await fs.mkdir(this.dbPath, { recursive: true });
      try {
        const nodesData = await fs.readFile(this.nodesFile, "utf-8");
        const nodeArray = JSON.parse(nodesData);
        nodeArray.forEach((node) => {
          this.nodes.set(node.identity, node);
        });
        const relsData = await fs.readFile(this.relsFile, "utf-8");
        const relArray = JSON.parse(relsData);
        relArray.forEach((rel) => {
          this.relationships.set(rel.identity, rel);
        });
        console.log(`Loaded local graph: ${this.nodes.size} nodes, ${this.relationships.size} relationships`);
      } catch (loadError) {
        console.log("Starting with empty local graph database");
      }
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize local graph database:", error);
      throw error;
    }
  }
  async saveState() {
    try {
      const nodesJson = JSON.stringify(Array.from(this.nodes.values()), null, 2);
      const relsJson = JSON.stringify(Array.from(this.relationships.values()), null, 2);
      await fs.writeFile(this.nodesFile, nodesJson, "utf-8");
      await fs.writeFile(this.relsFile, relsJson, "utf-8");
      console.log("Saved local graph database state");
    } catch (error) {
      console.error("Failed to save local graph database state:", error);
      throw error;
    }
  }
  // Create a node
  createNode(labels, properties) {
    const nodeId = v4_default();
    const node = {
      identity: nodeId,
      labels,
      properties
    };
    this.nodes.set(nodeId, node);
    return node;
  }
  // Find or create a node
  findOrCreateNode(labels, properties) {
    for (const node of this.nodes.values()) {
      if (labels.length !== node.labels.length) continue;
      if (!labels.every((label) => node.labels.includes(label))) continue;
      const keyProps = ["path", "name", "uniqueId", "projectId"];
      let matches = true;
      for (const key of keyProps) {
        if (properties[key] !== void 0 && node.properties[key] !== void 0 && properties[key] !== node.properties[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        node.properties = { ...node.properties, ...properties };
        return node;
      }
    }
    return this.createNode(labels, properties);
  }
  // Create a relationship
  createRelationship(startNodeId, endNodeId, type, properties = {}) {
    if (!this.nodes.has(startNodeId) || !this.nodes.has(endNodeId)) {
      console.error(`Cannot create relationship: node(s) not found`);
      return null;
    }
    const relId = v4_default();
    const relationship = {
      identity: relId,
      type,
      start: startNodeId,
      end: endNodeId,
      properties
    };
    this.relationships.set(relId, relationship);
    return relationship;
  }
  // Find nodes by properties
  findNodes(label, properties = {}) {
    const results = [];
    for (const node of this.nodes.values()) {
      if (label && !node.labels.includes(label)) continue;
      let matches = true;
      for (const [key, value] of Object.entries(properties)) {
        if (node.properties[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) results.push(node);
    }
    return results;
  }
  // Find relationships by properties
  findRelationships(type, properties = {}) {
    const results = [];
    for (const rel of this.relationships.values()) {
      if (type && rel.type !== type) continue;
      let matches = true;
      for (const [key, value] of Object.entries(properties)) {
        if (rel.properties[key] !== value) {
          matches = false;
          break;
        }
      }
      if (matches) results.push(rel);
    }
    return results;
  }
  // Find relationships connected to a node
  findNodeRelationships(nodeId, direction = "both") {
    const results = [];
    for (const rel of this.relationships.values()) {
      if (direction === "outgoing" && rel.start === nodeId) {
        results.push(rel);
      } else if (direction === "incoming" && rel.end === nodeId) {
        results.push(rel);
      } else if (direction === "both" && (rel.start === nodeId || rel.end === nodeId)) {
        results.push(rel);
      }
    }
    return results;
  }
  // Create a Neo4j-like record from our local objects
  createRecord(fieldNames, values) {
    const fieldLookup = {};
    fieldNames.forEach((name, index) => {
      fieldLookup[name] = index;
    });
    return {
      _fields: values,
      _fieldLookup: fieldLookup,
      get(key) {
        const index = this._fieldLookup[key];
        if (index === void 0) return null;
        return this._fields[index];
      }
    };
  }
  // Execute a query (simplified for basic CRUD operations)
  async executeQuery(query, params = {}) {
    const records = [];
    try {
      if (query.includes("MATCH (n")) {
        let label = null;
        const labelMatch = query.match(/MATCH \(n:(\w+)/);
        if (labelMatch) label = labelMatch[1];
        const projectId = params.projectId;
        const props = {};
        if (projectId) props.projectId = projectId;
        const nodes = this.findNodes(label, props);
        if (query.includes("OPTIONAL MATCH (n)-[r]->(m")) {
          for (const node of nodes) {
            records.push(this.createRecord(["n", "r", "m"], [node, null, null]));
            const outRels = this.findNodeRelationships(node.identity, "outgoing");
            for (const rel of outRels) {
              const targetNode = this.nodes.get(rel.end);
              if (targetNode) {
                records.push(this.createRecord(["n", "r", "m"], [node, rel, targetNode]));
              }
            }
          }
        } else if (query.includes("RETURN n")) {
          for (const node of nodes) {
            records.push(this.createRecord(["n"], [node]));
          }
        }
      } else if (query.includes("MERGE (f:File")) {
        const fileNode = this.findOrCreateNode(["File"], {
          path: params.filePath,
          projectId: params.projectId
        });
        records.push(this.createRecord(["fileNodeId"], [fileNode.identity]));
      } else if (query.includes("MERGE (fn:Function")) {
        const uniqueId = params.uniqueId;
        const props = params.props;
        const funcNode = this.findOrCreateNode(["Function"], props);
        const fileNodes = this.findNodes("File", {
          path: params.filePath,
          projectId: params.projectId
        });
        if (fileNodes.length > 0) {
          this.createRelationship(
            fileNodes[0].identity,
            funcNode.identity,
            "CONTAINS",
            {}
          );
        }
        records.push(this.createRecord(["relId"], ["1"]));
      } else if (query.includes("MERGE (c:Class")) {
        const uniqueId = params.uniqueId;
        const props = params.props;
        const classNode = this.findOrCreateNode(["Class"], props);
        const fileNodes = this.findNodes("File", {
          path: params.filePath,
          projectId: params.projectId
        });
        if (fileNodes.length > 0) {
          this.createRelationship(
            fileNodes[0].identity,
            classNode.identity,
            "CONTAINS",
            {}
          );
        }
        records.push(this.createRecord(["relId"], ["1"]));
      } else if (query.includes("RETURN 1 AS test")) {
        records.push(this.createRecord(["test"], [{ toNumber: () => 1 }]));
      } else if (query.includes("MATCH (n {projectId: $projectId}) RETURN count")) {
        const projectId = params.projectId;
        const matchingNodes = this.findNodes(null, { projectId });
        records.push(this.createRecord(["count"], [{ toNumber: () => matchingNodes.length }]));
      } else if (query.startsWith("CREATE (")) {
        const projectId = params.projectId;
        const fileNode = this.findOrCreateNode(["File"], {
          name: "index.ts",
          path: "/src/index.ts",
          projectId
        });
        const userServiceNode = this.findOrCreateNode(["File"], {
          name: "user.service.ts",
          path: "/src/services/user.service.ts",
          projectId
        });
        const userServiceClass = this.findOrCreateNode(["Class"], {
          name: "UserService",
          path: "/src/services/user.service.ts",
          projectId
        });
        this.createRelationship(
          fileNode.identity,
          userServiceNode.identity,
          "IMPORTS",
          {}
        );
        this.createRelationship(
          userServiceNode.identity,
          userServiceClass.identity,
          "CONTAINS",
          {}
        );
        records.push(this.createRecord(["result"], [true]));
      }
      await this.saveState();
      return records;
    } catch (error) {
      console.error("Error executing local database query:", error);
      throw error;
    }
  }
};
var localDb = null;
function getLocalDb() {
  if (!localDb) {
    localDb = new LocalGraphDatabase();
  }
  return localDb;
}
var LocalSession = class {
  constructor(db) {
    this.db = db;
  }
  async run(query, parameters) {
    const params = parameters || {};
    const records = await this.db.executeQuery(query, params);
    return {
      records
    };
  }
  async writeTransaction(work) {
    return work(this);
  }
  async close() {
  }
  // Implement other Session methods as needed
  lastBookmark() {
    return null;
  }
  lastBookmarks() {
    return [];
  }
  beginTransaction() {
    return this;
  }
  readTransaction(work) {
    return this.writeTransaction(work);
  }
};
export {
  LocalGraphDatabase,
  LocalSession,
  getLocalDb
};
