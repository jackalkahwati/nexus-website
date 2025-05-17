import { AuditActions, ResourceTypes } from '../lib/audit-logger'

// Extend AuditActions with backup-related actions
export const ExtendedAuditActions = {
  ...AuditActions,
  BACKUP_CREATE: 'backup.create',
  BACKUP_DELETE: 'backup.delete',
  BACKUP_RESTORE: 'backup.restore',
} as const

// Extend ResourceTypes with backup-related types
export const ExtendedResourceTypes = {
  ...ResourceTypes,
  BACKUP: 'backup',
} as const

export type ExtendedAuditAction = typeof ExtendedAuditActions[keyof typeof ExtendedAuditActions]
export type ExtendedResourceType = typeof ExtendedResourceTypes[keyof typeof ExtendedResourceTypes]
