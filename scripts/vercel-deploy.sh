#!/bin/bash

# This script is used to deploy to Vercel with the correct environment variables

# Make sure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Run Prisma commands with the DATABASE_URL
echo "Running Prisma generate..."
npx prisma generate

echo "Running Prisma db push..."
npx prisma db push --accept-data-loss

echo "Building Next.js application..."
npm run build
