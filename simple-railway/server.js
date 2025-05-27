const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic info about the deployment
const deploymentInfo = {
  name: 'Nexus Core',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'production',
  timestamp: new Date().toISOString()
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    ...deploymentInfo,
    uptime: process.uptime()
  });
});

// Main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nexus Core - Railway Deployment</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background-color: #f5f5f5; }
          .container { text-align: center; padding: 2rem; border-radius: 10px; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px; }
          h1 { color: #333; }
          p { color: #666; margin-bottom: 1.5rem; }
          .status { display: inline-block; background-color: #4CAF50; color: white; padding: 0.5rem 1rem; border-radius: 4px; }
          .info { margin-top: 1rem; text-align: left; background-color: #f8f9fa; padding: 1rem; border-radius: 4px; }
          .info p { margin: 0.5rem 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nexus Core - Railway Deployment</h1>
          <p>This is a minimalist deployment on Railway.</p>
          <div class="status">Server is running</div>
          
          <div class="info">
            <p><strong>Version:</strong> ${deploymentInfo.version}</p>
            <p><strong>Environment:</strong> ${deploymentInfo.environment}</p>
            <p><strong>Deployed:</strong> ${deploymentInfo.timestamp}</p>
            <p><strong>Health check:</strong> <a href="/api/health">/api/health</a></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 