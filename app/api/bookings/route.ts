import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { BookingStatus, BookingType } from '@prisma/client'
import { calculateBookingPrice, checkBookingConflicts, validateBookingDuration } from '@/lib/booking-utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status') as BookingStatus | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where = {
      ...(userId && { userId }),
      ...(vehicleId && { vehicleId }),
      ...(status && { status }),
      ...(startDate && endDate && {
        AND: [
          { startTime: { gte: new Date(startDate) } },
          { endTime: { lte: new Date(endDate) } },
        ],
      }),
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
        payment: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      vehicleId,
      type = BookingType.STANDARD,
      startTime,
      endTime,
      location,
      participants = 1,
      recurringPattern,
      notes,
    } = body

    // Validate required fields
    if (!vehicleId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Vehicle ID, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Get active booking policy
    const bookingPolicy = await prisma.bookingPolicy.findFirst({
      where: { isActive: true },
    })

    if (!bookingPolicy) {
      return NextResponse.json(
        { error: 'No active booking policy found' },
        { status: 400 }
      )
    }

    // Validate booking duration
    const durationValidation = validateBookingDuration(
      new Date(startTime),
      new Date(endTime),
      bookingPolicy
    )

    if (!durationValidation.isValid) {
      return NextResponse.json(
        { error: durationValidation.error },
        { status: 400 }
      )
    }

    // Check for booking conflicts
    const hasConflicts = await checkBookingConflicts(
      prisma,
      vehicleId,
      new Date(startTime),
      new Date(endTime),
      recurringPattern
    )

    if (hasConflicts) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected time period' },
        { status: 400 }
      )
    }

    // Calculate booking price
    const price = calculateBookingPrice(
      new Date(startTime),
      new Date(endTime),
      bookingPolicy,
      type
    )

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        vehicleId,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        participants,
        recurringPattern,
        price,
        notes,
        status: BookingStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const updates = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updates,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
} 