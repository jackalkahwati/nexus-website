import { prisma } from '@/lib/prisma'
import { soc2Logger } from '../soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from '@/types/soc2'
import { hashCode } from './utils'

interface VerifyResult {
  isValid: boolean
  error?: string
}

interface StoredCodes {
  codes: string[]
}

async function findUserRecoveryCodes(userId: string): Promise<string[] | null> {
  const record = await prisma.recoveryCodes.findUnique({
    where: { userId },
    select: { codes: true }
  })
  return record?.codes || null
}

async function removeUsedCode(userId: string, usedCode: string): Promise<void> {
  const record = await prisma.recoveryCodes.findUnique({
    where: { userId },
    select: { codes: true }
  })

  if (record && Array.isArray(record.codes)) {
    const remainingCodes = record.codes.filter((code: string) => code !== usedCode)
    await prisma.recoveryCodes.update({
      where: { userId },
      data: { codes: remainingCodes }
    })
  }
}

export async function verifyRecoveryCode(userId: string, code: string): Promise<VerifyResult> {
  try {
    const storedCodes = await findUserRecoveryCodes(userId)
    if (!storedCodes) {
      soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'failure', {
        resourceType: SOC2ResourceTypes.RECOVERY_CODE,
        details: { userId, error: 'No recovery codes found' }
      })
      return { isValid: false, error: 'No recovery codes found' }
    }

    const hashedInput = hashCode(code)
    const isValid = storedCodes.includes(hashedInput)

    if (isValid) {
      await removeUsedCode(userId, hashedInput)
      soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'success', {
        resourceType: SOC2ResourceTypes.RECOVERY_CODE,
        details: { userId }
      })
      return { isValid: true }
    }

    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'failure', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId, error: 'Invalid recovery code' }
    })
    return { isValid: false, error: 'Invalid recovery code' }
  } catch (error) {
    soc2Logger.audit(SOC2Actions.MFA_RECOVERY_CODE_USE, 'failure', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { userId, error: error instanceof Error ? error.message : String(error) }
    })
    return { isValid: false, error: 'Failed to verify recovery code' }
  }
}
