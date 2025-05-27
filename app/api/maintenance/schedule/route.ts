import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import {
  createMaintenanceSchedule,
  checkAndScheduleMaintenance,
  updateMaintenanceSchedules,
  optimizeMaintenanceSchedule,
} from '@/lib/maintenance-scheduler'

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
    const { vehicleId, templateId, frequency } = body

    if (!vehicleId || !templateId || !frequency) {
      return NextResponse.json(
        { error: 'Vehicle ID, template ID, and frequency are required' },
        { status: 400 }
      )
    }

    const schedule = await createMaintenanceSchedule(
      vehicleId,
      templateId,
      frequency
    )

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Failed to create maintenance schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create maintenance schedule' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const vehicleId = searchParams.get('vehicleId')

    switch (action) {
      case 'check':
        const newTasks = await checkAndScheduleMaintenance()
        return NextResponse.json(newTasks)

      case 'update':
        const updatedSchedules = await updateMaintenanceSchedules()
        return NextResponse.json(updatedSchedules)

      case 'optimize':
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID is required for optimization' },
            { status: 400 }
          )
        }
        const optimizedSchedules = await optimizeMaintenanceSchedule(vehicleId)
        return NextResponse.json(optimizedSchedules)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Failed to process maintenance schedule action:', error)
    return NextResponse.json(
      { error: 'Failed to process maintenance schedule action' },
      { status: 500 }
    )
  }
} 