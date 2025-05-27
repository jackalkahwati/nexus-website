// Simple test script to verify local database works
const { getLocalDb } = require('./lib/refactor/local-graph-db');
const fs = require('fs');
const path = require('path');

async function testLocalDb() {
  try {
    console.log('Testing local database...');
    const localDb = getLocalDb();
    await localDb.init();
    
    console.log('Database initialized');
    
    // Test creating nodes
    const fileNode = localDb.findOrCreateNode(['File'], { 
      name: 'test.ts', 
      path: '/src/test.ts', 
      projectId: 'test-project' 
    });
    
    console.log('Created file node:', fileNode);
    
    const classNode = localDb.findOrCreateNode(['Class'], { 
      name: 'TestClass', 
      path: '/src/test.ts', 
      projectId: 'test-project' 
    });
    
    console.log('Created class node:', classNode);
    
    // Test creating relationship
    const relationship = localDb.createRelationship(
      fileNode.identity,
      classNode.identity,
      'CONTAINS',
      { created: new Date().toISOString() }
    );
    
    console.log('Created relationship:', relationship);
    
    // Test query execution
    const testQuery = await localDb.executeQuery('RETURN 1 AS test');
    console.log('Test query result:', testQuery[0].get('test').toNumber());
    
    // Test finding nodes
    const foundNodes = localDb.findNodes('File', { projectId: 'test-project' });
    console.log('Found nodes:', foundNodes.length);
    
    // Test finding relationships
    const foundRels = localDb.findNodeRelationships(fileNode.identity);
    console.log('Found relationships:', foundRels.length);
    
    // Save state
    await localDb.saveState();
    
    // Verify files exist
    const dbPath = path.join(process.cwd(), '.local-graph-db');
    const nodesFile = path.join(dbPath, 'nodes.json');
    const relsFile = path.join(dbPath, 'relationships.json');
    
    console.log('Nodes file exists:', fs.existsSync(nodesFile));
    console.log('Relationships file exists:', fs.existsSync(relsFile));
    
    console.log('Local database test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLocalDb();