import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VehicleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status || !Object.values(VehicleStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      )
    }

    // Update vehicle status in database
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        status: status as VehicleStatus,
        updatedAt: new Date()
      }
    })

    if (!updatedVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Create status change alert if needed
    if (status === VehicleStatus.MAINTENANCE) {
      // This would typically be handled by a separate alerts service
      console.log(`Vehicle ${params.id} status changed to maintenance`)
    }

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error updating vehicle status:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle status' },
      { status: 500 }
    )
  }
} 