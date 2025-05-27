import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

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
        email: true,
        mfaEnabled: true,
        mfaSecret: true
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA is already enabled' },
        { status: 400 }
      )
    }

    // Generate new secret
    const secret = authenticator.generateSecret()

    // Generate otpauth URL
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'Lattis Nexus',
      secret
    )

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl)

    // Store secret temporarily (will be saved permanently after verification)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaSecret: secret,
      },
    })

    soc2Logger.audit(SOC2Actions.MFA_SETUP, 'success', {
      resourceType: SOC2ResourceTypes.USER,
      details: { userId: user.id }
    })

    return NextResponse.json({
      secret,
      qrCode,
    })
  } catch (error) {
    console.error('Error setting up MFA:', error)
    soc2Logger.audit(SOC2Actions.MFA_SETUP, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: { error: error instanceof Error ? error.message : String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    )
  }
}
