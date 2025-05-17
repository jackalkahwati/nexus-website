#\!/bin/bash

# Create a deployment package
echo "Creating deployment package..."

# Ensure necessary dirs exist
mkdir -p deploy-package

# Copy essential files
cp package.json deploy-package/
cp Dockerfile deploy-package/
cp railway.json deploy-package/
cp -r app deploy-package/
cp -r components deploy-package/
cp -r lib deploy-package/
cp -r public deploy-package/
cp -r types deploy-package/
cp next.config.js deploy-package/
cp next.config.mjs deploy-package/
cp postcss.config.cjs deploy-package/
cp tailwind.config.js deploy-package/
cp tsconfig.json deploy-package/

# Create a simple .dockerignore
cat > deploy-package/.dockerignore << 'DOCKERIGNORE'
node_modules
.next
