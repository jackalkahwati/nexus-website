import { NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { soc2Logger } from 'lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from 'types/soc2'

interface SecurityMetrics {
  totalUsage: number
  successfulUses: number
  failedAttempts: number
  generationEvents: number
  recentActivity: Array<{
    action: string
    status: string
    createdAt: Date
    details: any
  }>
}

async function getRecoveryCodeMetrics(): Promise<SecurityMetrics> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          SOC2Actions.MFA_RECOVERY_CODE_GENERATE,
          SOC2Actions.MFA_RECOVERY_CODE_USE,
          SOC2Actions.MFA_RECOVERY_CODE_ACCESS
        ]
      },
      createdAt: {
        gte: thirtyDaysAgo
      }
    },
    select: {
      action: true,
      status: true,
      createdAt: true,
      details: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const metrics: SecurityMetrics = {
    totalUsage: auditLogs.length,
    successfulUses: auditLogs.filter(log => log.status === 'success').length,
    failedAttempts: auditLogs.filter(log => log.status === 'failure').length,
    generationEvents: auditLogs.filter(log => log.action === SOC2Actions.MFA_RECOVERY_CODE_GENERATE).length,
    recentActivity: auditLogs.slice(0, 10)
  }

  return metrics
}

export async function GET() {
  try {
    const metrics = await getRecoveryCodeMetrics()

    soc2Logger.audit(SOC2Actions.DATA_ACCESS, 'success', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { action: 'fetch_metrics' }
    })

    return NextResponse.json(metrics)
  } catch (error) {
    soc2Logger.audit(SOC2Actions.DATA_ACCESS, 'failure', {
      resourceType: SOC2ResourceTypes.RECOVERY_CODE,
      details: { error: error instanceof Error ? error.message : String(error) }
    })
    return NextResponse.json({ error: 'Failed to fetch security metrics' }, { status: 500 })
  }
}
