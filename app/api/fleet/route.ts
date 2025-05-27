import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Vehicle, FleetStats } from '@/types/fleet'
import { generateFleetData } from '@/lib/mock/fleet-data'

// Mock database
let vehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Truck 001',
    type: 'Truck',
    status: 'Active',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Main St, San Francisco, CA'
    },
    batteryLevel: 85,
    mileage: 12500,
    lastMaintenance: '2024-01-15T00:00:00Z',
    nextMaintenance: '2024-04-15T00:00:00Z',
    telemetry: {
      speed: 35,
      temperature: 72,
      engineStatus: 'Normal',
      fuelEfficiency: 28.5
    },
    driver: {
      id: 'd1',
      name: 'John Smith',
      phone: '+1-555-123-4567',
      rating: 4.8
    }
  },
  // Add more vehicles here
]

const stats: FleetStats = {
  total: vehicles.length,
  active: vehicles.filter(v => v.status === 'Active').length,
  inactive: vehicles.filter(v => v.status === 'Offline').length,
  maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
  charging: vehicles.filter(v => v.status === 'Charging').length,
  utilization: 78,
  alerts: {
    high: 2,
    medium: 5,
    low: 8,
  },
  performance: {
    onTime: 92,
    delayed: 6,
    cancelled: 2,
  },
}

export async function GET() {
  try {
    const fleetData = generateFleetData(20) // Generate data for 20 vehicles
    return NextResponse.json(fleetData)
  } catch (error) {
    console.error('Error generating fleet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fleet data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newVehicle = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
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
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    const vehicleIndex = vehicles.findIndex(v => v.id === id)
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Update vehicle
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      location: {
        ...vehicles[vehicleIndex].location,
        ...updates.location,
      },
      telemetry: {
        ...vehicles[vehicleIndex].telemetry,
        ...updates.telemetry,
      }
    }

    // Update stats
    stats.active = vehicles.filter(v => v.status === 'Active').length
    stats.inactive = vehicles.filter(v => v.status === 'Offline').length
    stats.maintenance = vehicles.filter(v => v.status === 'Maintenance').length
    stats.charging = vehicles.filter(v => v.status === 'Charging').length

    return NextResponse.json(vehicles[vehicleIndex])
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  const vehicleIndex = vehicles.findIndex(v => v.id === id)
  if (vehicleIndex === -1) {
    return NextResponse.json(
      { error: 'Vehicle not found' },
      { status: 404 }
    )
  }

  // Remove vehicle
  vehicles.splice(vehicleIndex, 1)

  // Update stats
  stats.total = vehicles.length
  stats.active = vehicles.filter(v => v.status === 'Active').length
  stats.inactive = vehicles.filter(v => v.status === 'Offline').length
  stats.maintenance = vehicles.filter(v => v.status === 'Maintenance').length
  stats.charging = vehicles.filter(v => v.status === 'Charging').length

  return NextResponse.json({ success: true })
} 