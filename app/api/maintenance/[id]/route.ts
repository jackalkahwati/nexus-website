import { NextResponse } from 'next/server'
import type { MaintenanceTask } from '@/types/maintenance'

// Simulated database
let maintenanceTasks: MaintenanceTask[] = []

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = maintenanceTasks.find(t => t.id === params.id)
    if (!task) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch maintenance task' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const index = maintenanceTasks.findIndex(t => t.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    const updatedTask = {
      ...maintenanceTasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    maintenanceTasks[index] = updatedTask
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update maintenance task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const index = maintenanceTasks.findIndex(t => t.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Maintenance task not found' },
        { status: 404 }
      )
    }

    maintenanceTasks.splice(index, 1)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete maintenance task' },
      { status: 500 }
    )
  }
} 