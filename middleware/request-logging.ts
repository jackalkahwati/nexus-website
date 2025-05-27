import { NextRequest, NextResponse } from 'next/server'
import { logAggregator } from '../lib/services/log-aggregation'
import { nanoid } from 'nanoid'

export async function requestLoggingMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
): Promise<NextResponse> {
  const requestId = nanoid()
  const startTime = Date.now()

  const requestLogger = logAggregator.forRequest(
    requestId,
    request.method,
    request.url
  )

  try {
    // Log request details
    requestLogger.info('Request started', {
      headers: Object.fromEntries(request.headers),
      query: Object.fromEntries(new URL(request.url).searchParams),
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent')
    })

    // Process the request
    const response = await next()
    const duration = Date.now() - startTime

    // Clone the response to read its body
    const responseClone = response.clone()
    let responseBody = null
    try {
      responseBody = await responseClone.json()
    } catch {
      // Response body might not be JSON or might be empty
    }

    // Log response details
    requestLogger.info('Request completed', {
      duration,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      body: responseBody,
      size: parseInt(response.headers.get('content-length') || '0')
    })

    // Add request ID to response headers
    response.headers.set('x-request-id', requestId)
    return response

  } catch (error) {
    const duration = Date.now() - startTime

    // Log error details
    requestLogger.error(error as Error, {
      duration,
      phase: 'request_processing',
      url: request.url,
      method: request.method
    })

    // Return error response
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        requestId
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': requestId
        }
      }
    )
  }
}

/**
 * Helper function to create a middleware matcher
 */
export function withRequestLogging(matcher?: RegExp) {
  return async function middleware(
    request: NextRequest,
    next: () => Promise<NextResponse>
  ) {
    // Skip logging for excluded paths
    if (matcher && !matcher.test(request.url)) {
      return next()
    }

    return requestLoggingMiddleware(request, next)
  }
}

/**
 * Example usage in middleware.ts:
 * 
 * import { withRequestLogging } from './middleware/request-logging'
 * 
 * // Log all API requests
 * export default withRequestLogging(/^\/api\//)
 * 
 * // Configure path matcher
 * export const config = {
 *   matcher: '/api/:path*'
 * }
 */
