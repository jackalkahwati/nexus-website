import { Redis } from '@upstash/redis'

// Check for required environment variables
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis environment variables are not set')
}

// Convert Redis URL to HTTPS if needed
const convertToHttps = (url: string): string => {
  if (url.startsWith('https://')) return url
  if (url.startsWith('redis://')) {
    return url.replace('redis://', 'https://')
  }
  // If no protocol, assume HTTPS
  return `https://${url}`
}

// Get and validate Redis URL
const redisUrl = convertToHttps(process.env.UPSTASH_REDIS_REST_URL)

// Initialize Redis client with retry logic
export const redis = new Redis({
  url: redisUrl,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000)
  }
})

// Helper functions for caching
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data as string) : null
  } catch (error) {
    console.error('Redis cache get error:', error)
    return null
  }
}

export const cacheSet = async (key: string, value: any, ttl?: number): Promise<void> => {
  try {
    const options = ttl ? { ex: ttl } : undefined
    await redis.set(key, JSON.stringify(value), options)
  } catch (error) {
    console.error('Redis cache set error:', error)
  }
}

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis cache delete error:', error)
  }
}

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await Promise.all(keys.map(key => redis.del(key)))
    }
  } catch (error) {
    console.error('Redis cache delete pattern error:', error)
  }
}

// Health check function
export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis connection check failed:', error)
    return false
  }
}
