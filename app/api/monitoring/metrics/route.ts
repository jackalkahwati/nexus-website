import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { monitoring } from '@/lib/services/monitoring'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    // Check authentication for detailed metrics
    const token = await getToken({ req: request })
    const isAdmin = token?.role === 'ADMIN'

    const { searchParams } = new URL(request.url)
    const metricName = searchParams.get('metric')
    const timeRange = parseInt(searchParams.get('timeRange') || '3600000') // Default 1 hour
    const detailed = searchParams.get('detailed') === 'true'

    // Only allow detailed metrics for admins
    if (detailed && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access to detailed metrics' },
        { status: 403 }
      )
    }

    const now = Date.now()
    const startTime = now - timeRange

    if (metricName) {
      // Get specific metric
      const metrics = await monitoring.getMetrics(metricName, startTime, now)
      const stats = await monitoring.getMetricStats(metricName, timeRange)

      return NextResponse.json({
        metric: metricName,
        timeRange,
        stats,
        data: detailed ? metrics : metrics.slice(-100) // Limit data points for non-detailed view
      })
    } else {
      // Get all metrics
      const systemMetrics = {
        memory: {
          ...process.memoryUsage(),
          timestamp: now
        },
        cpu: {
          ...process.cpuUsage(),
          timestamp: now
        },
        uptime: process.uptime(),
      }

      // Record system metrics
      await monitoring.recordMetric({
        name: 'memory_usage',
        value: systemMetrics.memory.heapUsed,
        type: 'gauge',
        labels: { type: 'heap_used' }
      })

      await monitoring.recordMetric({
        name: 'cpu_usage',
        value: systemMetrics.cpu.user / 1000000, // Convert to milliseconds
        type: 'gauge',
        labels: { type: 'user' }
      })

      // Get recent errors if admin
      const errors = isAdmin 
        ? await monitoring.getRecentErrors(10)
        : []

      return NextResponse.json({
        timestamp: now,
        system: systemMetrics,
        errors: errors,
      })
    }
  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request })
    if (!token?.role || !['ADMIN', 'SYSTEM'].includes(token.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to record metrics' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, value, type, labels } = body

    if (!name || typeof value !== 'number' || !type) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    await monitoring.recordMetric({
      name,
      value,
      type,
      labels
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Metrics recording error:', error)
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    )
  }
} 