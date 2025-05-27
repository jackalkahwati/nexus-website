import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        mfaEnabled: true,
        lastLoginAt: true
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    soc2Logger.audit(SOC2Actions.DATA_READ, 'success', {
      resourceType: SOC2ResourceTypes.USER,
      details: { action: 'mfa-status-check' }
    })

    return NextResponse.json({
      enabled: user.mfaEnabled,
      lastVerified: user.lastLoginAt,
    })
  } catch (error) {
    console.error('Error fetching MFA status:', error)
    soc2Logger.audit(SOC2Actions.DATA_READ, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: { action: 'mfa-status-check', error: error instanceof Error ? error.message : String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to fetch MFA status' },
      { status: 500 }
    )
  }
}
