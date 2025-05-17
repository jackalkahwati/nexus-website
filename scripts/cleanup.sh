#!/bin/bash

# Remove build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Clean npm cache
npm cache clean --force

# Remove unused docker images and containers
if command -v docker &> /dev/null; then
    docker system prune -f
fi

# Clean up temporary files
find . -name "*.log" -type f -delete
find . -name ".DS_Store" -type f -delete

# Clean up package manager artifacts
rm -rf yarn.lock
rm -rf package-lock.json

# Reinstall dependencies
npm install

echo "Cleanup completed successfully" 