import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { taskQueueService } from '@/lib/services/task-queue'
import { z } from 'zod'

const createWorkerSchema = z.object({
  type: z.string()
})

const updateWorkerSchema = z.object({
  status: z.enum(['idle', 'busy', 'offline']).optional(),
  currentTaskId: z.string().nullable().optional()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = createWorkerSchema.parse(body)

    const worker = await taskQueueService.registerWorker(validatedData.type)
    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error registering worker:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    // Get workers from database with filters
    const workers = await prisma.worker.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status })
      },
      include: {
        currentTask: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workerId = searchParams.get('id')
    if (!workerId) {
      return new NextResponse('Worker ID is required', { status: 400 })
    }

    const body = await req.json()
    const validatedData = updateWorkerSchema.parse(body)

    // Update worker in database
    const updatedWorker = await prisma.worker.update({
      where: { id: workerId },
      data: {
        ...validatedData,
        updatedAt: new Date().toISOString()
      },
      include: {
        currentTask: true
      }
    })

    return NextResponse.json(updatedWorker)
  } catch (error) {
    console.error('Error updating worker:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workerId = searchParams.get('id')
    if (!workerId) {
      return new NextResponse('Worker ID is required', { status: 400 })
    }

    // Update worker heartbeat
    await taskQueueService.updateWorkerHeartbeat(workerId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error updating worker heartbeat:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workerId = searchParams.get('id')
    if (!workerId) {
      return new NextResponse('Worker ID is required', { status: 400 })
    }

    // Delete worker from database
    await prisma.worker.delete({
      where: { id: workerId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting worker:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 