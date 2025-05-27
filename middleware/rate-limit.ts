import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/config/env'

type RateLimitConfig = {
  requests: number
  duration: number // in seconds
}

type RegionRatelimit = {
  [region: string]: RateLimitConfig
}

const rateLimits = {
  api: {
    default: { requests: 100, duration: 60 },
    premium: { requests: 1000, duration: 60 },
  },
  auth: {
    login: { requests: 5, duration: 60 },
    register: { requests: 3, duration: 60 },
    passwordReset: { requests: 3, duration: 60 },
  },
  user: {
    profile: { requests: 10, duration: 60 },
    settings: { requests: 10, duration: 60 },
  },
  files: {
    upload: { requests: 10, duration: 60 },
    download: { requests: 50, duration: 60 },
  },
  search: {
    query: { requests: 20, duration: 60 },
  },
  webhook: {
    incoming: { requests: 100, duration: 60 },
  },
} as const

const redis = new Redis({
  url: env.redis.url,
  token: env.redis.token,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1m'),
})

export async function rateLimitMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  const ip = request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1'
  const path = request.nextUrl.pathname
  const limitKey = `${ip}:${path}`

  const { success, limit, remaining, reset } = await ratelimit.limit(limitKey)

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    )
  }

  const response = await next()
  
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())

  return response
}

export function getRateLimitConfig(path: string): RateLimitConfig {
  const segments = path.split('/').filter(Boolean)
  const category = segments[0] as keyof typeof rateLimits
  const action = segments[1] as keyof (typeof rateLimits)[typeof category]

  if (category && action && category in rateLimits && action in rateLimits[category]) {
    return rateLimits[category][action]
  }

  return rateLimits.api.default
}

export const rateLimiters = new Map<string, Ratelimit>()

Object.entries(rateLimits).forEach(([category, actions]) => {
  Object.entries(actions).forEach(([action, config]) => {
    const key = `${category}:${action}`
    rateLimiters.set(key, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, `${config.duration}s`),
    }))
  })
})