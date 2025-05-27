import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { authenticator } from 'otplib'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        mfaSecret: true,
        mfaEnabled: true,
        lastLoginAt: true
      },
    })

    if (!user || !user.mfaSecret) {
      return NextResponse.json(
        { error: 'User not found or MFA not setup' },
        { status: 404 }
      )
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    })

    if (!isValid) {
      soc2Logger.audit(SOC2Actions.MFA_VERIFY, 'failure', {
        resourceType: SOC2ResourceTypes.USER,
        details: { userId: user.id, reason: 'Invalid token' }
      })

      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // If this is initial setup, enable MFA
    if (!user.mfaEnabled) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          mfaEnabled: true,
        },
      })
    }

    soc2Logger.audit(SOC2Actions.MFA_VERIFY, 'success', {
      resourceType: SOC2ResourceTypes.USER,
      details: { userId: user.id }
    })

    return NextResponse.json({
      verified: true,
    })
  } catch (error) {
    console.error('Error verifying MFA:', error)
    soc2Logger.audit(SOC2Actions.MFA_VERIFY, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: { error: error instanceof Error ? error.message : String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to verify MFA token' },
      { status: 500 }
    )
  }
}
