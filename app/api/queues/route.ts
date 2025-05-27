import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { taskQueueService } from '@/lib/services/task-queue'
import { z } from 'zod'

const createQueueSchema = z.object({
  name: z.string(),
  type: z.string(),
  concurrency: z.number().min(1).optional(),
  maxRetries: z.number().min(0).optional(),
  retryDelay: z.number().min(0).optional()
})

const updateQueueSchema = z.object({
  name: z.string().optional(),
  concurrency: z.number().min(1).optional(),
  maxRetries: z.number().min(0).optional(),
  retryDelay: z.number().min(0).optional(),
  status: z.enum(['active', 'paused']).optional()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = createQueueSchema.parse(body)

    const queue = await taskQueueService.createQueue(
      validatedData.name,
      validatedData.type,
      {
        concurrency: validatedData.concurrency,
        maxRetries: validatedData.maxRetries,
        retryDelay: validatedData.retryDelay
      }
    )

    return NextResponse.json(queue)
  } catch (error) {
    console.error('Error creating queue:', error)
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

    // Get queues from database with filters
    const queues = await prisma.queue.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status })
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Only include latest 10 tasks per queue
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(queues)
  } catch (error) {
    console.error('Error fetching queues:', error)
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
    const queueId = searchParams.get('id')
    if (!queueId) {
      return new NextResponse('Queue ID is required', { status: 400 })
    }

    const body = await req.json()
    const validatedData = updateQueueSchema.parse(body)

    // Update queue in database
    const updatedQueue = await prisma.queue.update({
      where: { id: queueId },
      data: validatedData,
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    return NextResponse.json(updatedQueue)
  } catch (error) {
    console.error('Error updating queue:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
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
    const queueId = searchParams.get('id')
    if (!queueId) {
      return new NextResponse('Queue ID is required', { status: 400 })
    }

    // Delete queue and all its tasks
    await prisma.queue.delete({
      where: { id: queueId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting queue:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 