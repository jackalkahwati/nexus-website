import { LRUCache } from 'lru-cache'
import { NextRequest } from 'next/server'

export interface RateLimitConfig {
  interval: number
  uniqueTokenPerInterval: number
  maxRequests: number
}

export class RateLimiter {
  private cache: LRUCache<string, number>
  private interval: number
  private maxRequests: number

  constructor(config: RateLimitConfig) {
    this.interval = config.interval
    this.maxRequests = config.maxRequests
    this.cache = new LRUCache({
      max: config.uniqueTokenPerInterval || 500,
      ttl: config.interval,
    })
  }

  public async check(request: NextRequest): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }> {
    const ip = request.ip || 'anonymous'
    const tokenCount = (this.cache.get(ip) || 0) + 1

    const now = Date.now()
    const reset = Math.ceil((now + this.interval) / 1000)

    if (tokenCount > this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      }
    }

    this.cache.set(ip, tokenCount)

    return {
      success: true,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - tokenCount),
      reset,
    }
  }
}

// Export factory function for creating rate limiters with different configs
export function createRateLimiter(config: RateLimitConfig) {
  return new RateLimiter(config)
}

// Common rate limit configurations
export const RateLimits = {
  DEFAULT: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
    maxRequests: 60,
  },
  STRICT: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
    maxRequests: 30,
  },
  LENIENT: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
    maxRequests: 120,
  },
} as const
