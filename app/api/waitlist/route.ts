import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { addToWaitlist, checkWaitlistAvailability } from '@/lib/waitlist-utils'

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
      vehicleId,
      startTime,
      endTime,
      notes,
    } = body

    // Validate required fields
    if (!vehicleId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Vehicle ID, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Add to waitlist
    const entry = await addToWaitlist(
      session.user.id,
      vehicleId,
      new Date(startTime),
      new Date(endTime),
      notes
    )

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Failed to add to waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    if (!vehicleId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Vehicle ID, start time, and end time are required' },
        { status: 400 }
      )
    }

    const entries = await checkWaitlistAvailability(
      vehicleId,
      new Date(startTime),
      new Date(endTime)
    )

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Failed to check waitlist:', error)
    return NextResponse.json(
      { error: 'Failed to check waitlist' },
      { status: 500 }
    )
  }
} 