import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { rateLimiters } from '@/middleware/rate-limit'

interface RateLimitStats {
  category: string
  action: string
  remaining: number
  limit: number
  reset: string
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const stats: RateLimitStats[] = []

  // Get stats for each rate limiter
  for (const [key, limiter] of rateLimiters.entries()) {
    const [category, action] = key.split(':')
    const { remaining, limit, reset } = await limiter.limit(key)

    stats.push({
      category,
      action,
      remaining,
      limit,
      reset: new Date(reset).toISOString(),
    })
  }

  return NextResponse.json(stats)
} 