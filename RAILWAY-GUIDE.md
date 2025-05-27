# Railway Deployment Guide for Nexus Core

This guide will help you deploy Nexus Core to Railway successfully.

## Prerequisites

1. You need a Railway account
2. You need to have the Railway CLI installed:
   ```bash
   npm install -g @railway/cli
   ```

## Method 1: Using the Minimal Deployment Package

We've created a minimal deployment package that contains only the essential files needed for deployment.

1. Navigate to the minimal deployment package:
   ```bash
   cd minimal-deploy
   ```

2. Log in to Railway (browserless mode if needed):
   ```bash
   railway login --browserless
   ```

3. Link to your Railway project:
   ```bash
   railway link
   ```
   
   When prompted:
   - Select your team (Personal or jackalkahwati's Projects)
   - Select the "nexus-core" project
   - Select the "production" environment
   - Select the "nexus-app" service

4. Deploy your application:
   ```bash
   railway up
   ```

5. Check deployment status:
   ```bash
   railway status
   ```

## Method 2: Using the Railway Dashboard

If the CLI method fails, you can use the Railway Dashboard:

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your "nexus-core" project
3. Click on the "nexus-app" service
4. Go to the "Settings" tab
5. In the "Builder" section, select "Dockerfile"
6. In the "Dockerfile Path" field, enter "Dockerfile.railway"
7. Save changes
8. Deploy manually from the dashboard

## Troubleshooting

### Common Issues

1. **package.json Not Found Error**
   - Make sure you're running commands from the correct directory
   - Check that package.json is not in .dockerignore

2. **Memory Limits During Build**
   - Try using the simplified Dockerfile in minimal-deploy
   - Set NODE_OPTIONS="--max-old-space-size=2048" if needed

3. **Railway CLI Interactive Mode Issues**
   - Use --browserless flag with login
   - Use the web dashboard for linking if CLI fails

4. **Deployment Timeouts**
   - Check Railway's status page
   - Try deploying during non-peak hours

If you continue to have issues, consider:
1. Checking Railway logs in the dashboard
2. Simplifying your app for initial deployment
3. Contacting Railway support