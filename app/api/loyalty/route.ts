import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import {
  getLoyaltyAccountSummary,
  redeemPoints,
  createLoyaltyAccount,
} from '@/lib/loyalty-utils'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      const summary = await getLoyaltyAccountSummary(session.user.id)
      return NextResponse.json(summary)
    } catch (error) {
      if (error instanceof Error && error.message === 'Loyalty account not found') {
        // Create new account if it doesn't exist
        const account = await createLoyaltyAccount(session.user.id)
        return NextResponse.json({
          ...account,
          nextTier: 'SILVER',
          pointsToNextTier: 1000,
          transactions: [],
        })
      }
      throw error
    }
  } catch (error) {
    console.error('Failed to get loyalty account:', error)
    return NextResponse.json(
      { error: 'Failed to get loyalty account' },
      { status: 500 }
    )
  }
}

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
    const { points, bookingId } = body

    if (!points || !bookingId) {
      return NextResponse.json(
        { error: 'Points and booking ID are required' },
        { status: 400 }
      )
    }

    if (points <= 0) {
      return NextResponse.json(
        { error: 'Points must be greater than 0' },
        { status: 400 }
      )
    }

    const result = await redeemPoints(
      session.user.id,
      points,
      bookingId
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to redeem points:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to redeem points' },
      { status: 500 }
    )
  }
} 