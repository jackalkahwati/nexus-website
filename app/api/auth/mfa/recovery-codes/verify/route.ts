import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { verifyRecoveryCode } from '@/lib/services/recovery-codes/verify-code'

interface VerifyRequest {
  code: string
}

function createErrorResponse(error: string, status: number) {
  soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'failure', {
    resourceType: SOC2ResourceTypes.RECOVERY_CODE,
    details: { error }
  })
  return NextResponse.json({ error }, { status })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email || !session?.user?.id) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { code } = body as VerifyRequest

    if (!code || typeof code !== 'string') {
      return createErrorResponse('Invalid recovery code format', 400)
    }

    const result = await verifyRecoveryCode(session.user.id, code)

    if (!result.isValid) {
      return createErrorResponse(result.error || 'Invalid recovery code', 400)
    }

    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'success', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recovery code verification error:', error)
    return createErrorResponse(
      'An error occurred while verifying the recovery code',
      500
    )
  }
}
