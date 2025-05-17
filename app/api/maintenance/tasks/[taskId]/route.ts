import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { MaintenanceTaskStatus, TechnicianAvailability } from '@prisma/client'

interface RouteParams {
  params: {
    taskId: string
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
    const {
      title,
      description,
      type,
      priority,
      dueDate,
      notes,
    } = body

    // Get the task
    const task = await prisma.maintenanceTask.findUnique({
      where: {
        id: params.taskId,
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (task.status === MaintenanceTaskStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Cannot update a completed task' },
        { status: 400 }
      )
    }

    // Update the task
    const updatedTask = await prisma.maintenanceTask.update({
      where: {
        id: params.taskId,
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
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
      },
    })

    // If due date changed, update vehicle's next maintenance due
    if (dueDate && task.dueDate?.getTime() !== new Date(dueDate).getTime()) {
      await prisma.vehicle.update({
        where: {
          id: task.vehicleId,
        },
        data: {
          nextMaintenanceDue: new Date(dueDate),
        },
      })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to update maintenance task' },
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

    // Get the task
    const task = await prisma.maintenanceTask.findUnique({
      where: {
        id: params.taskId,
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
        { error: 'Cannot delete a completed task' },
        { status: 400 }
      )
    }

    // If task was assigned to a technician, update their availability
    if (task.technicianId) {
      const technicianTasks = await prisma.maintenanceTask.count({
        where: {
          technicianId: task.technicianId,
          status: { in: [MaintenanceTaskStatus.PENDING, MaintenanceTaskStatus.IN_PROGRESS] },
          id: { not: task.id },
        },
      })

      if (technicianTasks === 0) {
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

    // Delete the task
    await prisma.maintenanceTask.delete({
      where: {
        id: params.taskId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to delete maintenance task' },
      { status: 500 }
    )
  }
} 