#\!/bin/bash

echo "Testing Nixpacks configuration..."

# Check Node version
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Verify package.json engines
echo "Checking package.json engines configuration:"
grep -A 3 '"engines"' package.json

# Verify Nixpacks configuration files
echo "Checking Nixpacks configuration:"
echo "  - nixpacks.json exists: $(test -f nixpacks.json && echo Yes || echo No)"
echo "  - nixpacks.toml exists: $(test -f nixpacks.toml && echo Yes || echo No)"
echo "  - railway.json exists: $(test -f railway.json && echo Yes || echo No)"

# Check Prisma files
echo "Checking Prisma configuration:"
echo "  - prisma/schema.prisma.railway exists: $(test -f prisma/schema.prisma.railway && echo Yes || echo No)"

# Check Next.js config
echo "Checking Next.js configuration:"
echo "  - next.config.railway.mjs exists: $(test -f next.config.railway.mjs && echo Yes || echo No)"

# Analyze build process
echo "Analyzing build process:"
echo "  - Build command in package.json: $(grep -E '"build":' package.json)"
echo "  - Postinstall script: $(grep -E '"postinstall":' package.json)"

echo "All tests completed\!"
