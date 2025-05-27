import { PrismaClient } from '@prisma/client'
import { logger } from '../logging/logger'
import { auditLogger, AuditActions, ResourceTypes } from '../audit-logger'

const prisma = new PrismaClient()

export interface RetentionRule {
  table: string
  field: string
  retention: number // in days
  anonymize?: boolean
  deleteStrategy?: 'soft' | 'hard'
  gdprSensitive?: boolean
}

export interface DataRetentionConfig {
  rules: RetentionRule[]
  defaultRetention: number // in days
  defaultStrategy: 'soft' | 'hard'
}

export class DataRetentionService {
  private config: DataRetentionConfig

  constructor(config: DataRetentionConfig) {
    this.config = {
      rules: config.rules,
      defaultRetention: config.defaultRetention || 365, // 1 year default
      defaultStrategy: config.defaultStrategy || 'soft'
    }
  }

  async enforceRetentionPolicies(): Promise<void> {
    try {
      for (const rule of this.config.rules) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - rule.retention)

        if (rule.anonymize) {
          await this.anonymizeData(rule.table, rule.field, cutoffDate)
        } else {
          await this.deleteData(rule.table, rule.field, cutoffDate, rule.deleteStrategy || this.config.defaultStrategy)
        }
      }

      await auditLogger.log({
        action: AuditActions.UPDATE,
        userId: 'system',
        resourceType: ResourceTypes.SETTINGS,
        resourceId: 'data-retention',
        details: { type: 'retention_policy_enforcement' }
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during retention policy enforcement')
      logger.error('Failed to enforce retention policies', { error: err })
      throw err
    }
  }

  async handleGDPRRequest(userId: string, requestType: 'export' | 'delete'): Promise<Record<string, any> | void> {
    try {
      const gdprSensitiveRules = this.config.rules.filter(rule => rule.gdprSensitive)

      if (requestType === 'export') {
        const userData: Record<string, any> = {}
        
        for (const rule of gdprSensitiveRules) {
          const data = await prisma.$queryRaw`
            SELECT * FROM "${rule.table}"
            WHERE user_id = ${userId}
          `
          userData[rule.table] = data
        }

        await auditLogger.log({
          action: AuditActions.EXPORT,
          userId,
          resourceType: ResourceTypes.USER,
          resourceId: userId,
          details: { type: 'gdpr_export' }
        })

        return userData
      } else {
        for (const rule of gdprSensitiveRules) {
          if (rule.anonymize) {
            await this.anonymizeUserData(rule.table, userId)
          } else {
            await this.deleteUserData(rule.table, userId)
          }
        }

        await auditLogger.log({
          action: AuditActions.DELETE,
          userId,
          resourceType: ResourceTypes.USER,
          resourceId: userId,
          details: { type: 'gdpr_deletion' }
        })
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during GDPR request handling')
      logger.error('Failed to handle GDPR request', { error: err, userId, requestType })
      throw err
    }
  }

  private async anonymizeData(table: string, field: string, cutoffDate: Date): Promise<void> {
    await prisma.$executeRawUnsafe(`
      UPDATE "${table}"
      SET "${field}" = 'REDACTED'
      WHERE "${field}" < $1
    `, cutoffDate)
  }

  private async deleteData(table: string, field: string, cutoffDate: Date, strategy: 'soft' | 'hard'): Promise<void> {
    if (strategy === 'soft') {
      await prisma.$executeRawUnsafe(`
        UPDATE "${table}"
        SET deleted_at = NOW()
        WHERE "${field}" < $1 AND deleted_at IS NULL
      `, cutoffDate)
    } else {
      await prisma.$executeRawUnsafe(`
        DELETE FROM "${table}"
        WHERE "${field}" < $1
      `, cutoffDate)
    }
  }

  private async anonymizeUserData(table: string, userId: string): Promise<void> {
    await prisma.$executeRawUnsafe(`
      UPDATE "${table}"
      SET email = 'REDACTED',
          name = 'REDACTED',
          phone = 'REDACTED',
          address = 'REDACTED'
      WHERE user_id = $1
    `, userId)
  }

  private async deleteUserData(table: string, userId: string): Promise<void> {
    await prisma.$executeRawUnsafe(`
      DELETE FROM "${table}"
      WHERE user_id = $1
    `, userId)
  }
}
