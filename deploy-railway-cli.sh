#!/bin/bash

# Non-interactive Railway deployment script
set -e

echo "Setting up Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Create clean minimal deployment package
echo "Creating minimal deployment package..."
rm -rf minimal-deploy || true
mkdir -p minimal-deploy

# Copy only the essential files
cp package.json minimal-deploy/
cp -r app minimal-deploy/ 2>/dev/null || true
cp -r components minimal-deploy/ 2>/dev/null || true
cp -r lib minimal-deploy/ 2>/dev/null || true
cp -r public minimal-deploy/ 2>/dev/null || true
cp -r contexts minimal-deploy/ 2>/dev/null || true
cp -r hooks minimal-deploy/ 2>/dev/null || true
cp -r types minimal-deploy/ 2>/dev/null || true
cp -r prisma minimal-deploy/ 2>/dev/null || true
cp *.js minimal-deploy/ 2>/dev/null || true
cp *.mjs minimal-deploy/ 2>/dev/null || true
cp *.cjs minimal-deploy/ 2>/dev/null || true
cp tsconfig.json minimal-deploy/ 2>/dev/null || true

# Create simple Dockerfile
cat > minimal-deploy/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files first
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
EOF

# Create railway.json
cat > minimal-deploy/railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "numReplicas": 1
  }
}
EOF

# Create .dockerignore
cat > minimal-deploy/.dockerignore << 'EOF'
node_modules
.next
EOF

echo "Deployment package created in minimal-deploy/"
echo ""
echo "To deploy, run the following commands manually:"
echo "  cd minimal-deploy"
echo "  railway login --browserless"
echo "  railway link"
echo "  railway up"
echo ""
echo "This method requires interactive terminal for Railway CLI to work properly."
chmod +x deploy-railway-cli.sh