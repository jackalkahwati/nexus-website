import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { getOrCreateCodes } from '@/lib/services/recovery-codes/get-codes'

function createErrorResponse(error: string, status: number) {
  soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_ACCESS, 'failure', {
    resourceType: SOC2ResourceTypes.RECOVERY_CODE,
    details: { error }
  })
  return NextResponse.json({ error }, { status })
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email || !session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const codes = await getOrCreateCodes(session.user.id, session.user.email)

    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_ACCESS, 'success', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId: session.user.id }
    })

    return NextResponse.json({ codes })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'MFA is not enabled' ? 400 : 500
    return createErrorResponse(message, status)
  }
}

export async function POST() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email || !session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const codes = await getOrCreateCodes(session.user.id, session.user.email)

    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_GENERATE, 'success', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId: session.user.id }
    })

    return NextResponse.json({ codes })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'MFA is not enabled' ? 400 : 500
    return createErrorResponse(message, status)
  }
}
