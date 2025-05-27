#!/bin/bash

# Deploy to Railway helper script
set -e

echo "=== Railway Deployment Helper ==="
echo "Preparing to deploy to Railway..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "ERROR: package.json not found! Make sure you're running this from the project root."
  exit 1
fi

# Make sure we have the railway CLI
if ! command -v railway &> /dev/null; then
  echo "Railway CLI not found. Installing..."
  npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
  echo "You're not logged in to Railway. Please login:"
  railway login
fi

# Update package-lock.json to match package.json
echo "Updating package-lock.json to match package.json..."
rm -f package-lock.json
npm install --package-lock-only

# Set environment variables to ensure Node 20 is used
railway variables --set "NODE_VERSION=20.x"

# Copy our optimized Dockerfile
echo "Using optimized Dockerfile for Railway..."
cp Dockerfile.railway Dockerfile

# Create a basic railway.json if it doesn't exist
if [ ! -f "railway.json" ]; then
  echo "Creating railway.json configuration..."
  cat > railway.json << EOF
{
  "schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile",
    "buildCommand": "docker build -t app ."
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
EOF
fi

# Create a .dockerignore file if it doesn't exist
if [ ! -f ".dockerignore" ]; then
  echo "Creating .dockerignore file..."
  cat > .dockerignore << EOF
node_modules
.git
.github
.next
EOF
fi

# Package the project for Railway
echo "Creating deployment package..."
tar --exclude=node_modules --exclude=.git --exclude=.next -czf railway-deploy.tar.gz .

echo "Deployment package created. Now deploying to Railway..."
railway up --detach

echo "Deployment initiated! Check the Railway dashboard for status."
railway status

echo "Opening Railway dashboard..."
railway open