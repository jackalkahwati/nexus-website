import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { FleetAlert } from '@/types/fleet'

// Mock database for alerts
let alerts: FleetAlert[] = [
  {
    id: 'a1',
    vehicleId: 'v1',
    type: 'maintenance',
    priority: 'high',
    message: 'Brake system requires immediate attention',
    timestamp: new Date().toISOString(),
    status: 'active',
    metadata: {
      code: 'BRK-001',
      component: 'brake_system',
      location: 'front_left',
    },
  },
  {
    id: 'a2',
    vehicleId: 'v1',
    type: 'warning',
    priority: 'medium',
    message: 'Battery level below 20%',
    timestamp: new Date().toISOString(),
    status: 'active',
    metadata: {
      batteryLevel: 18,
      estimatedRange: 25,
    },
  },
  {
    id: 'a3',
    vehicleId: 'v1',
    type: 'info',
    priority: 'low',
    message: 'Vehicle approaching geofence boundary',
    timestamp: new Date().toISOString(),
    status: 'active',
    metadata: {
      distance: 100,
      geofenceId: 'gf1',
      geofenceName: 'Downtown Zone',
    },
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const vehicleId = searchParams.get('vehicleId')
  const type = searchParams.get('type')
  const priority = searchParams.get('priority')
  const status = searchParams.get('status')

  let filteredAlerts = [...alerts]

  // Apply filters
  if (vehicleId) {
    filteredAlerts = filteredAlerts.filter(alert => alert.vehicleId === vehicleId)
  }
  if (type) {
    filteredAlerts = filteredAlerts.filter(alert => alert.type === type)
  }
  if (priority) {
    filteredAlerts = filteredAlerts.filter(alert => alert.priority === priority)
  }
  if (status) {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === status)
  }

  // Sort by timestamp descending
  filteredAlerts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return NextResponse.json({
    alerts: filteredAlerts,
    total: filteredAlerts.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.vehicleId || !body.type || !body.priority || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new alert
    const newAlert: FleetAlert = {
      id: `a${alerts.length + 1}`,
      vehicleId: body.vehicleId,
      type: body.type,
      priority: body.priority,
      message: body.message,
      timestamp: new Date().toISOString(),
      status: 'active',
      metadata: body.metadata || {},
    }

    alerts.push(newAlert)

    return NextResponse.json(newAlert)
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    const alertIndex = alerts.findIndex(alert => alert.id === id)
    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    // Update alert
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      ...updates,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(alerts[alertIndex])
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Alert ID is required' },
      { status: 400 }
    )
  }

  const alertIndex = alerts.findIndex(alert => alert.id === id)
  if (alertIndex === -1) {
    return NextResponse.json(
      { error: 'Alert not found' },
      { status: 404 }
    )
  }

  // Remove alert
  alerts.splice(alertIndex, 1)

  return NextResponse.json({ success: true })
} 