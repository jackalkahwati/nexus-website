import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { 
  Vehicle, 
  MaintenanceRecord, 
  Route, 
  Analytics,
  FleetData 
} from '@/types/fleet'

// Mock data - replace with actual database calls
const fleetOperations: FleetData = {
  vehicles: [
    {
      id: "v1",
      name: "Truck 001",
      type: "Truck",
      status: "Active",
      location: {
        lat: -37.8136,
        lng: 144.9631,
        address: "Melbourne CBD"
      },
      batteryLevel: 85,
      mileage: 45000,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-03-15",
      telemetry: {
        speed: 0,
        temperature: 24,
        engineStatus: "Normal",
        fuelEfficiency: 8.5
      }
    }
  ],
  routes: [
    {
      id: "r1",
      name: "Morning Delivery Route",
      status: "In Progress",
      startLocation: {
        lat: -37.8136,
        lng: 144.9631,
        address: "Melbourne CBD"
      },
      endLocation: {
        lat: -37.8236,
        lng: 144.9731,
        address: "South Melbourne"
      },
      waypoints: [],
      estimatedDuration: 120,
      actualDuration: 115,
      distance: 15.5,
      vehicleId: "v1",
      driverId: "d1",
      createdAt: "2024-02-20T08:00:00Z",
      scheduledAt: "2024-02-20T09:00:00Z"
    }
  ],
  maintenance: [
    {
      id: "m1",
      vehicleId: "v1",
      type: "Routine",
      status: "Scheduled",
      description: "Regular service and inspection",
      scheduledDate: "2024-03-15",
      cost: 350,
      technician: {
        id: "t1",
        name: "John Tech",
        certification: "Master Mechanic"
      },
      parts: [
        {
          id: "p1",
          name: "Oil Filter",
          quantity: 1,
          cost: 25
        },
        {
          id: "p2",
          name: "Engine Oil",
          quantity: 5,
          cost: 45
        }
      ],
      notes: "Regular maintenance schedule"
    }
  ],
  analytics: {
    fleetUtilization: 85,
    activeVehicles: 42,
    totalRoutes: 156,
    completedRoutes: 148,
    averageRouteTime: 95,
    fuelEfficiency: 8.2,
    maintenanceMetrics: {
      scheduled: 12,
      completed: 8,
      pending: 4
    },
    safetyMetrics: {
      incidents: 2,
      warnings: 5,
      safetyScore: 94
    },
    costMetrics: {
      fuelCosts: 12500,
      maintenanceCosts: 4500,
      totalOperatingCosts: 28000
    },
    timeRange: {
      start: "2024-02-01",
      end: "2024-02-29"
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // vehicles, routes, maintenance, analytics
    const vehicleId = searchParams.get('vehicleId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let response: any = {}

    switch (type) {
      case 'vehicles':
        response = vehicleId 
          ? fleetOperations.vehicles.find(v => v.id === vehicleId)
          : fleetOperations.vehicles
        break
      case 'routes':
        response = vehicleId
          ? fleetOperations.routes.filter(r => r.vehicleId === vehicleId)
          : fleetOperations.routes
        break
      case 'maintenance':
        response = vehicleId
          ? fleetOperations.maintenance.filter(m => m.vehicleId === vehicleId)
          : fleetOperations.maintenance
        break
      case 'analytics':
        response = fleetOperations.analytics
        break
      default:
        response = fleetOperations
    }

    if (startDate && endDate) {
      // Filter data based on date range if applicable
      // Implementation depends on data structure
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching fleet operations data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fleet operations data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    let response: any

    switch (type) {
      case 'maintenance':
        // Create new maintenance record
        const newMaintenance: MaintenanceRecord = {
          id: `m${fleetOperations.maintenance.length + 1}`,
          ...data,
          createdAt: new Date().toISOString()
        }
        fleetOperations.maintenance.push(newMaintenance)
        response = newMaintenance
        break

      case 'route':
        // Create new route
        const newRoute: Route = {
          id: `r${fleetOperations.routes.length + 1}`,
          ...data,
          createdAt: new Date().toISOString()
        }
        fleetOperations.routes.push(newRoute)
        response = newRoute
        break

      default:
        throw new Error('Invalid operation type')
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating fleet operation record:', error)
    return NextResponse.json(
      { error: 'Failed to create fleet operation record' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, updates } = body

    let response: any

    switch (type) {
      case 'maintenance':
        const maintenanceIndex = fleetOperations.maintenance.findIndex(m => m.id === id)
        if (maintenanceIndex === -1) {
          return NextResponse.json(
            { error: 'Maintenance record not found' },
            { status: 404 }
          )
        }
        fleetOperations.maintenance[maintenanceIndex] = {
          ...fleetOperations.maintenance[maintenanceIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        response = fleetOperations.maintenance[maintenanceIndex]
        break

      case 'route':
        const routeIndex = fleetOperations.routes.findIndex(r => r.id === id)
        if (routeIndex === -1) {
          return NextResponse.json(
            { error: 'Route not found' },
            { status: 404 }
          )
        }
        fleetOperations.routes[routeIndex] = {
          ...fleetOperations.routes[routeIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        response = fleetOperations.routes[routeIndex]
        break

      default:
        throw new Error('Invalid operation type')
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating fleet operation record:', error)
    return NextResponse.json(
      { error: 'Failed to update fleet operation record' },
      { status: 500 }
    )
  }
} 