import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { compress } from 'lib/utils/compression'

// Initialize Redis client for caching
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: '', // No token needed for local Redis
})

// Cache configuration for different content types
const cacheConfig = {
  // Static assets
  assets: {
    ttl: 7 * 24 * 60 * 60, // 7 days
    revalidate: false,
  },
  // API responses
  api: {
    ttl: 5 * 60, // 5 minutes
    revalidate: true,
  },
  // Images
  images: {
    ttl: 24 * 60 * 60, // 1 day
    revalidate: true,
  },
  // Public data
  public: {
    ttl: 60 * 60, // 1 hour
    revalidate: true,
  },
}

// Helper to determine if request should be cached
function shouldCache(request: NextRequest): boolean {
  // Only cache GET requests
  if (request.method !== 'GET') return false

  const path = request.nextUrl.pathname

  // Don't cache auth-related paths
  if (path.includes('/api/auth')) return false

  // Don't cache user-specific data
  if (path.includes('/api/users')) return false

  // Don't cache private data
  if (request.headers.get('authorization')) return false

  return true
}

// Helper to get cache key
function getCacheKey(request: NextRequest): string {
  const url = new URL(request.url)
  return `cache:${url.pathname}${url.search}`
}

// Helper to get cache config
function getCacheConfig(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.match(/\.(js|css|svg|woff2?)$/)) {
    return cacheConfig.assets
  }

  if (path.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cacheConfig.images
  }

  if (path.startsWith('/api/')) {
    return cacheConfig.api
  }

  return cacheConfig.public
}

// Helper to determine if response should be compressed
function shouldCompress(request: NextRequest, response: NextResponse): boolean {
  const contentType = response.headers.get('content-type')
  if (!contentType) return false

  // Only compress text-based content
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
    'application/x-www-form-urlencoded',
  ]

  return compressibleTypes.some(type => contentType.includes(type))
}

export async function performanceMiddleware(
  request: NextRequest,
  response?: NextResponse
) {
  const res = response || NextResponse.next()

  try {
    // Add performance-related headers
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('X-DNS-Prefetch-Control', 'on')

    // Handle caching
    if (shouldCache(request)) {
      const cacheKey = getCacheKey(request)
      const config = getCacheConfig(request)

      // Try to get from cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        const { headers, body, status } = JSON.parse(cached as string)
        const cachedResponse = new NextResponse(body, { status })
        
        // Restore headers
        Object.entries(headers).forEach(([key, value]) => {
          cachedResponse.headers.set(key, value as string)
        })

        return cachedResponse
      }

      // Cache the response
      const responseData = {
        headers: Object.fromEntries(res.headers.entries()),
        body: await res.clone().text(),
        status: res.status,
      }

      await redis.set(cacheKey, JSON.stringify(responseData), {
        ex: config.ttl,
      })

      // Add cache control headers
      if (config.revalidate) {
        res.headers.set(
          'Cache-Control',
          `public, s-maxage=${config.ttl}, stale-while-revalidate`
        )
      } else {
        res.headers.set(
          'Cache-Control',
          `public, max-age=${config.ttl}, immutable`
        )
      }
    } else {
      // No caching for dynamic content
      res.headers.set('Cache-Control', 'no-store, must-revalidate')
    }

    // Handle compression
    if (shouldCompress(request, res)) {
      const acceptEncoding = request.headers.get('accept-encoding') || ''
      const body = await res.clone().text()

      if (acceptEncoding.includes('br')) {
        const compressed = await compress(body, 'br')
        res.headers.set('Content-Encoding', 'br')
        return new NextResponse(compressed, {
          status: res.status,
          headers: res.headers,
        })
      }

      if (acceptEncoding.includes('gzip')) {
        const compressed = await compress(body, 'gzip')
        res.headers.set('Content-Encoding', 'gzip')
        return new NextResponse(compressed, {
          status: res.status,
          headers: res.headers,
        })
      }
    }

    return res
  } catch (error) {
    console.error('Performance middleware error:', error)
    return res
  }
}

// Export middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
