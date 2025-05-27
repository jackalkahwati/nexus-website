#!/bin/sh
set -e

# Print key environment information for debugging
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "Starting in $(pwd)"
echo "Listing key files and directories:"
ls -la
echo "Checking for Next.js config:"
ls -la next.config*
echo "Checking .next directory:"
ls -la .next || echo ".next directory not found"

# Write a deployment-status.json file for status checking
cat > deployment-status.json << 'EOL'
{
  "status": "initializing",
  "timestamp": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
  "version": "1.0.0",
  "environment": "railway"
}
EOL

# Create simple server.js file as a reliable fallback
if [ ! -f "server.js" ]; then
  echo "Creating simple server.js fallback..."
  cat > server.js << 'EOL'
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/api/health') {
    // Read deployment status
    try {
      const status = fs.readFileSync('./deployment-status.json', 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(status);
    } catch (error) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'healthy', 
        timestamp: Date.now(),
        error: 'Could not read deployment status file'
      }));
    }
    return;
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nexus Core - Railway Deployment</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f5f5f5; }
          .container { text-align: center; padding: 2rem; border-radius: 10px; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px; }
          h1 { color: #333; }
          p { color: #666; margin-bottom: 1.5rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nexus Core - Railway Deployment</h1>
          <p>This is a temporary page while Next.js initializes.</p>
          <p>Server is running on Railway!</p>
        </div>
      </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOL
fi

# Create a dedicated health check API route if it doesn't exist
if [ ! -d "app/api/health" ]; then
  echo "Creating health check API endpoint..."
  mkdir -p app/api/health
  cat > app/api/health/route.js << 'EOL'
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Try to read deployment status file
    const statusPath = path.join(process.cwd(), 'deployment-status.json');
    let statusData = { status: 'healthy', timestamp: new Date().toISOString() };
    
    try {
      if (fs.existsSync(statusPath)) {
        const fileData = fs.readFileSync(statusPath, 'utf8');
        statusData = JSON.parse(fileData);
      }
    } catch (error) {
      console.error('Error reading deployment status:', error);
    }
    
    return NextResponse.json(statusData);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Health check failed', 
      timestamp: new Date().toISOString() 
    }, { status: 500 });
  }
}
EOL
fi

# Try to start the database migrations safely
if [ -n "$DATABASE_URL" ]; then
  echo "Database URL is configured"
  
  # Update deployment status
  cat > deployment-status.json << 'EOL'
{
  "status": "db_connecting",
  "timestamp": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
  "version": "1.0.0",
  "environment": "railway"
}
EOL
  
  # Run database migrations with retry logic
  MAX_RETRIES=5
  RETRY_COUNT=0
  DB_READY=false
  
  while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$DB_READY" = "false" ]; do
    if npx prisma db pull --force; then
      echo "✅ Database schema pulled successfully"
      DB_READY=true
      
      if npx prisma migrate deploy; then
        echo "✅ Migrations completed successfully"
      else
        echo "⚠️ Migrations failed but continuing"
      fi
    else
      RETRY_COUNT=$((RETRY_COUNT + 1))
      echo "⚠️ Could not connect to database, retry $RETRY_COUNT of $MAX_RETRIES"
      sleep 5
    fi
  done
  
  if [ "$DB_READY" = "false" ]; then
    echo "⚠️ Could not connect to database after $MAX_RETRIES attempts, but continuing anyway"
  fi
else
  echo "No DATABASE_URL configured, skipping migrations"
fi

# Update deployment status
cat > deployment-status.json << 'EOL'
{
  "status": "starting",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "environment": "railway"
}
EOL

# Try to start the Next.js app, but fall back to server.js if it fails
# Check for the standalone server file instead of BUILD_ID
if [ -f ".next/standalone/server.js" ]; then
  echo "🚀 Starting Next.js application..."
  # Update deployment status
  cat > deployment-status.json << 'EOL'
{
  "status": "running",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "environment": "railway"
}
EOL
  # Run the standalone server
  exec node .next/standalone/server.js || (
    echo "⚠️ Next.js failed to start, using fallback"
    # Update deployment status
    cat > deployment-status.json << 'EOL'
{
  "status": "fallback",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "environment": "railway",
  "error": "Next.js startup failed"
}
EOL
    node server.js
  )
else
  echo "⚠️ No valid Next.js build found, using server.js fallback"
  # Update deployment status
  cat > deployment-status.json << 'EOL'
{
  "status": "fallback",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "environment": "railway",
  "error": "No valid Next.js build found"
}
EOL
  exec node server.js
fi 