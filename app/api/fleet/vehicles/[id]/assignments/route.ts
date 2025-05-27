import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Vehicle } from '@/types/fleet'

// Mock database reference (this would be replaced with a real database in production)
let vehicles: Vehicle[] = []

// Separate assignments storage
interface Assignment {
  id: string
  vehicleId: string
  type: 'delivery' | 'pickup' | 'maintenance' | 'transfer'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  startTime: string
  endTime: string
  details: Record<string, any>
}

let assignments: Assignment[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vehicle = vehicles.find(v => v.id === params.id)
  if (!vehicle) {
    return NextResponse.json(
      { error: 'Vehicle not found' },
      { status: 404 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let filteredAssignments = assignments.filter(a => a.vehicleId === params.id)

  // Apply filters
  if (status) {
    filteredAssignments = filteredAssignments.filter(a => a.status === status)
  }
  if (type) {
    filteredAssignments = filteredAssignments.filter(a => a.type === type)
  }

  // Sort by start time descending
  filteredAssignments.sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  return NextResponse.json({
    assignments: filteredAssignments,
    total: filteredAssignments.length,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = vehicles.find(v => v.id === params.id)
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      vehicleId: params.id,
      type: body.type,
      status: 'pending',
      startTime: body.startTime,
      endTime: body.endTime,
      details: body.details || {},
    }

    assignments.push(newAssignment)

    return NextResponse.json(newAssignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { assignmentId, ...updates } = body

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    const assignmentIndex = assignments.findIndex(a => 
      a.id === assignmentId && a.vehicleId === params.id
    )

    if (assignmentIndex === -1) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    assignments[assignmentIndex] = {
      ...assignments[assignmentIndex],
      ...updates,
    }

    return NextResponse.json(assignments[assignmentIndex])
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const assignmentId = searchParams.get('assignmentId')

  if (!assignmentId) {
    return NextResponse.json(
      { error: 'Assignment ID is required' },
      { status: 400 }
    )
  }

  const assignmentIndex = assignments.findIndex(a => 
    a.id === assignmentId && a.vehicleId === params.id
  )

  if (assignmentIndex === -1) {
    return NextResponse.json(
      { error: 'Assignment not found' },
      { status: 404 }
    )
  }

  assignments.splice(assignmentIndex, 1)

  return NextResponse.json({ success: true })
} 