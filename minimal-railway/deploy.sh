#!/bin/bash

# Simple Railway deployment script
set -e

echo "=== Minimal Railway Deployment ==="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: package.json not found! Make sure you're running this from the minimal-railway directory."
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

echo "Creating a new project? (y/n)"
read -r create_new

if [ "$create_new" = "y" ]; then
  # Create a new project
  echo "Creating a new Railway project..."
  railway init
else
  # Link to existing project
  echo "Linking to existing Railway project..."
  railway link
fi

# Set variables
railway variables --set "RAILWAY_NIXPACKS_ENABLE=true"

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo "Deployment initiated! Checking status..."
railway status

echo "Opening Railway dashboard..."
railway open 