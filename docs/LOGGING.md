# Logging System Documentation

The logging system provides a comprehensive solution for application-wide logging, request tracking, and log aggregation. It's built with TypeScript and integrates with AWS CloudWatch for production environments.

## Features

- Structured logging with context management
- Request/response logging with timing and tracing
- Error handling and reporting
- CloudWatch integration for production
- Local file logging for development
- Performance monitoring capabilities
- Request ID tracking
- Log aggregation and batching

## Setup

1. Install dependencies:
```bash
npm install @aws-sdk/client-cloudwatch-logs nanoid winston --legacy-peer-deps
```

2. Configure environment variables:
```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# Logging Configuration
LOG_LEVEL=info
CLOUDWATCH_LOG_GROUP=/your-app/environment
APP_NAME=your-app-name
```

## Usage

### Basic Logging

```typescript
import { logAggregator } from 'lib/services/log-aggregation'

// Basic logging
logAggregator.info('Application started')
logAggregator.warn('Resource running low')
logAggregator.error('An error occurred')
logAggregator.debug('Debug information')

// Logging with metadata
logAggregator.info('User action', {
  userId: '123',
  action: 'login',
  duration: 150
})

// Error logging
try {
  throw new Error('Something went wrong')
} catch (error) {
  logAggregator.error(error, {
    component: 'UserService',
    operation: 'authenticate'
  })
}
```

### Context Management

```typescript
// Set global context
logAggregator.setContext({
  environment: 'production',
  service: 'auth-service'
})

// Logs will include the context
logAggregator.info('Service health check')

// Clear context when done
logAggregator.clearContext()
```

### Request Logging

The middleware automatically logs HTTP requests. To enable it:

```typescript
// middleware.ts
import { withRequestLogging } from './middleware/request-logging'

const middleware = withRequestLogging(/^\/api\//)

export default middleware

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)'
  ]
}
```

### Child Loggers

```typescript
// Create a logger with additional context
const userLogger = logAggregator.child({
  userId: '123',
  service: 'user-service'
})

userLogger.info('User profile updated', {
  changes: ['email', 'name']
})
```

### Request-Scoped Logging

```typescript
const requestLogger = logAggregator.forRequest(
  requestId,
  'POST',
  '/api/users'
)

requestLogger.info('Processing request')
requestLogger.debug('Request details', { body })
requestLogger.info('Request completed', { duration })
```

## Log Formats

### Request Logs
```json
{
  "level": "info",
  "message": "Request started",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "unique-id",
  "method": "POST",
  "url": "/api/users",
  "headers": {},
  "query": {},
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Error Logs
```json
{
  "level": "error",
  "message": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "stack": "Error stack trace",
  "metadata": {
    "component": "ServiceName",
    "operation": "methodName"
  }
}
```

## CloudWatch Integration

In production, logs are automatically sent to CloudWatch with:
- Log group: `/your-app/environment`
- Log stream: `app-name-YYYY-MM-DD`
- Batched uploads for efficiency
- Automatic retry on failure
- Sequence token management

## Local Development

In development:
- Logs are written to console with colors
- Files are stored in `logs/` directory
- Error logs in `logs/development-error.log`
- Combined logs in `logs/development-combined.log`

## Best Practices

1. Always include relevant context in logs
2. Use appropriate log levels:
   - `error`: Application errors and exceptions
   - `warn`: Warning conditions
   - `info`: General information
   - `debug`: Detailed debugging information

3. Include request IDs in all related logs
4. Add metadata for better searchability
5. Use child loggers for component-specific logging
6. Clear contexts when they're no longer needed

## Performance Considerations

- Logs are batched before sending to CloudWatch
- File writes are buffered
- Context is efficiently managed
- Request logging adds minimal overhead
- Log levels can be adjusted for production

## Testing

Run the test suite:
```bash
npm test middleware/__tests__/request-logging.test.ts
```

## Monitoring

Monitor CloudWatch logs through:
- AWS Console
- CloudWatch Insights
- Custom dashboards
- Alerts and metrics

## Troubleshooting

1. Missing logs in CloudWatch:
   - Check AWS credentials
   - Verify log group/stream names
   - Check network connectivity

2. High memory usage:
   - Adjust batch sizes
   - Reduce log verbosity
   - Check for memory leaks

3. Performance issues:
   - Monitor logging overhead
   - Adjust log levels
   - Check disk usage for local logs
