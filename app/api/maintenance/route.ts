import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MaintenanceTaskType, MaintenanceTaskStatus, MaintenanceTaskPriority, Prisma } from '@prisma/client'

const maintenanceTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(MaintenanceTaskType),
  priority: z.nativeEnum(MaintenanceTaskPriority),
  status: z.nativeEnum(MaintenanceTaskStatus).default(MaintenanceTaskStatus.PENDING),
  vehicleId: z.string(),
  technicianId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  parts: z.array(z.object({
    name: z.string(),
    partNumber: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const technicianId = searchParams.get('technicianId')
    const priority = searchParams.get('priority') as MaintenanceTaskPriority | null
    const type = searchParams.get('type') as MaintenanceTaskType | null
    const status = searchParams.get('status') as MaintenanceTaskStatus | null
    const vehicleId = searchParams.get('vehicleId')

    // Validate enum values if provided
    const where: Prisma.MaintenanceTaskWhereInput = {
      ...(technicianId && { technicianId }),
      ...(priority && Object.values(MaintenanceTaskPriority).includes(priority) ? { priority } : {}),
      ...(type && Object.values(MaintenanceTaskType).includes(type) ? { type } : {}),
      ...(status && Object.values(MaintenanceTaskStatus).includes(status) ? { status } : {}),
      ...(vehicleId && { vehicleId }),
    }

    const tasks = await prisma.maintenanceTask.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            mileage: true,
          }
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        parts: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error)
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = maintenanceTaskSchema.parse(body)

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: validatedData.vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if technician exists if assigned
    if (validatedData.technicianId) {
      const technician = await prisma.technician.findUnique({
        where: { id: validatedData.technicianId }
      })

      if (!technician) {
        return NextResponse.json(
          { error: 'Technician not found' },
          { status: 404 }
        )
      }
    }

    // Create maintenance task and its parts
    const task = await prisma.maintenanceTask.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        priority: validatedData.priority,
        status: validatedData.status,
        vehicleId: validatedData.vehicleId,
        technicianId: validatedData.technicianId,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        notes: validatedData.notes,
        parts: {
          create: validatedData.parts?.map(part => ({
            name: part.name,
            partNumber: part.partNumber,
            quantity: part.quantity,
            price: part.price,
          }))
        }
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            mileage: true,
          }
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        parts: true
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating maintenance task:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create maintenance task' },
      { status: 500 }
    )
  }
} 