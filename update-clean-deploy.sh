#!/bin/bash

# Script to update the clean Railway deployment directory
set -e

echo "=== Updating Clean Railway Deployment Directory ==="

# Ensure the clean directory exists
mkdir -p clean-railway-deploy

# Copy essential project files
echo "Copying project files..."
cp package.json next.config.js tsconfig.json tailwind.config.js postcss.config.cjs .env.production clean-railway-deploy/

# Copy source directories
echo "Copying source directories..."
cp -r app components lib public prisma clean-railway-deploy/

# Configuration files are not copied as they should remain stable

echo "Clean deployment directory updated successfully!"
echo "To deploy, run: cd clean-railway-deploy && ./deploy.sh" 