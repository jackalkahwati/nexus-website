import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'

export async function POST() {
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
        mfaEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA is not enabled' },
        { status: 400 }
      )
    }

    // Disable MFA and clear secret
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    })

    soc2Logger.audit(SOC2Actions.MFA_DISABLE, 'success', {
      resourceType: SOC2ResourceTypes.USER,
      details: { userId: user.id }
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error disabling MFA:', error)
    soc2Logger.audit(SOC2Actions.MFA_DISABLE, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: { error: error instanceof Error ? error.message : String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to disable MFA' },
      { status: 500 }
    )
  }
}
