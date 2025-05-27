# Nexus Core Minimal Deployment

This is a minimal deployment for Nexus Core on Railway using Nixpacks.

## Files

- `server.js` - A simple Node.js server
- `package.json` - Node.js package configuration
- `nixpacks.toml` - Nixpacks configuration for Railway
- `railway.json` - Railway project configuration

## Deployment

This project is configured to deploy on Railway using Nixpacks. To deploy:

```bash
railway up
```

## Variables

The following environment variables are set:
- `RAILWAY_NIXPACKS_ENABLE=true` - Ensures Nixpacks is used for deployment
- `NODE_ENV=production` - Sets the Node.js environment

## Structure

This is a minimal server designed to replace the existing nexus-app service that was previously using a Dockerfile for deployment. 