import { PrismaClient } from '@prisma/client'
import { addDays, isAfter, isBefore } from 'date-fns'

const prisma = new PrismaClient()

export async function addToWaitlist(
  userId: string,
  vehicleId: string,
  startTime: Date,
  endTime: Date,
  notes?: string
) {
  // Check if user already has a pending waitlist entry for this vehicle
  const existingEntry = await prisma.waitlistEntry.findFirst({
    where: {
      userId,
      vehicleId,
      status: 'PENDING',
      startTime: {
        gte: new Date(),
      },
    },
  })

  if (existingEntry) {
    throw new Error('User already on waitlist for this vehicle')
  }

  // Calculate priority based on user's loyalty tier and booking history
  const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
    where: { userId },
  })

  let priority = 0
  if (loyaltyAccount) {
    switch (loyaltyAccount.tier) {
      case 'PLATINUM':
        priority = 4
        break
      case 'GOLD':
        priority = 3
        break
      case 'SILVER':
        priority = 2
        break
      case 'BRONZE':
        priority = 1
        break
    }
  }

  // Create waitlist entry
  return prisma.waitlistEntry.create({
    data: {
      userId,
      vehicleId,
      startTime,
      endTime,
      priority,
      notes,
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
        },
      },
    },
  })
}

export async function checkWaitlistAvailability(
  vehicleId: string,
  startTime: Date,
  endTime: Date
) {
  // Get all pending waitlist entries for this vehicle
  const entries = await prisma.waitlistEntry.findMany({
    where: {
      vehicleId,
      status: 'PENDING',
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
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' },
    ],
  })

  return entries
}

export async function notifyWaitlistUsers(vehicleId: string, date: Date) {
  // Find all pending waitlist entries that could be fulfilled
  const entries = await prisma.waitlistEntry.findMany({
    where: {
      vehicleId,
      status: 'PENDING',
      startTime: {
        gte: date,
        lte: addDays(date, 7), // Notify for availability within next 7 days
      },
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      vehicle: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' },
    ],
  })

  // Update entries to NOTIFIED status
  for (const entry of entries) {
    await prisma.waitlistEntry.update({
      where: { id: entry.id },
      data: { status: 'NOTIFIED' },
    })

    // TODO: Implement notification system (email, push, etc.)
    console.log(`Notifying user ${entry.user.email} about vehicle ${entry.vehicle.name} availability`)
  }

  return entries
}

export async function processWaitlistConversion(entryId: string) {
  // Find the waitlist entry
  const entry = await prisma.waitlistEntry.findUnique({
    where: { id: entryId },
  })

  if (!entry || entry.status !== 'NOTIFIED') {
    throw new Error('Invalid waitlist entry or wrong status')
  }

  // Update entry status to CONVERTED
  await prisma.waitlistEntry.update({
    where: { id: entryId },
    data: { status: 'CONVERTED' },
  })

  // Expire other entries for the same time slot
  await prisma.waitlistEntry.updateMany({
    where: {
      vehicleId: entry.vehicleId,
      status: 'PENDING',
      OR: [
        {
          AND: [
            { startTime: { lte: entry.startTime } },
            { endTime: { gt: entry.startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: entry.endTime } },
            { endTime: { gte: entry.endTime } },
          ],
        },
      ],
    },
    data: { status: 'EXPIRED' },
  })

  return entry
}

export async function cleanupExpiredWaitlist() {
  const now = new Date()

  // Update all expired entries
  return prisma.waitlistEntry.updateMany({
    where: {
      status: 'PENDING',
      endTime: { lt: now },
    },
    data: { status: 'EXPIRED' },
  })
} 