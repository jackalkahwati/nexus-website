export const SOC2Actions = {
  // Authentication
  LOGIN: 'auth.login' as const,
  LOGOUT: 'auth.logout' as const,
  PASSWORD_CHANGE: 'auth.password.change' as const,
  PASSWORD_RESET: 'auth.password.reset' as const,

  // MFA
  MFA_SETUP: 'auth.mfa.setup' as const,
  MFA_DISABLE: 'auth.mfa.disable' as const,
  MFA_VERIFY: 'auth.mfa.verify' as const,
  MFA_RECOVERY_CODE_USE: 'auth.mfa.recovery.use' as const,
  MFA_RECOVERY_CODE_GENERATE: 'auth.mfa.recovery.generate' as const,
  MFA_RECOVERY_CODE_REGENERATE: 'auth.mfa.recovery.regenerate' as const,
  MFA_RECOVERY_CODE_ACCESS: 'auth.mfa.recovery.access' as const,

  // User Management
  USER_CREATE: 'user.create' as const,
  USER_UPDATE: 'user.update' as const,
  USER_DELETE: 'user.delete' as const,
  USER_LOCK: 'user.lock' as const,
  USER_UNLOCK: 'user.unlock' as const,

  // Role Management
  ROLE_CREATE: 'role.create' as const,
  ROLE_UPDATE: 'role.update' as const,
  ROLE_DELETE: 'role.delete' as const,

  // Data Access
  DATA_READ: 'data.read' as const,
  DATA_ACCESS: 'data.access' as const,
  DATA_MODIFY: 'data.modify' as const,
  DATA_DELETE: 'data.delete' as const,

  // System
  SYSTEM_CONFIG: 'system.config' as const,
  MAINTENANCE_START: 'system.maintenance.start' as const,
  MAINTENANCE_END: 'system.maintenance.end' as const,
} as const

export type SOC2Action = typeof SOC2Actions[keyof typeof SOC2Actions]

export const SOC2ResourceTypes = {
  USER: 'user' as const,
  ROLE: 'role' as const,
  PERMISSION: 'permission' as const,
  SESSION: 'session' as const,
  DATA: 'data' as const,
  SYSTEM: 'system' as const,
  MFA: 'mfa' as const,
  RECOVERY_CODE: 'recovery_code' as const,
} as const

export type SOC2ResourceType = typeof SOC2ResourceTypes[keyof typeof SOC2ResourceTypes]

export type SOC2Status = 'success' | 'failure'

export interface SOC2AuditDetails {
  userId?: string
  resourceId?: string
  error?: string
  [key: string]: any
}

export interface SOC2AuditLog {
  action: SOC2Action
  status: SOC2Status
  resourceType: SOC2ResourceType
  details?: SOC2AuditDetails
}
