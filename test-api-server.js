// Simple Express server to test our local graph database implementation
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3005;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Path to our local graph database files
const DB_PATH = path.join(__dirname, 'data', 'graph-db');
const NODES_FILE = path.join(DB_PATH, 'nodes.json');
const RELS_FILE = path.join(DB_PATH, 'relationships.json');

// Make sure the database directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize empty database files if they don't exist
if (!fs.existsSync(NODES_FILE)) {
  fs.writeFileSync(NODES_FILE, '[]', 'utf8');
}
if (!fs.existsSync(RELS_FILE)) {
  fs.writeFileSync(RELS_FILE, '[]', 'utf8');
}

// API endpoint to get graph data
app.get('/api/graph', (req, res) => {
  const projectId = req.query.projectId || 'default-project';
  
  console.log(`API Request for projectId: ${projectId}`);
  console.log(`Database path: ${NODES_FILE}`);
  
  try {
    // Check if files exist
    if (!fs.existsSync(NODES_FILE)) {
      console.error(`Nodes file does not exist: ${NODES_FILE}`);
      return res.json(getMockData(projectId));
    }
    
    if (!fs.existsSync(RELS_FILE)) {
      console.error(`Relationships file does not exist: ${RELS_FILE}`);
      return res.json(getMockData(projectId));
    }
    
    // Read files
    const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
    const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
    
    console.log(`Read ${nodesData.length} nodes, ${relsData.length} relationships from database`);
    
    // Filter by projectId
    let filteredNodes = nodesData.filter(node => 
      node.properties && node.properties.projectId === projectId
    );
    
    // Log filtering details
    console.log(`Filtering for projectId: ${projectId}`);
    console.log(`Total nodes: ${nodesData.length}, Filtered nodes: ${filteredNodes.length}`);
    
    // If no nodes for this project, let's be more lenient (temp fix)
    if (filteredNodes.length === 0) {
      console.log(`No nodes found for projectId ${projectId}, returning all nodes`);
      filteredNodes = nodesData;
    }
    
    console.log(`Found ${filteredNodes.length} nodes for projectId: ${projectId}`);
    
    // Create nodes map for easier lookup
    const nodesMap = new Map();
    filteredNodes.forEach(node => {
      nodesMap.set(node.identity, {
        id: node.identity,
        type: node.labels[0] || 'Unknown',
        data: node.properties
      });
    });
    
    // Filter relationships
    const edges = [];
    relsData.forEach(rel => {
      if (nodesMap.has(rel.start) && nodesMap.has(rel.end)) {
        edges.push({
          id: rel.identity,
          source: rel.start,
          target: rel.end,
          label: rel.type,
          data: rel.properties
        });
      }
    });
    
    console.log(`Created ${edges.length} edges between filtered nodes`);
    
    const result = {
      nodes: Array.from(nodesMap.values()),
      edges: edges,
      source: 'test-server',
      timestamp: Date.now(),
      projectId
    };
    
    if (result.nodes.length === 0) {
      console.log('No nodes found for this projectId, returning mock data');
      // Return mock data if no nodes found
      return res.json(getMockData(projectId));
    }
    
    console.log(`Returning real data with ${result.nodes.length} nodes and ${result.edges.length} edges`);
    res.json(result);
  } catch (error) {
    console.error('Error retrieving graph data:', error);
    res.json(getMockData(projectId));
  }
});

// API endpoint to save data to graph
app.post('/api/graph', (req, res) => {
  const { node, relationship } = req.body;
  
  try {
    // Read existing data
    const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
    const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
    
    // Handle node data if provided
    if (node) {
      // Check if node already exists
      const existingNodeIndex = nodesData.findIndex(n => 
        n.identity === node.identity || 
        (n.properties && node.properties && 
         n.properties.path === node.properties.path && 
         n.properties.name === node.properties.name &&
         n.properties.projectId === node.properties.projectId)
      );
      
      if (existingNodeIndex >= 0) {
        // Update existing node
        nodesData[existingNodeIndex] = node;
      } else {
        // Add new node with generated ID if not provided
        if (!node.identity) {
          node.identity = Math.random().toString(36).substring(2, 15);
        }
        nodesData.push(node);
      }
      
      // Write updated nodes back to file
      fs.writeFileSync(NODES_FILE, JSON.stringify(nodesData, null, 2), 'utf8');
    }
    
    // Handle relationship data if provided
    if (relationship) {
      // Check if relationship already exists
      const existingRelIndex = relsData.findIndex(r => 
        r.identity === relationship.identity || 
        (r.start === relationship.start && 
         r.end === relationship.end && 
         r.type === relationship.type)
      );
      
      if (existingRelIndex >= 0) {
        // Update existing relationship
        relsData[existingRelIndex] = relationship;
      } else {
        // Add new relationship with generated ID if not provided
        if (!relationship.identity) {
          relationship.identity = Math.random().toString(36).substring(2, 15);
        }
        relsData.push(relationship);
      }
      
      // Write updated relationships back to file
      fs.writeFileSync(RELS_FILE, JSON.stringify(relsData, null, 2), 'utf8');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving graph data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize with some test data if empty
function initializeTestData() {
  try {
    const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
    const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
    
    if (nodesData.length === 0) {
      console.log('Initializing test data...');
      const mockData = getMockData('test-project');
      
      // Convert mock nodes to local DB format
      const newNodes = mockData.nodes.map(node => ({
        identity: node.id,
        labels: [node.type],
        properties: node.data
      }));
      
      // Convert mock edges to local DB format
      const newRels = mockData.edges.map(edge => ({
        identity: edge.id,
        type: edge.label,
        start: edge.source,
        end: edge.target,
        properties: edge.data || {}
      }));
      
      // Write test data
      fs.writeFileSync(NODES_FILE, JSON.stringify(newNodes, null, 2), 'utf8');
      fs.writeFileSync(RELS_FILE, JSON.stringify(newRels, null, 2), 'utf8');
      console.log('Test data initialized');
    }
  } catch (error) {
    console.error('Error initializing test data:', error);
  }
}

// Mock data generator for fallback
function getMockData(projectId) {
  // Create sample nodes with different types
  const sampleNodes = [
    { 
      id: '1', 
      type: 'File', 
      data: { 
        name: 'index.ts', 
        path: '/src/index.ts',
        projectId 
      } 
    },
    { 
      id: '2', 
      type: 'Class', 
      data: { 
        name: 'UserService', 
        path: '/src/services/user.service.ts',
        projectId 
      } 
    },
    { 
      id: '3', 
      type: 'Function', 
      data: { 
        name: 'getUsers', 
        path: '/src/controllers/user.controller.ts',
        projectId 
      } 
    },
    { 
      id: '4', 
      type: 'Method', 
      data: { 
        name: 'findById', 
        path: '/src/repositories/user.repository.ts',
        projectId 
      } 
    },
    { 
      id: '5', 
      type: 'Function', 
      data: { 
        name: 'validateUser', 
        path: '/src/utils/validation.ts',
        projectId 
      } 
    },
    { 
      id: '6', 
      type: 'Class', 
      data: { 
        name: 'AuthService', 
        path: '/src/services/auth.service.ts',
        projectId 
      } 
    },
    { 
      id: '7', 
      type: 'Method', 
      data: { 
        name: 'authenticate', 
        path: '/src/services/auth.service.ts',
        projectId 
      } 
    },
  ];

  // Create sample edges between nodes
  const sampleEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'IMPORTS' },
    { id: 'e1-3', source: '1', target: '3', label: 'IMPORTS' },
    { id: 'e2-4', source: '2', target: '4', label: 'CONTAINS' },
    { id: 'e3-5', source: '3', target: '5', label: 'CALLS' },
    { id: 'e3-4', source: '3', target: '4', label: 'CALLS' },
    { id: 'e1-6', source: '1', target: '6', label: 'IMPORTS' },
    { id: 'e6-7', source: '6', target: '7', label: 'CONTAINS' },
    { id: 'e3-7', source: '3', target: '7', label: 'CALLS' },
    { id: 'e5-7', source: '5', target: '7', label: 'CALLS' },
  ];

  return {
    nodes: sampleNodes,
    edges: sampleEdges,
    source: 'mock',
    timestamp: Date.now(),
    projectId
  };
}

// Initialize test data
initializeTestData();

// Start the server
app.listen(PORT, () => {
  console.log(`Test graph API server running at http://localhost:${PORT}`);
  console.log(`To get graph data: http://localhost:${PORT}/api/graph?projectId=test-project`);
});