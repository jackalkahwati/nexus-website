import { NextResponse } from 'next/server'
import { monitoring } from '@/lib/services/monitoring'

export async function GET() {
  try {
    const healthChecks = await monitoring.getHealthStatus()
    
    // Calculate overall system status
    const overallStatus = healthChecks.every((check: { status: string }) => check.status === 'healthy')
      ? 'healthy'
      : healthChecks.some((check: { status: string }) => check.status === 'unhealthy')
      ? 'unhealthy'
      : 'degraded'

    // Calculate uptime
    const uptime = process.uptime()
    const formattedUptime = {
      days: Math.floor(uptime / 86400),
      hours: Math.floor((uptime % 86400) / 3600),
      minutes: Math.floor((uptime % 3600) / 60),
      seconds: Math.floor(uptime % 60)
    }

    // Get system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    }

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: formattedUptime,
      checks: healthChecks,
      system: systemInfo
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Failed to perform health check',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 