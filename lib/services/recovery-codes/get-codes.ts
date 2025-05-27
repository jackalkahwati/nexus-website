import { prisma } from '@/lib/prisma'
import { soc2Logger } from '../soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { generateCodes, hashCode } from './utils'
import { findUserWithMFA } from './db/find-user'

async function createNewCodes(userId: string): Promise<string[]> {
  const codes = generateCodes()
  const hashedCodes = codes.map(hashCode)

  await prisma.recoveryCodes.upsert({
    where: { userId },
    create: {
      userId,
      codes: hashedCodes
    },
    update: {
      codes: hashedCodes
    }
  })

  soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_GENERATE, 'success', {
    resourceType: SOC2ResourceTypes.RECOVERY_CODE,
    details: { userId }
  })

  return codes
}

async function getExistingCodes(userId: string): Promise<string[] | null> {
  const record = await prisma.recoveryCodes.findUnique({
    where: { userId },
    select: { codes: true }
  })

  return record?.codes || null
}

export async function getOrCreateCodes(userId: string, email: string): Promise<string[]> {
  const { user, error } = await findUserWithMFA(email)

  if (error || !user) {
    throw new Error(error || 'User not found')
  }

  if (!user.mfaEnabled) {
    throw new Error('MFA is not enabled')
  }

  const existingCodes = await getExistingCodes(userId)
  if (existingCodes?.length) {
    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_ACCESS, 'success', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId }
    })
    return existingCodes
  }

  return createNewCodes(userId)
}
