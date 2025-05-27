import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

interface RouteParams {
  params: {
    zoneId: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const zone = await prisma.zone.findUnique({
      where: {
        id: params.zoneId,
      },
      include: {
        vehicles: {
          select: {
            id: true,
            currentLocation: true,
          },
        },
      },
    })

    if (!zone) {
      return NextResponse.json(
        { error: 'Zone not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...zone,
      vehicleCount: zone.vehicles.length,
      vehicles: undefined,
    })
  } catch (error) {
    console.error('Failed to fetch zone:', error)
    return NextResponse.json(
      { error: 'Failed to fetch zone' },
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
    const { name, description, coordinates } = body

    // If coordinates are provided, validate them
    if (coordinates) {
      if (
        !coordinates.type ||
        coordinates.type !== 'Polygon' ||
        !Array.isArray(coordinates.coordinates) ||
        !coordinates.coordinates.length ||
        !coordinates.coordinates[0].length
      ) {
        return NextResponse.json(
          { error: 'Invalid GeoJSON Polygon coordinates' },
          { status: 400 }
        )
      }
    }

    const zone = await prisma.zone.update({
      where: {
        id: params.zoneId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(coordinates && { coordinates }),
      },
      include: {
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...zone,
      vehicleCount: zone.vehicles.length,
      vehicles: undefined,
    })
  } catch (error) {
    console.error('Failed to update zone:', error)
    return NextResponse.json(
      { error: 'Failed to update zone' },
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

    // Check if zone has any vehicles
    const zone = await prisma.zone.findUnique({
      where: {
        id: params.zoneId,
      },
      include: {
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!zone) {
      return NextResponse.json(
        { error: 'Zone not found' },
        { status: 404 }
      )
    }

    if (zone.vehicles.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete zone with assigned vehicles' },
        { status: 400 }
      )
    }

    await prisma.zone.delete({
      where: {
        id: params.zoneId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete zone:', error)
    return NextResponse.json(
      { error: 'Failed to delete zone' },
      { status: 500 }
    )
  }
} 