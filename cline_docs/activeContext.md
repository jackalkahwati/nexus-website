# Active Context

## Current Issue
- 401 Unauthorized error when accessing credentials
- Error appears to be related to authentication system
- Error message: "Failed to load resource: the server responded with a status of 401 (Unauthorized) (credentials, line 0)"
- Error occurs during SSE (Server-Sent Events) connection attempt

## Recent Changes
- None identified yet

## Next Steps
1. Check SSE connection handling in:
   - app/api/notifications/stream/route.ts
   - app/api/collaboration/stream/route.ts
   - app/api/fleet/stream/route.ts
2. Verify authentication middleware configuration
3. Review API key validation in lib/api-keys.ts
4. Check environment variables in .env.local
5. Examine auth configuration in:
   - lib/auth.ts
   - app/api/auth/[...nextauth]/route.ts
   - middleware/api-key.ts
   - middleware/security.ts
