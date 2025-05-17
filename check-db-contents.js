// Script to check the contents of our local database files
const fs = require('fs');
const path = require('path');

// Define paths to our database files
const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
const NODES_FILE = path.join(DB_DIR, 'nodes.json');
const RELS_FILE = path.join(DB_DIR, 'relationships.json');

// Test API server database files
const TEST_DB_PATH = path.join(__dirname, '.local-graph-db');
const TEST_NODES_FILE = path.join(TEST_DB_PATH, 'nodes.json');
const TEST_RELS_FILE = path.join(TEST_DB_PATH, 'relationships.json');

// Check main database files
console.log('=== CHECKING MAIN DATABASE FILES ===');
if (fs.existsSync(DB_DIR)) {
  console.log(`Database directory exists: ${DB_DIR}`);
  
  // Check nodes file
  if (fs.existsSync(NODES_FILE)) {
    try {
      const nodesData = fs.readFileSync(NODES_FILE, 'utf8');
      const nodes = JSON.parse(nodesData);
      console.log(`Nodes file exists with ${nodes.length} nodes`);
      
      if (nodes.length > 0) {
        console.log('\nFirst node:');
        console.log(JSON.stringify(nodes[0], null, 2));
        
        // Count nodes by type
        const typeCounts = {};
        nodes.forEach(node => {
          const type = node.labels && node.labels[0] || 'Unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        console.log('\nNode types:');
        Object.entries(typeCounts).forEach(([type, count]) => {
          console.log(`- ${type}: ${count} nodes`);
        });
      }
    } catch (error) {
      console.error(`Error reading nodes file: ${error.message}`);
    }
  } else {
    console.log(`Nodes file does not exist: ${NODES_FILE}`);
  }
  
  // Check relationships file
  if (fs.existsSync(RELS_FILE)) {
    try {
      const relsData = fs.readFileSync(RELS_FILE, 'utf8');
      const rels = JSON.parse(relsData);
      console.log(`\nRelationships file exists with ${rels.length} relationships`);
      
      if (rels.length > 0) {
        console.log('\nFirst relationship:');
        console.log(JSON.stringify(rels[0], null, 2));
      }
    } catch (error) {
      console.error(`Error reading relationships file: ${error.message}`);
    }
  } else {
    console.log(`Relationships file does not exist: ${RELS_FILE}`);
  }
} else {
  console.log(`Database directory does not exist: ${DB_DIR}`);
}

// Check test API server database files
console.log('\n=== CHECKING TEST API SERVER DATABASE FILES ===');
if (fs.existsSync(TEST_DB_PATH)) {
  console.log(`Test database directory exists: ${TEST_DB_PATH}`);
  
  // Check nodes file
  if (fs.existsSync(TEST_NODES_FILE)) {
    try {
      const nodesData = fs.readFileSync(TEST_NODES_FILE, 'utf8');
      const nodes = JSON.parse(nodesData);
      console.log(`Test nodes file exists with ${nodes.length} nodes`);
      
      if (nodes.length > 0) {
        console.log('\nFirst test node:');
        console.log(JSON.stringify(nodes[0], null, 2));
      }
    } catch (error) {
      console.error(`Error reading test nodes file: ${error.message}`);
    }
  } else {
    console.log(`Test nodes file does not exist: ${TEST_NODES_FILE}`);
  }
  
  // Check relationships file
  if (fs.existsSync(TEST_RELS_FILE)) {
    try {
      const relsData = fs.readFileSync(TEST_RELS_FILE, 'utf8');
      const rels = JSON.parse(relsData);
      console.log(`\nTest relationships file exists with ${rels.length} relationships`);
      
      if (rels.length > 0) {
        console.log('\nFirst test relationship:');
        console.log(JSON.stringify(rels[0], null, 2));
      }
    } catch (error) {
      console.error(`Error reading test relationships file: ${error.message}`);
    }
  } else {
    console.log(`Test relationships file does not exist: ${TEST_RELS_FILE}`);
  }
} else {
  console.log(`Test database directory does not exist: ${TEST_DB_PATH}`);
}