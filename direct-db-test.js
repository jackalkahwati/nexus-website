// Simple script to directly test database access
const fs = require('fs');
const path = require('path');

// Database path configuration
const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
const NODES_FILE = path.join(DB_DIR, 'nodes.json');
const RELS_FILE = path.join(DB_DIR, 'relationships.json');

console.log('Checking database files:');
console.log(`Nodes file path: ${NODES_FILE}`);
console.log(`Relationships file path: ${RELS_FILE}`);

if (!fs.existsSync(NODES_FILE)) {
  console.error(`ERROR: Nodes file does not exist!`);
  process.exit(1);
}

if (!fs.existsSync(RELS_FILE)) {
  console.error(`ERROR: Relationships file does not exist!`);
  process.exit(1);
}

console.log('Reading database files...');

try {
  const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
  console.log(`Successfully read nodes file. Contains ${nodesData.length} nodes.`);
  
  // Check for projectId
  const nodesWithProjectId = nodesData.filter(node => 
    node.properties && node.properties.projectId === 'nexus-core'
  );
  
  console.log(`Found ${nodesWithProjectId.length} nodes with projectId = 'nexus-core'`);
  
  if (nodesWithProjectId.length > 0) {
    console.log('First node with projectId = nexus-core:');
    console.log(JSON.stringify(nodesWithProjectId[0], null, 2));
  }
  
  // Check relationships
  const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
  console.log(`Successfully read relationships file. Contains ${relsData.length} relationships.`);
  
  if (relsData.length > 0) {
    console.log('First relationship:');
    console.log(JSON.stringify(relsData[0], null, 2));
  }
  
} catch (error) {
  console.error(`ERROR reading or parsing database files:`, error);
  process.exit(1);
}

console.log('Database files are valid and contain data.');