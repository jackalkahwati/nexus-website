import { prisma } from '@/lib/prisma'
import { FindUserResult } from '../db-types'
import { soc2Logger } from '../../soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'

export async function findUserWithMFA(email: string): Promise<FindUserResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        mfaEnabled: true
      }
    })

    if (!user) {
      soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_ACCESS, 'failure', {
        resourceType: SOC2ResourceTypes.USER,
        details: { error: 'User not found', email }
      })
      return { user: null, error: 'User not found' }
    }

    return { user }
  } catch (error) {
    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_ACCESS, 'failure', {
      resourceType: SOC2ResourceTypes.USER,
      details: { error: error instanceof Error ? error.message : String(error) }
    })
    return { user: null, error: 'Database error' }
  }
}
