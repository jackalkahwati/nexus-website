import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { 
  checkStationStatus,
  createRebalancingTask,
  optimizeRebalancingRoutes,
  updateRebalancingTask,
  getRebalancingMetrics
} from '@/lib/rebalancing-utils'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { stationId, requiredCount, priority, notes } = body

    if (!stationId || requiredCount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const task = await createRebalancingTask(
      stationId,
      requiredCount,
      priority,
      notes
    )

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating rebalancing task:', error)
    return NextResponse.json(
      { error: 'Failed to create rebalancing task' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const stationId = searchParams.get('stationId')
    const zoneId = searchParams.get('zoneId')

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'check-status':
        if (!stationId) {
          return NextResponse.json(
            { error: 'Missing stationId' },
            { status: 400 }
          )
        }
        const status = await checkStationStatus(stationId)
        return NextResponse.json(status)

      case 'optimize-routes':
        const tasksParam = searchParams.get('tasks')
        const vehicleLocation = searchParams.get('vehicleLocation')
        
        if (!tasksParam || !vehicleLocation) {
          return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
          )
        }

        const tasks = tasksParam.split(',')
        const location = JSON.parse(vehicleLocation)
        
        const routes = await optimizeRebalancingRoutes(tasks, location)
        return NextResponse.json(routes)

      case 'metrics':
        const metrics = await getRebalancingMetrics(zoneId || undefined)
        return NextResponse.json(metrics)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing rebalancing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { taskId, status, currentCount, notes, completedAt } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      )
    }

    const updatedTask = await updateRebalancingTask(taskId, {
      status,
      currentCount,
      notes,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating rebalancing task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
} 