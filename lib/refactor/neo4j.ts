import neo4j, { Driver, Session, SessionConfig, Config, logging as neo4jLogging, Integer, Record as Neo4jRecord } from 'neo4j-driver';
import dotenv from 'dotenv';
import { getLocalDbInstance, LocalSession, ensureDbInitialized } from './local-graph-db';
import fs from 'fs';
import path from 'path';
import logger from '@/lib/logger';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create a singleton Neo4j driver
let driver: Driver | null = null;
let connectionVerified = false;
// Check for test mode flag file

// Use local database by default if environment variable is set
// or if the test mode flag file exists
const testFlagFile = path.join(process.cwd(), '.use-local-db');
const testModeEnabled = fs.existsSync(testFlagFile);
let useLocal = process.env.USE_LOCAL_DATABASE === 'true' || testModeEnabled || false;

if (testModeEnabled) {
  logger.warn('Local DB test flag file detected. Forcing local DB mode.');
  useLocal = true;
}
logger.info(`Database mode initialised. Using ${useLocal ? 'LOCAL FILE DB' : 'NEO4J'}`);

// Simplified Neo4j config
const neo4jConfig: Config = {
    logging: neo4jLogging.console( (process.env.NEO4J_LOG_LEVEL || 'warn') as any ),
    // Add other basic config if needed, but avoid complex trust/encryption for now if using neo4j://
};

/**
 * This function might throw errors if Neo4j is not configured correctly.
 * Use with try/catch and provide fallback behavior.
 */
export function getDriver(): Driver {
  if (useLocal) {
    throw new Error('Cannot get Neo4j driver when using local file-based database.');
  }
  if (!driver) {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      logger.error('[Neo4j Driver] Connection details not found. Switching to local DB mode.');
      useLocal = true;
      throw new Error('Neo4j connection details not found. Switched to local DB mode.');
    }

    try {
      logger.info(`[Neo4j Driver] Creating driver for URI: ${uri}`);
      driver = neo4j.driver(uri, neo4j.auth.basic(user, password), neo4jConfig);
      logger.info('[Neo4j Driver] Driver created.');
      // Add close handler
      process.on('exit', async () => { await closeDriver(); });
    } catch (error) {
      logger.error('[Neo4j Driver] Failed to create driver. Switching to local DB mode.', { error });
      useLocal = true;
      throw new Error(`Failed to create Neo4j driver. Switched to local DB mode. Error: ${error}`);
    }
  }
  
  return driver;
}

/**
 * Verify that the connection to Neo4j is working.
 * This is useful to detect connection issues early.
 */
export async function verifyConnection(): Promise<boolean> {
  if (useLocal) {
      try {
          await ensureDbInitialized();
          const localDb = getLocalDbInstance();
          const testQuery = await localDb.executeQuery('RETURN 1 AS test');
          const connectionVerified = testQuery.length > 0;
          logger.info('Local database connection verified successfully');
          return connectionVerified;
      } catch (error) {
          logger.error('Local DB verification failed:', { error });
          return false;
      }
  } else {
       // ... (Neo4j verification logic)
       if(!driver) {
           try { getDriver(); } catch (e) { /* ignore driver creation error for verification */ }
       }
       if (!driver) { // Check again
            logger.warn("[Verify] Cannot verify Neo4j, driver not created.");
            return false;
       }
       try {
           logger.info("[Verify] Verifying Neo4j connection...");
           // Ensure verifyConnectivity is used if driver exists
           await driver.verifyConnectivity();
           logger.info("[Verify] Neo4j connection verified.");
           return true;
       } catch (error) {
           logger.error("[Verify] Neo4j verification failed:", { error });
            // If Neo4j verify fails, TRY local DB as fallback
           if (!useLocal) { // Check if we aren't already using local
               logger.warn("[Verify] Neo4j failed, attempting local DB verification as fallback...");
               try {
                   // Use ensureDbInitialized here!
                   await ensureDbInitialized();
                   const localDb = getLocalDbInstance();
                   // NO init() call should be here
                   const testQuery = await localDb.executeQuery('RETURN 1 AS test');
                   const verified = testQuery.length > 0;
                   if(verified) logger.info("[Verify] Fallback to local DB verification successful.");
                   return verified;
               } catch (localError) {
                    logger.error("[Verify] Fallback to local DB verification also failed:", { error: localError });
                    return false;
               }
           } else {
                return false; // Already using local and it failed (or driver failed before)
           }
       }
  }
}

// Unified session getter
export function getSession(config?: SessionConfig): Session {
    if (useLocal) {
        try {
            logger.info("[LocalDB] Getting local database session...");
            const localDb = getLocalDbInstance();
            logger.info("[LocalDB] Returning local session wrapper.");
            return new LocalSession() as unknown as Session;
        } catch (error) {
            logger.error("Failed to create local database session:", { error });
            throw new Error(`Failed to create local database session: ${error}`);
        }
    } else {
        // Neo4j connection logic
        try {
             const currentDriver = getDriver();
             return currentDriver.session(config || { database: 'neo4j' });
        } catch (error) {
            logger.error('Failed to get Neo4j session, falling back to local DB mode.', { error });
            useLocal = true;
            try {
                 logger.info("[LocalDB Fallback] Getting local database session...");
                 const localDb = getLocalDbInstance();
                 return new LocalSession() as unknown as Session;
            } catch (localError) {
                 logger.error("[LocalDB Fallback] Failed to create local session:", { localError });
                 throw new Error(`Failed to create any database session after fallback: ${localError}`);
            }
        }
    }
}

// Graceful shutdown
export async function closeDriver() {
  if (!useLocal && driver) {
    logger.info('Closing Neo4j driver connection...');
    try {
      await driver.close();
      driver = null; // Reset driver instance
      logger.info('Neo4j driver closed.');
    } catch (error) {
      logger.error('Error closing Neo4j driver:', { error });
    }
  }
  // Close local DB too? Local DB saves periodically/on session close.
  const localDb = getLocalDbInstance(); // Get instance
  if (localDb && localDb.isDirty) {
    await localDb.saveState(true); // Force save on exit if dirty
  }
}

// Helper function for testing connection
export async function testConnection(): Promise<boolean> {
  let session: Session | null = null;

  try {
    session = getSession();
    const result = await session.run('RETURN 1 AS test');
    return (result.records[0].get('test') as Integer).toNumber() === 1;
  } catch (error) {
    console.error('Connection test failed:', error);
    logger.error('Connection test failed:', { error });

    // If we haven't already switched to local db mode, try that
    if (!useLocal) {
      console.log('Attempting to use local file-based database instead');
      logger.warn('Neo4j test failed, attempting local DB test...');
      useLocal = true;

      try {
        // Ensure initialized and test executeQuery
        const localDb = await ensureDbInitialized();
        const testQuery = await localDb.executeQuery('RETURN 1 AS test');
        const verified = testQuery.length > 0 && (testQuery[0].get('test') as Integer).toNumber() === 1;
        if(verified) logger.info('Local DB test successful.');
        return verified;
      } catch (localError) {
        console.error('Local database test failed too:', localError);
        logger.error('Local DB test failed:', { localError });
        return false;
      }
    }

    return false;
  } finally {
    if (session) {
      await session.close();
    }
  }
}

// Helper to seed demo data for testing
export async function seedDemoData(projectId: string): Promise<void> {
  let session: Session | null = null;
  
  try {
    session = getSession();
    
    // Check if data already exists for this project
    const checkResult = await session.run(
      `MATCH (n {projectId: $projectId}) RETURN count(n) as count`,
      { projectId }
    );
    
    if (checkResult.records[0].get('count').toNumber() > 0) {
      console.log(`Data already exists for project ${projectId}, skipping seed`);
      return;
    }
    
    // Create file nodes
    await session.run(`
      CREATE (index:File {name: 'index.ts', path: '/src/index.ts', projectId: $projectId})
      CREATE (userService:File {name: 'user.service.ts', path: '/src/services/user.service.ts', projectId: $projectId})
      CREATE (userController:File {name: 'user.controller.ts', path: '/src/controllers/user.controller.ts', projectId: $projectId})
      CREATE (userRepo:File {name: 'user.repository.ts', path: '/src/repositories/user.repository.ts', projectId: $projectId})
      CREATE (validation:File {name: 'validation.ts', path: '/src/utils/validation.ts', projectId: $projectId})
      CREATE (auth:File {name: 'auth.service.ts', path: '/src/services/auth.service.ts', projectId: $projectId})
      
      // Create Classes
      CREATE (userServiceClass:Class {name: 'UserService', path: '/src/services/user.service.ts', projectId: $projectId})
      CREATE (userRepoClass:Class {name: 'UserRepository', path: '/src/repositories/user.repository.ts', projectId: $projectId})
      CREATE (authServiceClass:Class {name: 'AuthService', path: '/src/services/auth.service.ts', projectId: $projectId})
      CREATE (userControllerClass:Class {name: 'UserController', path: '/src/controllers/user.controller.ts', projectId: $projectId})
      
      // Create Methods and Functions
      CREATE (getUserMethod:Function {name: 'getUser', path: '/src/services/user.service.ts', projectId: $projectId})
      CREATE (createUserMethod:Function {name: 'createUser', path: '/src/services/user.service.ts', projectId: $projectId})
      CREATE (findByIdMethod:Function {name: 'findById', path: '/src/repositories/user.repository.ts', projectId: $projectId})
      CREATE (validateUserFunc:Function {name: 'validateUser', path: '/src/utils/validation.ts', projectId: $projectId})
      CREATE (authenticateMethod:Function {name: 'authenticate', path: '/src/services/auth.service.ts', projectId: $projectId})
      CREATE (getUserCtrlMethod:Function {name: 'getUser', path: '/src/controllers/user.controller.ts', projectId: $projectId})
      CREATE (createUserCtrlMethod:Function {name: 'createUser', path: '/src/controllers/user.controller.ts', projectId: $projectId})
      
      // Connect Files to Classes
      CREATE (userService)-[:CONTAINS]->(userServiceClass)
      CREATE (userRepo)-[:CONTAINS]->(userRepoClass)
      CREATE (auth)-[:CONTAINS]->(authServiceClass)
      CREATE (userController)-[:CONTAINS]->(userControllerClass)
      
      // Connect Classes to Methods
      CREATE (userServiceClass)-[:CONTAINS]->(getUserMethod)
      CREATE (userServiceClass)-[:CONTAINS]->(createUserMethod)
      CREATE (userRepoClass)-[:CONTAINS]->(findByIdMethod)
      CREATE (authServiceClass)-[:CONTAINS]->(authenticateMethod)
      CREATE (userControllerClass)-[:CONTAINS]->(getUserCtrlMethod)
      CREATE (userControllerClass)-[:CONTAINS]->(createUserCtrlMethod)
      
      // Connect Methods with CALLS relationships
      CREATE (getUserCtrlMethod)-[:CALLS]->(getUserMethod)
      CREATE (createUserCtrlMethod)-[:CALLS]->(createUserMethod)
      CREATE (getUserMethod)-[:CALLS]->(findByIdMethod)
      CREATE (createUserMethod)-[:CALLS]->(validateUserFunc)
      CREATE (authenticateMethod)-[:CALLS]->(getUserMethod)
      
      // Connect Files with IMPORTS
      CREATE (index)-[:IMPORTS]->(userService)
      CREATE (index)-[:IMPORTS]->(userController)
      CREATE (userController)-[:IMPORTS]->(userService)
      CREATE (userService)-[:IMPORTS]->(userRepo)
      CREATE (auth)-[:IMPORTS]->(userService)
    `, { projectId });
    
    console.log(`✅ Successfully seeded demo data for project ${projectId}`);
    
  } catch (error) {
    console.error(`Error seeding demo data for project ${projectId}:`, error);
    throw error;
  } finally {
    if (session) {
      await session.close();
    }
  }
}

// Function to switch DB mode (optional, for testing)
export function useLocalDatabase(local: boolean) {
  useLocal = local;
  logger.warn(`Database mode switched. Using ${useLocal ? 'LOCAL FILE DB' : 'NEO4J'}`);
}