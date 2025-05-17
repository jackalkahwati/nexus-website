import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fleetId = searchParams.get('fleetId')
    const search = searchParams.get('search')

    const where = {
      ...(fleetId && { fleetId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const zones = await prisma.zone.findMany({
      where,
      include: {
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    // Transform the response to include vehicle count
    const transformedZones = zones.map(zone => ({
      ...zone,
      vehicleCount: zone.vehicles.length,
      vehicles: undefined, // Remove the vehicles array from the response
    }))

    return NextResponse.json(transformedZones)
  } catch (error) {
    console.error('Failed to fetch zones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch zones' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, coordinates, fleetId } = body

    if (!name || !coordinates || !fleetId) {
      return NextResponse.json(
        { error: 'Name, coordinates, and fleetId are required' },
        { status: 400 }
      )
    }

    // Validate GeoJSON coordinates
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

    // Check if fleet exists
    const fleet = await prisma.fleet.findUnique({
      where: { id: fleetId },
    })

    if (!fleet) {
      return NextResponse.json(
        { error: 'Fleet not found' },
        { status: 404 }
      )
    }

    const zone = await prisma.zone.create({
      data: {
        name,
        description,
        coordinates,
        fleetId,
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
      vehicleCount: 0,
    })
  } catch (error) {
    console.error('Failed to create zone:', error)
    return NextResponse.json(
      { error: 'Failed to create zone' },
      { status: 500 }
    )
  }
} 