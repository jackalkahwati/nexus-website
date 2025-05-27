import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'active' | 'inactive' | null
    const search = searchParams.get('search')

    const where: Prisma.FleetWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive
            }
          },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive
            }
          }
        ]
      })
    }

    const fleets = await prisma.fleet.findMany({
      where,
      include: {
        zones: true,
        vehicles: {
          select: {
            id: true,
          },
        },
      },
    })

    // Transform the response to include vehicle count
    const transformedFleets = fleets.map(fleet => ({
      ...fleet,
      vehicleCount: fleet.vehicles?.length ?? 0,
      vehicles: undefined, // Remove the vehicles array from the response
    }))

    return NextResponse.json(transformedFleets)
  } catch (error) {
    console.error('Failed to fetch fleets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fleets' },
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
    const { name, description, status = 'active' } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const fleet = await prisma.fleet.create({
      data: {
        name,
        description,
        status,
      },
      include: {
        zones: true,
      },
    })

    return NextResponse.json({
      ...fleet,
      vehicleCount: 0,
    })
  } catch (error) {
    console.error('Failed to create fleet:', error)
    return NextResponse.json(
      { error: 'Failed to create fleet' },
      { status: 500 }
    )
  }
} 