import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { MaintenanceTaskStatus, TechnicianAvailability } from '@prisma/client'

interface RouteParams {
  params: {
    taskId: string
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { technicianId } = body

    if (!technicianId) {
      return NextResponse.json(
        { error: 'Technician ID is required' },
        { status: 400 }
      )
    }

    // Get the task
    const task = await prisma.maintenanceTask.findUnique({
      where: {
        id: params.taskId,
      },
      include: {
        technician: true,
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    if (task.status === MaintenanceTaskStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Cannot assign a completed task' },
        { status: 400 }
      )
    }

    // Get the technician
    const technician = await prisma.technician.findUnique({
      where: {
        id: technicianId,
      },
    })

    if (!technician) {
      return NextResponse.json(
        { error: 'Technician not found' },
        { status: 404 }
      )
    }

    // Check if technician is available
    if (technician.availability !== TechnicianAvailability.AVAILABLE) {
      return NextResponse.json(
        { error: 'Technician is not available' },
        { status: 400 }
      )
    }

    // Check if technician has the required specialty
    if (!technician.specialties.includes(task.type)) {
      return NextResponse.json(
        { error: 'Technician does not have the required specialty' },
        { status: 400 }
      )
    }

    // If task was previously assigned, update old technician's availability
    if (task.technicianId) {
      const oldTechnicianTasks = await prisma.maintenanceTask.count({
        where: {
          technicianId: task.technicianId,
          status: { 
            in: [MaintenanceTaskStatus.PENDING, MaintenanceTaskStatus.IN_PROGRESS] 
          },
          id: { not: task.id },
        },
      })

      if (oldTechnicianTasks === 0) {
        await prisma.technician.update({
          where: {
            id: task.technicianId,
          },
          data: {
            availability: TechnicianAvailability.AVAILABLE,
          },
        })
      }
    }

    // Update the task and technician
    const updatedTask = await prisma.maintenanceTask.update({
      where: {
        id: params.taskId,
      },
      data: {
        technicianId,
        status: MaintenanceTaskStatus.IN_PROGRESS,
        notes: task.notes
          ? `${task.notes}\nAssigned to technician: ${technician.name}`
          : `Assigned to technician: ${technician.name}`,
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            mileage: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            specialties: true,
            availability: true,
          },
        },
        parts: true
      },
    })

    await prisma.technician.update({
      where: {
        id: technicianId,
      },
      data: {
        availability: TechnicianAvailability.BUSY,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to assign maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to assign maintenance task' },
      { status: 500 }
    )
  }
} 