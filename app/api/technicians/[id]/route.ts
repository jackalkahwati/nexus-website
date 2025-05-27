import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const technician = await prisma.technician.findUnique({
      where: { id: params.id },
      include: {
        maintenanceTasks: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            maintenanceTasks: true
          }
        }
      }
    })

    if (!technician) {
      return new NextResponse('Technician not found', { status: 404 })
    }

    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error fetching technician:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const data = await req.json()

    // If email is being updated, check for uniqueness
    if (data.email) {
      const existingTechnician = await prisma.technician.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: params.id
          }
        }
      })

      if (existingTechnician) {
        return new NextResponse('Email already exists', { status: 400 })
      }
    }

    const technician = await prisma.technician.update({
      where: { id: params.id },
      data
    })
    return NextResponse.json(technician)
  } catch (error) {
    console.error('Error updating technician:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Check if technician has any active maintenance tasks
    const activeTasks = await prisma.maintenanceTask.count({
      where: {
        technicianId: params.id,
        status: {
          in: ['pending', 'in-progress']
        }
      }
    })

    if (activeTasks > 0) {
      return new NextResponse(
        'Cannot delete technician with active maintenance tasks',
        { status: 400 }
      )
    }

    await prisma.technician.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting technician:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 