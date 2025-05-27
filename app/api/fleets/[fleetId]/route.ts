import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

interface RouteParams {
  params: {
    fleetId: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fleetId: string } }
) {
  try {
    const fleet = await prisma.fleet.findUnique({
      where: {
        id: params.fleetId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            mileage: true,
            lastMaintenance: true,
            nextMaintenanceDue: true,
            lastMaintenanceMileage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!fleet) {
      return NextResponse.json(
        { error: 'Fleet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...fleet,
      vehicleCount: fleet.vehicles.length,
    })
  } catch (error) {
    console.error('Error fetching fleet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fleet' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, status } = body

    const fleet = await prisma.fleet.update({
      where: {
        id: params.fleetId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
      include: {
        zones: true,
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...fleet,
      vehicleCount: fleet.vehicles.length,
      vehicles: undefined,
    })
  } catch (error) {
    console.error('Failed to update fleet:', error)
    return NextResponse.json(
      { error: 'Failed to update fleet' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if fleet has any vehicles
    const fleet = await prisma.fleet.findUnique({
      where: {
        id: params.fleetId,
      },
      include: {
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!fleet) {
      return NextResponse.json(
        { error: 'Fleet not found' },
        { status: 404 }
      )
    }

    if (fleet.vehicles.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete fleet with assigned vehicles' },
        { status: 400 }
      )
    }

    // Delete all zones associated with the fleet
    await prisma.zone.deleteMany({
      where: {
        fleetId: params.fleetId,
      },
    })

    // Delete the fleet
    await prisma.fleet.delete({
      where: {
        id: params.fleetId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete fleet:', error)
    return NextResponse.json(
      { error: 'Failed to delete fleet' },
      { status: 500 }
    )
  }
} 