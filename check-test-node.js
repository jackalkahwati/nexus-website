// Simple script to check if our test node exists
const http = require('http');

// Function to fetch data from the test API
function fetchFromTestAPI(projectId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3005,
      path: `/api/graph?projectId=${projectId}`,
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

// Main function to check for nodes
async function checkNodes() {
  try {
    // Check for our custom test node
    console.log('Fetching data from test API for project "initial-analysis"...');
    const initialAnalysisData = await fetchFromTestAPI('initial-analysis');
    
    if (!initialAnalysisData.nodes || !Array.isArray(initialAnalysisData.nodes)) {
      console.error('Error: Invalid response format - nodes array missing');
      process.exit(1);
    }
    
    console.log(`Received ${initialAnalysisData.nodes.length} nodes and ${initialAnalysisData.edges?.length || 0} edges`);
    
    // Look for our test node
    const testNode = initialAnalysisData.nodes.find(node => node.id === 'test-123');
    
    if (testNode) {
      console.log('\n✓ Test node found!');
      console.log('Test node details:');
      console.log(JSON.stringify(testNode, null, 2));
    } else {
      console.error('\n✗ Test node not found. Check if the server is using the right database files.');
      process.exit(1);
    }
    
    // Now check for the original test project nodes
    console.log('\nFetching data from test API for project "test-project"...');
    const testProjectData = await fetchFromTestAPI('test-project');
    
    if (!testProjectData.nodes || !Array.isArray(testProjectData.nodes)) {
      console.error('Error: Invalid response format - nodes array missing');
      process.exit(1);
    }
    
    console.log(`Received ${testProjectData.nodes.length} nodes and ${testProjectData.edges?.length || 0} edges`);
    
    // Look for UserService node
    const userServiceNode = testProjectData.nodes.find(node => 
      node.data && node.data.name === 'UserService'
    );
    
    if (userServiceNode) {
      console.log('\n✓ Original test node "UserService" found!');
      console.log('UserService node details:');
      console.log(JSON.stringify(userServiceNode, null, 2));
      console.log('\nThe local graph database is working correctly with real data for both projects!');
    } else {
      console.error('\n✗ Original test nodes not found. Check if the server is using the right database files.');
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the check
checkNodes();