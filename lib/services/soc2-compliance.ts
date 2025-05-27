import { alertNotificationService } from './alert-notifications'
import { prisma } from '../prisma'
import { auditLogger } from '../audit-logger'
import type { AuditAction, ResourceType } from '../audit-logger'
import type { User, AuditLog, Prisma } from '@prisma/client'

interface ComplianceCheck {
  id: string
  name: string
  description: string
  check: () => Promise<boolean>
  remediation?: string
}

interface SecurityReview {
  id: string
  timestamp: Date
  findings: Array<{
    type: string
    description: string
    severity: 'high' | 'medium' | 'low'
    status: 'open' | 'resolved'
    resolution?: string
  }>
  reviewer: string
  nextReviewDate: Date
}

interface RecoveryCodeStats {
  _count: {
    [key: string]: number
  }
  used: boolean
}

interface UserWithRole extends User {
  role: {
    name: string
  }
}

class SOC2ComplianceService {
  private readonly REVIEW_INTERVAL = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

  private complianceChecks: ComplianceCheck[] = [
    {
      id: 'recovery-codes-usage',
      name: 'Recovery Codes Usage Check',
      description: 'Verifies that recovery codes are being used appropriately and securely',
      check: async () => {
        const stats = await prisma.recoveryCodes.groupBy({
          by: ['used'],
          _count: true
        }) as RecoveryCodeStats[]
        
        const totalCodes = stats.reduce((acc: number, curr: RecoveryCodeStats) => acc + curr._count['used'], 0)
        const usedCodes = stats.find((s: RecoveryCodeStats) => s.used)?._count['used'] || 0
        
        return (usedCodes / totalCodes) < 0.7 // Less than 70% used is compliant
      },
      remediation: 'Generate new recovery codes for users who have used most of their codes'
    },
    {
      id: 'mfa-enforcement',
      name: 'MFA Enforcement Check',
      description: 'Verifies that MFA is properly enforced for all required users',
      check: async () => {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            mfaEnabled: true,
            role: {
              select: {
                name: true
              }
            }
          }
        })
        
        const requiredUsers = users.filter(u => u.role.name !== 'basic')
        const mfaEnabledCount = requiredUsers.filter(u => u.mfaEnabled).length
        
        return mfaEnabledCount === requiredUsers.length
      },
      remediation: 'Enforce MFA setup for all users with elevated privileges'
    },
    {
      id: 'recovery-codes-security',
      name: 'Recovery Codes Security Check',
      description: 'Verifies that recovery codes are properly secured and not compromised',
      check: async () => {
        const recentAttempts = await prisma.auditLog.findMany({
          where: {
            action: 'recovery_code.verify',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        })
        
        const failedAttempts = recentAttempts.filter((a: AuditLog) => a.status === 'failure')
        return failedAttempts.length < 5 // Less than 5 failed attempts in 24h is compliant
      },
      remediation: 'Investigate suspicious recovery code usage patterns and implement additional security measures'
    }
  ]

  async runComplianceChecks() {
    const results = []
    
    for (const check of this.complianceChecks) {
      try {
        const isCompliant = await check.check()
        
        results.push({
          id: check.id,
          name: check.name,
          status: isCompliant ? 'compliant' : 'non-compliant',
          timestamp: new Date(),
          remediation: isCompliant ? undefined : check.remediation
        })

        // Log the compliance check result
        await auditLogger.log({
          action: 'compliance.check' as AuditAction,
          userId: 'system',
          resourceType: 'compliance' as ResourceType,
          resourceId: check.id,
          details: {
            name: check.name,
            result: isCompliant ? 'compliant' : 'non-compliant'
          }
        })

        // Send alert if non-compliant
        if (!isCompliant) {
          await alertNotificationService.checkAndNotify({
            type: 'compliance_failure',
            title: `Compliance Check Failed: ${check.name}`,
            message: `The compliance check "${check.name}" has failed. ${check.remediation || ''}`,
            severity: 'critical',
            details: {
              checkId: check.id,
              description: check.description
            }
          } as any)
        }
      } catch (error: unknown) {
        console.error(`Error running compliance check ${check.id}:`, error)
        
        results.push({
          id: check.id,
          name: check.name,
          status: 'error',
          timestamp: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  async scheduleSecurityReview(reviewer: string) {
    const review: SecurityReview = {
      id: `sr-${Date.now()}`,
      timestamp: new Date(),
      findings: [],
      reviewer,
      nextReviewDate: new Date(Date.now() + this.REVIEW_INTERVAL)
    }

    // Run compliance checks as part of the review
    const complianceResults = await this.runComplianceChecks()
    
    // Add non-compliant results as findings
    review.findings.push(
      ...complianceResults
        .filter(r => r.status === 'non-compliant')
        .map(r => ({
          type: 'compliance_failure',
          description: `Compliance check "${r.name}" failed`,
          severity: 'high' as const,
          status: 'open' as const,
          resolution: r.remediation
        }))
    )

    // Store the review in audit log
    await auditLogger.log({
      action: 'security.review' as AuditAction,
      userId: reviewer,
      resourceType: 'security' as ResourceType,
      resourceId: review.id,
      details: {
        findings: review.findings,
        nextReviewDate: review.nextReviewDate
      }
    })

    return review
  }

  async getNextScheduledReview() {
    const latestReview = await prisma.auditLog.findFirst({
      where: {
        action: 'security.review'
      },
      orderBy: {
        createdAt: 'desc' as Prisma.SortOrder
      }
    })

    if (!latestReview) {
      return new Date() // If no reviews exist, one should be done immediately
    }

    return new Date(latestReview.createdAt.getTime() + this.REVIEW_INTERVAL)
  }

  async checkAndNotifyForReview() {
    const nextReview = await this.getNextScheduledReview()
    
    if (nextReview.getTime() <= Date.now()) {
      await alertNotificationService.checkAndNotify({
        type: 'security_review_due',
        title: 'Security Review Required',
        message: 'A scheduled security review is due. Please conduct the review as soon as possible.',
        severity: 'warning',
        details: {
          dueDate: nextReview
        }
      } as any)
    }
  }
}

export const soc2ComplianceService = new SOC2ComplianceService()
