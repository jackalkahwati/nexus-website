#!/bin/bash

# Simple Railway deployment script using Nixpacks
set -e

echo "=== Railway Nixpacks Deployment Helper ==="

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

# Clean up build artifacts to ensure a fresh build
echo "Cleaning up previous build artifacts..."
if [ -d ".next" ]; then
  rm -rf .next
fi

# Ensure we have a .gitignore that excludes node_modules and .next
if [ ! -f ".gitignore" ] || ! grep -q "node_modules" .gitignore; then
  echo "Updating .gitignore..."
  echo "node_modules" >> .gitignore
  echo ".next" >> .gitignore
fi

echo "Ready to deploy to Railway using Nixpacks..."
echo "Deploying..."

# Deploy to Railway using Nixpacks
railway up

echo "Deployment initiated! Checking status..."
railway status

echo "Opening Railway dashboard..."
railway open 