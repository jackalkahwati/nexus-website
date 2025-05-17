import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { calculateMaintenanceMetrics } from '@/lib/maintenance-utils'
import { MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority, TechnicianAvailability, type Prisma } from '@prisma/client'

interface MaintenancePart {
  name: string;
  partNumber: string;
  quantity: number;
  price: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const technicianId = searchParams.get('technicianId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')

    const where: Prisma.MaintenanceTaskWhereInput = {
      ...(vehicleId && { vehicleId }),
      ...(technicianId && { technicianId }),
      ...(status && { status: { equals: status as MaintenanceTaskStatus } }),
      ...(priority && { priority: { equals: priority as MaintenanceTaskPriority } }),
      ...(type && { type: { equals: type as MaintenanceTaskType } })
    }

    const tasks = await prisma.maintenanceTask.findMany({
      where,
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
      orderBy: {
        dueDate: 'asc',
      },
    })

    // Calculate maintenance metrics
    const metrics = await calculateMaintenanceMetrics(prisma)

    return NextResponse.json({
      tasks,
      metrics,
    })
  } catch (error) {
    console.error('Failed to fetch maintenance tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maintenance tasks' },
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
    const {
      title,
      description,
      type,
      priority,
      dueDate,
      vehicleId,
      technicianId,
      parts,
    } = body

    // Validate required fields
    if (!title || !type || !priority || !vehicleId) {
      return NextResponse.json(
        { error: 'Title, type, priority, and vehicleId are required' },
        { status: 400 }
      )
    }

    // Validate vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // If technician is specified, validate they exist and are available
    if (technicianId) {
      const technician = await prisma.technician.findUnique({
        where: { id: technicianId },
      })

      if (!technician) {
        return NextResponse.json(
          { error: 'Technician not found' },
          { status: 404 }
        )
      }

      if (technician.availability !== TechnicianAvailability.AVAILABLE) {
        return NextResponse.json(
          { error: 'Selected technician is not available' },
          { status: 400 }
        )
      }

      // Check if technician has the required specialty
      if (!technician.specialties.includes(type)) {
        return NextResponse.json(
          { error: 'Technician does not have the required specialty' },
          { status: 400 }
        )
      }
    }

    // Create the maintenance task
    const task = await prisma.maintenanceTask.create({
      data: {
        title: `${type} Maintenance - ${vehicle.name}`,
        type: type as MaintenanceTaskType,
        priority: priority as MaintenanceTaskPriority,
        status: MaintenanceTaskStatus.PENDING,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        vehicleId,
        technicianId,
        description,
        parts: parts ? {
          create: parts.map((part: MaintenancePart) => ({
            name: part.name,
            partNumber: part.partNumber,
            quantity: part.quantity,
            price: part.price
          }))
        } : undefined
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

    // Update vehicle's maintenance schedule
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        lastMaintenance: new Date(),
        nextMaintenanceDue: dueDate ? new Date(dueDate) : null,
      },
    })

    // If technician is assigned, update their availability
    if (technicianId) {
      await prisma.technician.update({
        data: { availability: TechnicianAvailability.BUSY },
        where: { id: technicianId }
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to create maintenance task:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance task' },
      { status: 500 }
    )
  }
} 