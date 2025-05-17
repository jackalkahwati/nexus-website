export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxAge: number // in days
  preventReuse: number // number of previous passwords to check
}

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

export interface PasswordHistory {
  id: string
  userId: string
  hash: string
  createdAt: Date
}

// Extend the User type to include password-related fields
declare global {
  namespace PrismaClient {
    interface User {
      passwordUpdatedAt: Date
      passwordHistory: PasswordHistory[]
    }
  }
}

export interface PasswordUpdateResult {
  success: boolean
  message?: string
  error?: string
}

export interface PasswordServiceConfig {
  saltRounds: number
  defaultMaxAge: number
  defaultPreventReuse: number
}
