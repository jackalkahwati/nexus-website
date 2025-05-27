export interface RateLimitConfig {
  interval: number
  requests: number
  blockDuration?: number
  customKey?: string
  uniqueTokenPerInterval?: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  limit: number
}

export interface RateLimitStats {
  total: number
  blocked: number
}
