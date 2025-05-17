#\!/bin/bash

# Script to prepare a minimal package for Railway deployment
set -e

echo "Building minimal Railway deployment package..."

# Create a clean directory for the deployment package
rm -rf railway-deploy || true
mkdir -p railway-deploy

# Copy only essential files
echo "Copying essential files..."
cp package.json railway-deploy/
cp next.config.js railway-deploy/ || true
cp next.config.mjs railway-deploy/ || true
cp tsconfig.json railway-deploy/ || true
cp -r app railway-deploy/ || true
cp -r components railway-deploy/ || true
cp -r lib railway-deploy/ || true
cp -r types railway-deploy/ || true
cp -r public railway-deploy/ || true
cp -r contexts railway-deploy/ || true
cp -r hooks railway-deploy/ || true
cp -r prisma railway-deploy/ || true
cp postcss.config.cjs railway-deploy/ || true
cp tailwind.config.js railway-deploy/ || true

# Create a simplified Docker file directly in the package
cat > railway-deploy/Dockerfile << 'DOCKERFILE'
FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files first and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build application
RUN npm run build

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

# Start application
CMD ["npm", "start"]
DOCKERFILE

# Create simple railway.json
cat > railway-deploy/railway.json << 'RAILWAY_JSON'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "numReplicas": 1
  }
}
RAILWAY_JSON

# Create an empty .dockerignore to prevent any issues
cat > railway-deploy/.dockerignore << 'DOCKERIGNORE'
node_modules
.next
DOCKERIGNORE

echo "Deployment package created in railway-deploy/"
echo "To deploy from this package:"
echo "  cd railway-deploy"
echo "  railway link"
echo "  railway up"

chmod +x build-railway-package.sh
./build-railway-package.sh
