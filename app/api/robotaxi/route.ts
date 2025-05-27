import { NextResponse } from 'next/server'
import { generateRobotaxiFleetData, generateRobotaxiVehicle } from '@/lib/mock/fleet-data'
import logger from 'lib/logger'

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const automationLevel = searchParams.get('automationLevel')
    const status = searchParams.get('status')
    const minSafetyScore = searchParams.get('minSafetyScore')
    const area = searchParams.get('area') // Format: "lat1,lng1,lat2,lng2" for bounding box

    // Generate fleet data
    const fleetData = generateRobotaxiFleetData(20)
    let vehicles = fleetData.vehicles

    // Apply filters
    if (automationLevel) {
      vehicles = vehicles.filter(v => v.automationLevel === automationLevel)
    }
    if (status) {
      vehicles = vehicles.filter(v => v.status === status)
    }
    if (minSafetyScore) {
      vehicles = vehicles.filter(v => v.safetyMetrics.safetyScore >= Number(minSafetyScore))
    }
    if (area) {
      const [lat1, lng1, lat2, lng2] = area.split(',').map(Number)
      vehicles = vehicles.filter(v => {
        const { lat, lng } = v.location
        return lat >= Math.min(lat1, lat2) && 
               lat <= Math.max(lat1, lat2) && 
               lng >= Math.min(lng1, lng2) && 
               lng <= Math.max(lng1, lng2)
      })
    }

    // Calculate fleet metrics
    const metrics = {
      total: vehicles.length,
      statusBreakdown: {
        available: vehicles.filter(v => v.status === 'Available').length,
        inTransit: vehicles.filter(v => v.status === 'In Transit').length,
        charging: vehicles.filter(v => v.status === 'Charging').length,
        maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
      },
      automationLevels: {
        L4: vehicles.filter(v => v.automationLevel === 'L4').length,
        L5: vehicles.filter(v => v.automationLevel === 'L5').length,
      },
      safetyMetrics: {
        averageScore: vehicles.reduce((sum, v) => sum + v.safetyMetrics.safetyScore, 0) / vehicles.length,
        totalDisengagements: vehicles.reduce((sum, v) => sum + v.safetyMetrics.disengagements, 0),
        totalIncidentFreeHours: vehicles.reduce((sum, v) => sum + v.safetyMetrics.incidentFreeHours, 0),
      },
      sensorHealth: {
        lidar: {
          operational: vehicles.filter(v => v.telemetry.lidarStatus === 'Operational').length,
          degraded: vehicles.filter(v => v.telemetry.lidarStatus === 'Degraded').length,
          failed: vehicles.filter(v => v.telemetry.lidarStatus === 'Failed').length,
        },
        camera: {
          operational: vehicles.filter(v => v.telemetry.cameraStatus === 'Operational').length,
          degraded: vehicles.filter(v => v.telemetry.cameraStatus === 'Degraded').length,
          failed: vehicles.filter(v => v.telemetry.cameraStatus === 'Failed').length,
        },
        radar: {
          operational: vehicles.filter(v => v.telemetry.radarStatus === 'Operational').length,
          degraded: vehicles.filter(v => v.telemetry.radarStatus === 'Degraded').length,
          failed: vehicles.filter(v => v.telemetry.radarStatus === 'Failed').length,
        },
      },
    }

    return NextResponse.json({
      vehicles,
      metrics,
      bookings: fleetData.bookings,
      analytics: fleetData.analytics,
    })
  } catch (error) {
    logger.error('Error generating robotaxi fleet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch robotaxi fleet data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.automationLevel || !body.passengerCapacity) {
      return NextResponse.json(
        { error: 'Missing required fields: name, automationLevel, and passengerCapacity' },
        { status: 400 }
      )
    }

    // Generate a new robotaxi with provided data
    const newVehicle = {
      ...generateRobotaxiVehicle(),
      ...body,
      id: crypto.randomUUID(),
      status: 'Available',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    logger.error('Error creating robotaxi:', error)
    return NextResponse.json(
      { error: 'Failed to create robotaxi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    // Generate updated vehicle with provided data
    const updatedVehicle = {
      ...generateRobotaxiVehicle(),
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    logger.error('Error updating robotaxi:', error)
    return NextResponse.json(
      { error: 'Failed to update robotaxi' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    // In a real application, you would delete the vehicle from the database
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting robotaxi:', error)
    return NextResponse.json(
      { error: 'Failed to delete robotaxi' },
      { status: 500 }
    )
  }
} 