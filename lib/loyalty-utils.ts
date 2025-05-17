import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 10000,
}

const POINTS_MULTIPLIERS = {
  BRONZE: 1,
  SILVER: 1.2,
  GOLD: 1.5,
  PLATINUM: 2,
}

export async function createLoyaltyAccount(userId: string) {
  return prisma.loyaltyAccount.create({
    data: {
      userId,
      points: 0,
      tier: 'BRONZE',
    },
  })
}

export async function calculateBookingPoints(
  amount: number,
  tier: string
): number {
  // Base points calculation: 1 point per dollar spent
  const basePoints = Math.floor(amount)
  
  // Apply tier multiplier
  const multiplier = POINTS_MULTIPLIERS[tier as keyof typeof POINTS_MULTIPLIERS] || 1
  return Math.floor(basePoints * multiplier)
}

export async function awardBookingPoints(
  bookingId: string,
  userId: string,
  amount: number
) {
  // Get or create loyalty account
  let loyaltyAccount = await prisma.loyaltyAccount.findUnique({
    where: { userId },
  })

  if (!loyaltyAccount) {
    loyaltyAccount = await createLoyaltyAccount(userId)
  }

  // Calculate points
  const points = await calculateBookingPoints(amount, loyaltyAccount.tier)

  // Create transaction
  const transaction = await prisma.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: loyaltyAccount.id,
      type: 'EARN',
      points,
      description: `Points earned from booking ${bookingId}`,
      bookingId,
    },
  })

  // Update loyalty account
  const updatedAccount = await prisma.loyaltyAccount.update({
    where: { id: loyaltyAccount.id },
    data: {
      points: { increment: points },
      totalBookings: { increment: 1 },
      totalSpent: { increment: amount },
    },
  })

  // Check for tier upgrade
  await checkAndUpdateTier(updatedAccount.id)

  return {
    transaction,
    updatedAccount,
  }
}

export async function redeemPoints(
  userId: string,
  points: number,
  bookingId: string
) {
  const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
    where: { userId },
  })

  if (!loyaltyAccount) {
    throw new Error('Loyalty account not found')
  }

  if (loyaltyAccount.points < points) {
    throw new Error('Insufficient points')
  }

  // Create redemption transaction
  const transaction = await prisma.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: loyaltyAccount.id,
      type: 'REDEEM',
      points: -points,
      description: `Points redeemed for booking ${bookingId}`,
      bookingId,
    },
  })

  // Update loyalty account
  const updatedAccount = await prisma.loyaltyAccount.update({
    where: { id: loyaltyAccount.id },
    data: {
      points: { decrement: points },
    },
  })

  return {
    transaction,
    updatedAccount,
  }
}

export async function checkAndUpdateTier(accountId: string) {
  const account = await prisma.loyaltyAccount.findUnique({
    where: { id: accountId },
  })

  if (!account) {
    throw new Error('Loyalty account not found')
  }

  let newTier = 'BRONZE'
  if (account.points >= TIER_THRESHOLDS.PLATINUM) {
    newTier = 'PLATINUM'
  } else if (account.points >= TIER_THRESHOLDS.GOLD) {
    newTier = 'GOLD'
  } else if (account.points >= TIER_THRESHOLDS.SILVER) {
    newTier = 'SILVER'
  }

  if (newTier !== account.tier) {
    return prisma.loyaltyAccount.update({
      where: { id: accountId },
      data: { tier: newTier },
    })
  }

  return account
}

export async function getLoyaltyAccountSummary(userId: string) {
  const account = await prisma.loyaltyAccount.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!account) {
    throw new Error('Loyalty account not found')
  }

  // Calculate points needed for next tier
  let nextTier = null
  let pointsToNextTier = null

  if (account.tier === 'BRONZE') {
    nextTier = 'SILVER'
    pointsToNextTier = TIER_THRESHOLDS.SILVER - account.points
  } else if (account.tier === 'SILVER') {
    nextTier = 'GOLD'
    pointsToNextTier = TIER_THRESHOLDS.GOLD - account.points
  } else if (account.tier === 'GOLD') {
    nextTier = 'PLATINUM'
    pointsToNextTier = TIER_THRESHOLDS.PLATINUM - account.points
  }

  return {
    ...account,
    nextTier,
    pointsToNextTier,
  }
} 