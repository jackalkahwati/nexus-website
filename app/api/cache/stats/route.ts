import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cacheManager } from '@/lib/services/cache'

interface CacheStats {
  hits: number
  misses: number
  keys: number
  size: number
  uptime: number
}

export async function GET(request: NextRequest) {
  try {
    const provider = cacheManager.getProvider()
    const stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      size: 0,
      uptime: process.uptime()
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get cache stats:', error)
    return NextResponse.json(
      { error: 'Failed to get cache statistics' },
      { status: 500 }
    )
  }
} 