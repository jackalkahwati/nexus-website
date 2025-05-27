// Core types for recovery codes data
export interface RecoveryCodesData {
  codes: string[]
}

// Types for database operations
export interface UserMFAStatus {
  id: string
  mfaEnabled: boolean
}

export interface StoredRecoveryCodes {
  codes: string[]
}

// API response types
export interface SuccessResponse {
  codes: string[]
}

export interface ErrorResponse {
  error: string
  status: number
}

export type APIResponse = SuccessResponse | ErrorResponse

// Service function signatures
export type GetCodesFunction = (userId: string, email: string) => Promise<string[]>
export type RegenerateCodesFunction = (userId: string, email: string) => Promise<string[]>

// Utility function signatures
export type GenerateCodesFunction = () => string[]
export type HashCodeFunction = (code: string) => string
export type VerifyCodeFunction = (code: string, hash: string) => boolean
