import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MonitoringService } from '@/lib/services/monitoring'
import { logger } from '@/lib/logger'

const monitoringService = new MonitoringService(logger)

export async function monitoringMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  const startTime = Date.now()
  
  try {
    const response = await next()
    
    // Record request metrics
    await monitoringService.recordMetric({
      name: 'http_request',
      type: 'counter',
      value: Date.now() - startTime,
      labels: {
        method: request.method,
        path: request.nextUrl.pathname,
        status: response.status.toString()
      }
    })
    
    return response
  } catch (error) {
    await monitoringService.recordError(error, {
      method: request.method,
      path: request.nextUrl.pathname
    })
    throw error
  }
} 