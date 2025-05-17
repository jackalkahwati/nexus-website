// Simple script to test connection to Next.js server
const http = require('http');

function testConnection(port) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      resolve({
        status: res.statusCode,
        message: `Server is running on port ${port}`
      });
    });
    
    req.on('error', (error) => {
      reject({
        status: 'error',
        message: `Cannot connect to port ${port}: ${error.message}`
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        status: 'timeout',
        message: `Connection to port ${port} timed out`
      });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('Testing connections to servers...');
  
  // Test Next.js server
  try {
    const nextResult = await testConnection(3002);
    console.log('✅ Next.js Server:', nextResult.message);
  } catch (error) {
    console.log('❌ Next.js Server:', error.message);
  }
  
  // Test API server
  try {
    const apiResult = await testConnection(3005);
    console.log('✅ API Server:', apiResult.message);
  } catch (error) {
    console.log('❌ API Server:', error.message);
  }
}

runTests();