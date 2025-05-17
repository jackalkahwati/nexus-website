#!/bin/bash

# Manual deployment script for Railway
set -e

echo "=== Railway Manual Deployment Helper ==="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: package.json not found! Make sure you're running this from the project root."
  exit 1
fi

# Install Railway CLI if needed
if ! command -v railway &> /dev/null; then
  echo "Installing Railway CLI..."
  npm install -g @railway/cli
fi

# Login to Railway if needed
if ! railway whoami &> /dev/null; then
  echo "Please login to Railway:"
  railway login
fi

# Create simplified Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Debug
RUN ls -la

# Copy all files
COPY . .

# Debug after copy
RUN ls -la
RUN cat package.json || echo "No package.json found"

# Install dependencies only if package.json exists
RUN if [ -f "package.json" ]; then npm install; else echo "No package.json found"; exit 1; fi

# Build the app
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
EOF

# Create a minimal railway.json
cat > railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "./Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE"
  }
}
EOF

# Simplify .dockerignore
cat > .dockerignore << EOF
.git
.github
EOF

echo "Prepared deployment files."
echo "Would you like to manually upload the project to Railway? (y/n)"
read -r answer

if [ "$answer" = "y" ]; then
  echo "Deploying to Railway..."
  railway up
  
  echo "Showing deployment status..."
  railway status
  
  echo "Opening Railway dashboard..."
  railway open
else
  echo "Skipping automatic deployment."
  echo "To deploy manually, run: railway up"
fi 