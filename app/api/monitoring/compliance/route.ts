import { NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { soc2Logger } from 'lib/services/soc2-logging'
import { SOC2Actions, SOC2ResourceTypes } from 'types/soc2'
import type { AuditLog } from '@prisma/client'

interface ComplianceCheck {
  id: string
  name: string
  category: 'access' | 'security' | 'monitoring' | 'backup' | 'encryption'
  status: 'compliant' | 'non-compliant' | 'warning'
  description: string
  details: Record<string, any>
  remediation?: string
}

interface ComplianceMetrics {
  overallStatus: 'compliant' | 'non-compliant' | 'warning'
  lastUpdated: string
  complianceRate: number
  checks: ComplianceCheck[]
  summary: {
    total: number
    compliant: number
    nonCompliant: number
    warning: number
  }
}

export async function GET() {
  try {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch data for compliance checks
    const [
      mfaStats,
      passwordStats,
      auditLogStats,
      sessionStats
    ] = await Promise.all([
      // MFA adoption check
      prisma.user.aggregate({
        _count: {
          _all: true,
        },
        where: {
          isActive: true,
        },
      }).then(async (total) => ({
        total: total._count._all,
        enabled: await prisma.user.count({
          where: {
            isActive: true,
            mfaEnabled: true,
          },
        }),
      })),

      // Password policy compliance
      prisma.user.count({
        where: {
          isActive: true,
          password: {
            not: {
              contains: '[A-Z]',
            },
          },
        },
      }),

      // Audit log coverage
      prisma.auditLog.groupBy({
        by: ['resource'],
        _count: {
          _all: true,
        },
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
      }),

      // Session management
      prisma.session.aggregate({
        _count: {
          _all: true,
        },
        where: {
          expiresAt: {
            gt: now,
          },
        },
      }),
    ])

    // Analyze compliance checks
    const checks: ComplianceCheck[] = [
      // MFA Check
      {
        id: 'mfa-adoption',
        name: 'Multi-Factor Authentication',
        category: 'security',
        status: mfaStats.enabled / mfaStats.total >= 0.9 ? 'compliant' : 
               mfaStats.enabled / mfaStats.total >= 0.75 ? 'warning' : 'non-compliant',
        description: 'MFA adoption rate across active users',
        details: {
          totalUsers: mfaStats.total,
          mfaEnabledUsers: mfaStats.enabled,
          adoptionRate: (mfaStats.enabled / mfaStats.total) * 100,
        },
        remediation: mfaStats.enabled / mfaStats.total < 0.9 ? 
          'Enforce MFA enrollment for all users through security policy' : undefined,
      },

      // Password Policy Check
      {
        id: 'password-policy',
        name: 'Password Policy Compliance',
        category: 'security',
        status: passwordStats === 0 ? 'compliant' : 
               passwordStats < 5 ? 'warning' : 'non-compliant',
        description: 'Password strength and policy compliance',
        details: {
          nonCompliantUsers: passwordStats,
          requirements: [
            'Minimum 12 characters',
            'At least one uppercase letter',
            'At least one number',
            'At least one special character',
          ],
        },
        remediation: passwordStats > 0 ? 
          'Force password reset for non-compliant users and enforce strong password policy' : undefined,
      },

      // Audit Logging Check
      {
        id: 'audit-coverage',
        name: 'Audit Log Coverage',
        category: 'monitoring',
        status: auditLogStats.length >= 5 ? 'compliant' :
               auditLogStats.length >= 3 ? 'warning' : 'non-compliant',
        description: 'Comprehensive audit logging across resources',
        details: {
          coveredResources: auditLogStats.map(stat => stat.resource),
          eventCounts: Object.fromEntries(
            auditLogStats.map(stat => [stat.resource, stat._count._all])
          ),
        },
        remediation: auditLogStats.length < 5 ?
          'Enable audit logging for all critical system resources and operations' : undefined,
      },

      // Session Management Check
      {
        id: 'session-management',
        name: 'Session Management',
        category: 'security',
        status: sessionStats._count._all <= 100 ? 'compliant' : 'warning',
        description: 'Active session monitoring and control',
        details: {
          activeSessions: sessionStats._count._all,
          maxRecommended: 100,
        },
        remediation: sessionStats._count._all > 100 ?
          'Review and terminate inactive or suspicious sessions' : undefined,
      },
    ]

    // Calculate overall metrics
    const summary = {
      total: checks.length,
      compliant: checks.filter(c => c.status === 'compliant').length,
      nonCompliant: checks.filter(c => c.status === 'non-compliant').length,
      warning: checks.filter(c => c.status === 'warning').length,
    }

    const complianceRate = (summary.compliant / summary.total) * 100

    const metrics: ComplianceMetrics = {
      overallStatus: summary.nonCompliant > 0 ? 'non-compliant' :
                    summary.warning > 0 ? 'warning' : 'compliant',
      lastUpdated: now.toISOString(),
      complianceRate,
      checks,
      summary,
    }

    soc2Logger.audit(SOC2Actions.DATA_READ, 'success', {
      resourceType: SOC2ResourceTypes.DATA,
      details: { resource: 'compliance-metrics' },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching compliance metrics:', error)
    soc2Logger.audit(SOC2Actions.DATA_READ, 'failure', {
      resourceType: SOC2ResourceTypes.DATA,
      details: { resource: 'compliance-metrics', error: error instanceof Error ? error.message : String(error) },
    })

    return NextResponse.json(
      { error: 'Failed to fetch compliance metrics' },
      { status: 500 }
    )
  }
}
