import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { predictNextMaintenance } from '@/lib/maintenance-utils'
import { MaintenanceTaskStatus, TechnicianAvailability, MaintenanceTaskType } from '@prisma/client'

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
    const { notes } = body

    // Get the task with its relationships
    const task = await prisma.maintenanceTask.findUnique({
      where: {
        id: params.taskId,
      },
      include: {
        vehicle: true,
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
        { error: 'Task is already completed' },
        { status: 400 }
      )
    }

    // Get maintenance history for prediction
    const maintenanceHistory = await prisma.maintenanceTask.findMany({
      where: {
        vehicleId: task.vehicleId,
        status: MaintenanceTaskStatus.COMPLETED,
        type: task.type,
      },
      orderBy: {
        completedAt: 'asc',
      },
    })

    // Predict next maintenance date
    const nextMaintenanceDate = predictNextMaintenance(
      task.vehicle,
      maintenanceHistory
    )

    // Update task status to completed
    const updatedTask = await prisma.maintenanceTask.update({
      where: {
        id: params.taskId,
      },
      data: {
        status: MaintenanceTaskStatus.COMPLETED,
        completedAt: new Date(),
        notes: task.notes
          ? `${task.notes}\nTask completed by technician: ${task.technician?.name}`
          : `Task completed by technician: ${task.technician?.name}`,
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
        parts: true,
      },
    })

    // Update vehicle's maintenance schedule
    await prisma.vehicle.update({
      where: {
        id: task.vehicleId,
      },
      data: {
        lastMaintenance: new Date(),
        nextMaintenanceDue: nextMaintenanceDate,
        lastMaintenanceMileage: task.vehicle.mileage,
      },
    })

    // Check if technician has any other active tasks
    const activeTasks = await prisma.maintenanceTask.count({
      where: {
        technicianId: task.technicianId,
        status: {
          in: [MaintenanceTaskStatus.PENDING, MaintenanceTaskStatus.IN_PROGRESS],
        },
        id: { not: task.id },
      },
    })

    // If no other active tasks, update technician availability
    if (activeTasks === 0 && task.technicianId) {
      await prisma.technician.update({
        where: {
          id: task.technicianId,
        },
        data: {
          availability: TechnicianAvailability.AVAILABLE,
        },
      })
    }

    // If this is a recurring task, create the next instance
    if (task.type === MaintenanceTaskType.ROUTINE) {
      if (nextMaintenanceDate) {
        await prisma.maintenanceTask.create({
          data: {
            title: `${task.type} Maintenance - ${task.vehicle.name}`,
            type: task.type,
            priority: task.priority,
            status: MaintenanceTaskStatus.PENDING,
            description: task.description,
            vehicleId: task.vehicleId,
            dueDate: nextMaintenanceDate,
          },
        })
      }
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to complete maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to complete maintenance task' },
      { status: 500 }
    )
  }
} 