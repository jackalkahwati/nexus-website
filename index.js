const http = require('http');
const port = process.env.PORT || 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <html>
      <head>
        <title>Nexus Simple</title>
        <style>
          body {
            font-family: -apple-system, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
            background-color: #f9fafb;
            color: #111827;
          }
          h1 {
            color: #2563eb;
          }
          .card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
          }
          .success {
            color: #16a34a;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Nexus Simple</h1>
        <div class="card">
          <p class="success">Server is running successfully!</p>
          <p>This is a simple Node.js server deployed on Railway.</p>
          <p>Server time: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `);
});

// Start listening on the specified port
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
