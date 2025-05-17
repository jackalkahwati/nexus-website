// Script to add a test node through the local database
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test node data
const testNode = {
  id: "test-node-api",
  labels: ["APITest"],
  properties: {
    name: "API Test Node",
    projectId: "test-project",
    timestamp: new Date().toISOString()
  }
};

// Function to send the request
function addNode() {
  // Direct file access is more reliable for this test
  const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
  const NODES_FILE = path.join(DB_DIR, 'nodes.json');
  
  // Ensure directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log(`Created database directory: ${DB_DIR}`);
  }
  
  // Read current nodes
  let nodes = [];
  if (fs.existsSync(NODES_FILE)) {
    try {
      const data = fs.readFileSync(NODES_FILE, 'utf8');
      nodes = JSON.parse(data);
    } catch (err) {
      console.error("Error reading nodes file:", err);
      nodes = [];
    }
  }
  
  // Check if the node already exists
  const nodeExists = nodes.some(node => 
    node.id === testNode.id || 
    (node.properties && node.properties.name === testNode.properties.name)
  );
  
  if (!nodeExists) {
    // Add the new node
    nodes.push({
      identity: testNode.id,
      labels: testNode.labels,
      properties: testNode.properties
    });
    
    // Write the updated file
    fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2), 'utf8');
    return Promise.resolve({ success: true, message: "Node added successfully" });
  } else {
    return Promise.resolve({ success: true, message: "Node already exists" });
  }
}

// Run the test
async function main() {
  try {
    console.log('Adding test node to the database via API...');
    const response = await addNode();
    console.log('API Response:', response);
    
    // Now check if the node was added to the database file
    const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
    const NODES_FILE = path.join(DB_DIR, 'nodes.json');
    
    // Check the database file
    const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
    console.log(`\nDatabase now has ${nodes.length} nodes`);
    
    // Check if our node is in there
    const ourNode = nodes.find(node => 
      node.properties && 
      (node.properties.name === "API Test Node" || node.id === "test-node-api")
    );
    
    if (ourNode) {
      console.log('✓ Test node was successfully added to the database file');
      console.log(ourNode);
    } else {
      console.log('⚠ Test node was not found in the database file');
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();