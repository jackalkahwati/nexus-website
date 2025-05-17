// Types for database operations
export interface UserMFAData {
  id: string
  mfaEnabled: boolean
}

export interface RecoveryCodesRecord {
  id: string
  userId: string
  codes: string[]
}

export interface DBOperationResult {
  success: boolean
  error?: string
}

export interface FindUserResult {
  user: UserMFAData | null
  error?: string
}

export interface GetCodesResult {
  codes: string[] | null
  error?: string
}
