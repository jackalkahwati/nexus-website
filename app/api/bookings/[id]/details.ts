import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BookingStatus } from '@prisma/client'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            name: true,
            type: true,
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
    })

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()

    // If updating time, check for conflicts
    if (data.startTime || data.endTime) {
      const booking = await prisma.booking.findUnique({
        where: { id: params.id }
      })

      if (!booking) {
        return new NextResponse('Booking not found', { status: 404 })
      }

      const startTime = new Date(data.startTime || booking.startTime)
      const endTime = new Date(data.endTime || booking.endTime)

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          vehicleId: booking.vehicleId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      })

      if (conflictingBooking) {
        return new NextResponse('Vehicle is not available for the selected time period', { status: 400 })
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            name: true,
            type: true,
          },
        },
        payment: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 })
    }

    // Check if booking is pending
    if (booking.status === BookingStatus.PENDING) {
      // Only allow deletion of pending bookings
      await prisma.booking.delete({
        where: { id: params.id }
      })
    } else {
      return new NextResponse('Only pending bookings can be deleted', { status: 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 