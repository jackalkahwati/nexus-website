import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import logger from '@/lib/logger'
import type { SensorData } from '@/types/autonomy'

// Validation schema for sensor data
const sensorDataSchema = z.object({
  timestamp: z.string().datetime(),
  sensorType: z.enum(['lidar', 'camera', 'radar', 'gps']),
  data: z.record(z.any()).refine((data) => {
    // Custom validation for different sensor types
    switch (data.sensorType) {
      case 'lidar':
        return Array.isArray(data.points) && data.resolution && data.scanDuration;
      case 'camera':
        return data.resolution && data.format;
      case 'radar':
        return typeof data.range === 'number' && typeof data.angle === 'number';
      case 'gps':
        return typeof data.latitude === 'number' && typeof data.longitude === 'number';
      default:
        return true;
    }
  }, "Invalid sensor data format"),
})

// Rate limiting configuration
const RATE_LIMIT = 100 // requests per second
const rateLimitWindows = new Map<string, number[]>()

function checkRateLimit(vehicleId: string): boolean {
  const now = Date.now()
  const window = rateLimitWindows.get(vehicleId) || []
  
  // Remove timestamps older than 1 second
  const recentRequests = window.filter(timestamp => now - timestamp < 1000)
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitWindows.set(vehicleId, recentRequests)
  return true
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate vehicle ID
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    // Check rate limit
    if (!checkRateLimit(params.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: 1 },
        { 
          status: 429,
          headers: {
            'Retry-After': '1',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate request body
    const validationResult = sensorDataSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid sensor data format',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const sensorData: SensorData = {
      ...validationResult.data,
      vehicleId: params.id,
    }

    // Log the data
    logger.info('Sensor data received', {
      vehicleId: params.id,
      sensorType: sensorData.sensorType,
      timestamp: sensorData.timestamp,
      dataSize: JSON.stringify(sensorData.data).length,
    })

    // Emit metrics
    console.log('METRIC sensor_data_received', {
      vehicle_id: params.id,
      sensor_type: sensorData.sensorType,
      data_size: JSON.stringify(sensorData.data).length,
      timestamp: sensorData.timestamp,
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dataId: `${params.id}_${sensorData.sensorType}_${Date.now()}`,
    })
  } catch (error) {
    logger.error('Error processing sensor data', {
      error,
      vehicleId: params.id,
    })

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate vehicle ID
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      )
    }

    const window = rateLimitWindows.get(params.id) || []
    const now = Date.now()
    const recentRequests = window.filter(timestamp => now - timestamp < 1000)
    const remaining = Math.max(0, RATE_LIMIT - recentRequests.length)

    return NextResponse.json({
      status: 'healthy',
      vehicleId: params.id,
      timestamp: new Date().toISOString(),
      rateLimit: {
        limit: RATE_LIMIT,
        remaining,
        reset: new Date(now + 1000).toISOString(),
      },
      endpoints: {
        sensorData: `/api/fleet/vehicles/${params.id}/sensor-data`,
        telemetry: `/api/fleet/vehicles/${params.id}/telemetry`,
        status: `/api/fleet/vehicles/${params.id}/status`,
      }
    })
  } catch (error) {
    logger.error('Error in sensor data health check', {
      error,
      vehicleId: params.id,
    })

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
} 