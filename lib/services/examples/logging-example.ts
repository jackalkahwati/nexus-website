import { logAggregator } from '../log-aggregation'

/**
 * Example usage of the LogAggregator
 */
async function loggingExample() {
  try {
    // Basic logging
    logAggregator.info('Application started')
    logAggregator.warn('Resource running low')
    logAggregator.debug('Debug information')

    // Logging with metadata
    logAggregator.info('User action', {
      userId: '123',
      action: 'login',
      duration: 150,
      ipAddress: '192.168.1.1'
    })

    // Error logging
    try {
      throw new Error('Database connection failed')
    } catch (error) {
      logAggregator.error(error as Error, {
        component: 'DatabaseService',
        operation: 'connect',
        host: 'db.example.com',
        port: 5432
      })
    }

    // Using context
    logAggregator.setContext({
      environment: 'production',
      service: 'auth-service',
      version: '1.0.0'
    })

    // Logs will include the context
    logAggregator.info('Service health check', {
      status: 'healthy',
      uptime: '24h'
    })

    // Child logger with additional context
    const userLogger = logAggregator.child({
      userId: '123',
      sessionId: 'abc-xyz',
      service: 'user-service'
    })

    userLogger.info('User profile updated', {
      changes: ['email', 'name'],
      timestamp: new Date().toISOString()
    })

    // Request-scoped logger
    const requestLogger = logAggregator.forRequest(
      'req-123',
      'POST',
      '/api/users'
    )

    // Log request lifecycle
    requestLogger.info('Request started', {
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0'
      }
    })

    requestLogger.debug('Processing request', {
      body: { username: 'test' },
      validation: 'passed'
    })

    requestLogger.info('Request completed', {
      duration: 100,
      status: 200,
      responseSize: 1024
    })

    // Clear context when done
    logAggregator.clearContext()

    // Cleanup
    await logAggregator.close()

  } catch (error) {
    console.error('Error in logging example:', error)
  }
}

/**
 * Example of using structured logging in an API endpoint
 */
async function apiEndpointExample(req: any, res: any) {
  const requestLogger = logAggregator.forRequest(
    req.id,
    req.method,
    req.url
  )

  try {
    requestLogger.info('Processing API request', {
      headers: req.headers,
      query: req.query,
      body: req.body
    })

    // Simulated processing
    await new Promise(resolve => setTimeout(resolve, 100))

    requestLogger.info('API request successful', {
      duration: 100,
      status: 200,
      responseSize: 1024
    })

    res.status(200).json({ success: true })
  } catch (error) {
    requestLogger.error(error as Error, {
      status: 500,
      path: req.path,
      query: req.query
    })

    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Example of using logging with async operations
 */
async function asyncOperationExample() {
  const operationLogger = logAggregator.child({
    operation: 'data-sync',
    batchId: Date.now().toString()
  })

  try {
    operationLogger.info('Starting async operation')

    // Simulated async work with progress updates
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      operationLogger.debug('Operation progress', {
        progress: (i + 1) * 20,
        itemsProcessed: (i + 1) * 100
      })
    }

    operationLogger.info('Async operation completed', {
      totalItems: 500,
      duration: 2500
    })
  } catch (error) {
    operationLogger.error(error as Error, {
      phase: 'processing',
      lastProcessedItem: 'item-123'
    })
    throw error
  }
}

/**
 * Example of using logging in error boundaries
 */
function errorBoundaryExample(error: Error, componentStack: string) {
  logAggregator.error(error, {
    type: 'react-error-boundary',
    componentStack,
    userAgent: window.navigator.userAgent,
    url: window.location.href
  })
}

export {
  loggingExample,
  apiEndpointExample,
  asyncOperationExample,
  errorBoundaryExample
}
