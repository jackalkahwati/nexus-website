import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { soc2Logger } from '@/lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes, type SOC2AuditLog, type SOC2Action, type SOC2Status, type SOC2ResourceType } from '@/types/soc2'

export async function GET() {
  try {
    // First get audit logs without user data
    const auditLogs = await prisma.sOC2AuditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 logs
    })

    // Transform the logs to match SOC2AuditLog interface
    const transformedLogs: SOC2AuditLog[] = auditLogs.map(log => ({
      action: log.action as SOC2Action,
      status: 'success' as SOC2Status,
      resourceType: log.resourceType as SOC2ResourceType,
      details: {
        userId: log.userId || undefined,
        resourceId: log.resourceId || undefined,
        ...(log.metadata as Record<string, any> || {})
      }
    }))

    soc2Logger.audit(SOC2Actions.DATA_READ, 'success', {
      resourceType: SOC2ResourceTypes.DATA,
      details: { resource: 'audit-logs' },
    })

    return NextResponse.json(transformedLogs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    soc2Logger.audit(SOC2Actions.DATA_READ, 'failure', {
      resourceType: SOC2ResourceTypes.DATA,
      details: { resource: 'audit-logs', error: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
