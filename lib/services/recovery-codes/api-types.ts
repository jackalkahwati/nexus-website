import { RecoveryCodesRecord } from './db-types'

// API Response Types
export interface APISuccessResponse {
  codes: string[]
  message?: string
}

export interface APIErrorResponse {
  error: string
  status: number
}

export type APIResponse = APISuccessResponse | APIErrorResponse

// API Request Types
export interface GetCodesRequest {
  userId: string
  email: string
}

export interface RegenerateCodesRequest {
  userId: string
  email: string
}

// API Handler Types
export type GetCodesHandler = (req: GetCodesRequest) => Promise<APIResponse>
export type RegenerateCodesHandler = (req: RegenerateCodesRequest) => Promise<APIResponse>

// API Error Types
export const enum APIErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  MFA_NOT_ENABLED = 'MFA_NOT_ENABLED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export const APIErrorStatus = {
  [APIErrorType.UNAUTHORIZED]: 401,
  [APIErrorType.USER_NOT_FOUND]: 404,
  [APIErrorType.MFA_NOT_ENABLED]: 400,
  [APIErrorType.INTERNAL_ERROR]: 500
} as const

// API Validation Types
export interface APIValidationResult {
  isValid: boolean
  error?: APIErrorResponse
}
