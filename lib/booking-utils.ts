import { PrismaClient } from '@prisma/client'
import { addDays, addMonths, addWeeks, differenceInMinutes, parseISO } from 'date-fns'

interface BookingPolicy {
  minDuration: number
  maxDuration: number
  pricePerMinute: number | string
  pricePerHour: number | string
  pricePerDay: number | string
  lateFee: number | string
  cancellationFee: number | string
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateBookingDuration(
  startTime: Date,
  endTime: Date,
  policy: BookingPolicy
): ValidationResult {
  const durationMinutes = differenceInMinutes(endTime, startTime)

  if (durationMinutes < policy.minDuration) {
    return {
      isValid: false,
      error: `Booking duration must be at least ${policy.minDuration} minutes`,
    }
  }

  if (durationMinutes > policy.maxDuration) {
    return {
      isValid: false,
      error: `Booking duration cannot exceed ${policy.maxDuration} minutes`,
    }
  }

  return { isValid: true }
}

export function calculateBookingPrice(
  startTime: Date,
  endTime: Date,
  policy: BookingPolicy,
  type: string = 'standard'
): number {
  const durationMinutes = differenceInMinutes(endTime, startTime)
  let price = 0

  // Convert string prices to numbers if necessary
  const perMinute = Number(policy.pricePerMinute)
  const perHour = Number(policy.pricePerHour)
  const perDay = Number(policy.pricePerDay)

  if (durationMinutes < 60) {
    price = perMinute * durationMinutes
  } else if (durationMinutes < 1440) { // Less than 24 hours
    price = perHour * Math.ceil(durationMinutes / 60)
  } else {
    price = perDay * Math.ceil(durationMinutes / 1440)
  }

  // Apply any type-specific pricing adjustments
  switch (type) {
    case 'premium':
      price *= 1.5 // 50% premium
      break
    case 'group':
      price *= 1.25 // 25% premium for group bookings
      break
    default:
      break
  }

  return Math.round(price) // Round to nearest integer
}

export async function checkBookingConflicts(
  prisma: PrismaClient,
  vehicleId: string,
  startTime: Date,
  endTime: Date,
  recurringPattern?: string
): Promise<boolean> {
  // Check for direct conflicts
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: { in: ['pending', 'confirmed'] },
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
    return true
  }

  // If this is a recurring booking, check future conflicts
  if (recurringPattern) {
    const futureConflicts = await checkRecurringConflicts(
      prisma,
      vehicleId,
      startTime,
      endTime,
      recurringPattern
    )
    return futureConflicts
  }

  return false
}

async function checkRecurringConflicts(
  prisma: PrismaClient,
  vehicleId: string,
  startTime: Date,
  endTime: Date,
  recurringPattern: string
): Promise<boolean> {
  const [frequency, count] = recurringPattern.split(':')
  const occurrences = parseInt(count)
  let futureStartTime = startTime
  let futureEndTime = endTime

  for (let i = 1; i < occurrences; i++) {
    // Calculate next occurrence based on frequency
    switch (frequency) {
      case 'daily':
        futureStartTime = addDays(futureStartTime, 1)
        futureEndTime = addDays(futureEndTime, 1)
        break
      case 'weekly':
        futureStartTime = addWeeks(futureStartTime, 1)
        futureEndTime = addWeeks(futureEndTime, 1)
        break
      case 'monthly':
        futureStartTime = addMonths(futureStartTime, 1)
        futureEndTime = addMonths(futureEndTime, 1)
        break
      default:
        throw new Error('Invalid recurring pattern')
    }

    // Check for conflicts at this occurrence
    const conflict = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            AND: [
              { startTime: { lte: futureStartTime } },
              { endTime: { gt: futureStartTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: futureEndTime } },
              { endTime: { gte: futureEndTime } },
            ],
          },
        ],
      },
    })

    if (conflict) {
      return true
    }
  }

  return false
}

export async function createRecurringBookings(
  prisma: PrismaClient,
  baseBooking: any,
  recurringPattern: string,
  policy: BookingPolicy
): Promise<void> {
  const [frequency, count] = recurringPattern.split(':')
  const occurrences = parseInt(count)
  let currentStartTime = baseBooking.startTime
  let currentEndTime = baseBooking.endTime

  const bookings = []

  for (let i = 1; i < occurrences; i++) {
    // Calculate next occurrence based on frequency
    switch (frequency) {
      case 'daily':
        currentStartTime = addDays(currentStartTime, 1)
        currentEndTime = addDays(currentEndTime, 1)
        break
      case 'weekly':
        currentStartTime = addWeeks(currentStartTime, 1)
        currentEndTime = addWeeks(currentEndTime, 1)
        break
      case 'monthly':
        currentStartTime = addMonths(currentStartTime, 1)
        currentEndTime = addMonths(currentEndTime, 1)
        break
      default:
        throw new Error('Invalid recurring pattern')
    }

    // Create the recurring booking
    bookings.push({
      userId: baseBooking.userId,
      vehicleId: baseBooking.vehicleId,
      type: baseBooking.type,
      startTime: currentStartTime,
      endTime: currentEndTime,
      location: baseBooking.location,
      participants: baseBooking.participants,
      price: baseBooking.price,
      notes: baseBooking.notes,
      status: 'pending',
      recurringPattern: null, // Only the base booking stores the pattern
    })
  }

  // Create all recurring bookings in a transaction
  if (bookings.length > 0) {
    await prisma.booking.createMany({
      data: bookings,
    })
  }
}

export function calculateCancellationFee(
  startTime: Date,
  policy: BookingPolicy
): number {
  const now = new Date()
  const hoursUntilStart = differenceInMinutes(startTime, now) / 60

  // Convert cancellation fee to number if it's a string
  const baseFee = Number(policy.cancellationFee)

  // Apply different fee levels based on cancellation timing
  if (hoursUntilStart >= 48) {
    return Math.round(baseFee * 0.25) // 25% of base fee if cancelled 48+ hours in advance
  } else if (hoursUntilStart >= 24) {
    return Math.round(baseFee * 0.5) // 50% of base fee if cancelled 24-48 hours in advance
  } else if (hoursUntilStart >= 12) {
    return Math.round(baseFee * 0.75) // 75% of base fee if cancelled 12-24 hours in advance
  }

  return baseFee // Full cancellation fee if cancelled less than 12 hours in advance
} 