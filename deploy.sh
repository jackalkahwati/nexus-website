#!/bin/bash
echo "🚀 Deploying Nexus Website to Cloudflare Pages..."

# Deploy to Cloudflare Pages
npx wrangler pages publish . --project-name=nexus-website

echo "✅ Website deployed successfully!"
echo "🌐 URL: https://nexus-website.pages.dev"
