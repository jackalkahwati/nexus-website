// Simple script to set up test mode - run this to see what's going on
const fs = require('fs');
const path = require('path');

// Create a test flag file to indicate we're in test mode
const testFlagFile = path.join(__dirname, '.use-local-db');
fs.writeFileSync(testFlagFile, 'true', 'utf8');

console.log('Test mode enabled - local database will be used');
console.log('Use the test-api-server.js script to access the graph data:');
console.log('  node test-api-server.js');
console.log('\nThe test server runs on http://localhost:3005');
console.log('You can access graph data at: http://localhost:3005/api/graph?projectId=test-project');