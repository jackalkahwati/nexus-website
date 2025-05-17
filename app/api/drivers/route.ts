import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Driver } from '@/types/driver'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

// Mock data - replace with actual database calls
const drivers: Driver[] = [
  {
    id: "d1",
    name: "John Smith",
    phone: "+1234567890",
    status: "Available",
    license: {
      number: "DL123456",
      type: "Commercial",
      expiryDate: "2025-12-31",
      issuedDate: "2020-12-31",
      restrictions: []
    },
    schedule: [
      {
        weekDay: "Monday",
        startTime: "08:00",
        endTime: "17:00",
        breaks: [
          {
            startTime: "12:00",
            endTime: "13:00"
          }
        ]
      }
    ],
    certifications: ["Hazmat", "Tanker"],
    performanceMetrics: {
      rating: 95,
      completedTrips: 150,
      totalHours: 8,
      safetyScore: 98,
      onTimeDeliveryRate: 96
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1234567891"
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')?.toLowerCase()

    let filteredDrivers = [...drivers]

    // Apply filters
    if (status) {
      filteredDrivers = filteredDrivers.filter(d => d.status === status)
    }
    if (search) {
      filteredDrivers = filteredDrivers.filter(d => 
        d.name.toLowerCase().includes(search) ||
        d.phone.includes(search) ||
        d.license.number.toLowerCase().includes(search)
      )
    }

    return NextResponse.json(filteredDrivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newDriver = {
      ...body,
      id: `d${drivers.length + 1}`,
      createdAt: new Date().toISOString()
    }
    
    drivers.push(newDriver)
    return NextResponse.json(newDriver, { status: 201 })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const driverIndex = drivers.findIndex(d => d.id === id)
    if (driverIndex === -1) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    // Update driver
    drivers[driverIndex] = {
      ...drivers[driverIndex],
      ...updates,
      performanceMetrics: {
        ...drivers[driverIndex].performanceMetrics,
        ...updates.performanceMetrics
      },
      license: {
        ...drivers[driverIndex].license,
        ...updates.license
      },
      schedule: updates.schedule || drivers[driverIndex].schedule,
      emergencyContact: {
        ...drivers[driverIndex].emergencyContact,
        ...updates.emergencyContact
      }
    }

    return NextResponse.json(drivers[driverIndex])
  } catch (error) {
    console.error('Error updating driver:', error)
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      )
    }

    const driverIndex = drivers.findIndex(d => d.id === id)
    if (driverIndex === -1) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    drivers.splice(driverIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting driver:', error)
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    )
  }
} 