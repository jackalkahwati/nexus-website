// Script to test the Next.js API endpoints
const http = require('http');
const fs = require('fs');
const path = require('path');

// Database file paths
const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
const NODES_FILE = path.join(DB_DIR, 'nodes.json');
const RELS_FILE = path.join(DB_DIR, 'relationships.json');

// Ensure the directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log(`Created database directory: ${DB_DIR}`);
}

// Initialize database files with empty arrays if they don't exist
if (!fs.existsSync(NODES_FILE)) {
  fs.writeFileSync(NODES_FILE, JSON.stringify([]));
  console.log(`Created empty nodes file: ${NODES_FILE}`);
}

if (!fs.existsSync(RELS_FILE)) {
  fs.writeFileSync(RELS_FILE, JSON.stringify([]));
  console.log(`Created empty relationships file: ${RELS_FILE}`);
}

// Add a test node if none exists
try {
  const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
  const testNodeId = 'test-123';
  const projectId = 'test-project';
  
  if (!nodes.find(node => node.properties && node.properties.name === 'Test Node')) {
    const testNode = {
      identity: testNodeId,
      labels: ['TestNode'],
      properties: {
        name: 'Test Node',
        created: new Date().toISOString(),
        testValue: 42,
        projectId: projectId
      }
    };
    nodes.push(testNode);
    fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
    console.log('Added a test node to the database');
  } else {
    console.log(`Test node already exists in database with ${nodes.length} total nodes`);
  }
} catch (error) {
  console.error('Error managing test nodes:', error);
}

// Function to fetch data from the Next.js API
function fetchFromNextAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005, // Test API server port
      path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.end();
  });
}

// Test the refactor graph API
async function testRefactorAPI() {
  try {
    const projectId = 'nexus-core';
    console.log(`Testing API: /api/graph?projectId=${projectId}`);
    const data = await fetchFromNextAPI(`/api/graph?projectId=${projectId}`);
    
    console.log(`API Response Source: ${data.source}`);
    
    if (data.nodes) {
      console.log(`Found ${data.nodes.length} nodes`);
      
      if (data.source === 'mock') {
        console.log('⚠ API returned mock data, not using our local database');
      } else {
        console.log('✓ API returned data from the local database');
        
        // List some of the nodes
        console.log('\nFirst few nodes:');
        data.nodes.slice(0, 3).forEach(node => {
          console.log(`- ${node.id}: ${node.type} - ${JSON.stringify(node.data)}`);
        });
      }
    }
    
    if (data.edges) {
      console.log(`\nFound ${data.edges.length} edges`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Run the test after waiting a moment for the server to be ready
console.log('Waiting 5 seconds for Next.js server to be ready...');
setTimeout(() => {
  testRefactorAPI();
}, 5000);