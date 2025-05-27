import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { taskQueueService } from '@/lib/services/task-queue'
import { z } from 'zod'

const createTaskSchema = z.object({
  queueId: z.string(),
  name: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  maxAttempts: z.number().min(1).optional(),
  retryDelay: z.number().min(0).optional(),
  dependencies: z.array(z.string()).optional()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = createTaskSchema.parse(body)

    const task = await taskQueueService.addTask(
      validatedData.queueId,
      validatedData.name,
      validatedData.type,
      validatedData.data,
      {
        priority: validatedData.priority,
        maxAttempts: validatedData.maxAttempts,
        retryDelay: validatedData.retryDelay,
        dependencies: validatedData.dependencies
      }
    )

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
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
    const queueId = searchParams.get('queueId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Get tasks from database with filters
    const tasks = await prisma.task.findMany({
      where: {
        ...(queueId && { queueId }),
        ...(status && { status }),
        ...(type && { type })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 