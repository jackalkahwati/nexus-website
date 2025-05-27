import { logger } from './logging/winston'
import { prisma } from './prisma'

export interface AuditLogEntry {
  action: AuditAction
  userId: string
  resourceType: ResourceType
  resourceId: string
  details?: Record<string, any>
  timestamp?: Date
}

// Main audit logging function
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // Create audit log entry in database
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        userId: entry.userId,
        resource: entry.resourceType, // Map resourceType to resource field
        resourceId: entry.resourceId,
        details: entry.details,
        // createdAt will be set automatically by Prisma's @default(now())
      },
    })

    // Also log to winston for system monitoring
    logger.info('Audit log entry created', {
      ...entry,
      type: 'AUDIT',
    })
  } catch (error) {
    logger.error('Failed to create audit log entry', {
      error,
      entry,
      type: 'AUDIT_ERROR',
    })
    throw error
  }
}

// Maintain backward compatibility
export const createAuditLog = auditLog

export const AuditActions = {
  // Basic actions
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPORT: 'export',
  IMPORT: 'import',
  SHARE: 'share',
  REVOKE: 'revoke',
  ERROR: 'error',
  // User actions
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  PROFILE_UPDATE: 'profile.update',
  ROLE_UPDATE: 'role.update',
  // API key actions
  API_KEY_CREATE: 'api_key.create',
  API_KEY_DELETE: 'api_key.delete',
  // Integration-specific actions
  'integration.create': 'integration.create',
  'integration.update': 'integration.update',
  'integration.delete': 'integration.delete',
  'integration.sync': 'integration.sync',
  'integration.test': 'integration.test',
  // Backup actions
  'backup.create': 'backup.create',
  'backup.delete': 'backup.delete',
  'backup.restore': 'backup.restore',
} as const

export type AuditAction = typeof AuditActions[keyof typeof AuditActions]

export const ResourceTypes = {
  USER: 'user',
  FILE: 'file',
  PAYMENT: 'payment',
  SUBSCRIPTION: 'subscription',
  SETTINGS: 'settings',
  INTEGRATION: 'integration',
  API_KEY: 'api_key',
  ROLE: 'role',
  PROFILE: 'profile',
  SECRET: 'secret',
  BACKUP: 'backup',
} as const

export type ResourceType = typeof ResourceTypes[keyof typeof ResourceTypes]

// Export the audit logger instance with all utilities
export const auditLogger = {
  log: auditLog,
  create: createAuditLog, // Alias for backward compatibility
  actions: AuditActions,
  resourceTypes: ResourceTypes
}

// Export default for convenience
export default auditLogger
