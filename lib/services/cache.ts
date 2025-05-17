import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

export interface CacheOptions {
  ttl?: number
  namespace?: string
}

interface CacheItem<T = any> {
  value: T
  expires?: number
}

export interface CacheProvider {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>
  delete(key: string): Promise<void>
  clear(namespace?: string): Promise<void>
}

class MemoryCache implements CacheProvider {
  private cache: Map<string, CacheItem> = new Map()
  private namespaces: Map<string, Set<string>> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor(cleanupIntervalMs = 60000) {
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs)
  }

  private cleanup() {
    const now = Date.now()
    Array.from(this.cache.entries()).forEach(([key, item]) => {
      if (item.expires && item.expires <= now) {
        this.cache.delete(key)
        Array.from(this.namespaces.values()).forEach(namespace => {
          namespace.delete(key)
        })
      }
    })
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)
    if (!item) return null
    if (item.expires && item.expires <= Date.now()) {
      this.delete(key)
      return null
    }
    return item.value as T
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const item: CacheItem<T> = {
      value,
      expires: options.ttl ? Date.now() + options.ttl : undefined
    }
    
    this.cache.set(key, item)
    
    if (options.namespace) {
      if (!this.namespaces.has(options.namespace)) {
        this.namespaces.set(options.namespace, new Set())
      }
      this.namespaces.get(options.namespace)?.add(key)
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
    Array.from(this.namespaces.values()).forEach(namespace => {
      namespace.delete(key)
    })
  }

  async clear(namespace?: string): Promise<void> {
    if (namespace) {
      const keys = this.namespaces.get(namespace)
      if (keys) {
        Array.from(keys).forEach(key => {
          this.cache.delete(key)
        })
        this.namespaces.delete(namespace)
      }
    } else {
      this.cache.clear()
      this.namespaces.clear()
    }
  }
}

class RedisCache implements CacheProvider {
  constructor(private redis: Redis) {}

  private getKey(key: string, namespace?: string): string {
    if (namespace) {
      return `${namespace}:${key}`
    }
    return key
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    return value as T | null
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const fullKey = this.getKey(key, options.namespace)
    if (options.ttl) {
      await this.redis.set(fullKey, value, { ex: Math.floor(options.ttl / 1000) })
    } else {
      await this.redis.set(fullKey, value)
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async clear(namespace?: string): Promise<void> {
    if (namespace) {
      const pattern = `${namespace}:*`
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    }
  }
}

class CacheManager {
  private providers: Map<string, CacheProvider> = new Map()
  private defaultProvider: string = 'memory'

  constructor() {
    this.providers.set('memory', new MemoryCache())
  }

  addProvider(name: string, provider: CacheProvider): void {
    this.providers.set(name, provider)
  }

  setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not found`)
    }
    this.defaultProvider = name
  }

  getProvider(name?: string): CacheProvider {
    const providerName = name || this.defaultProvider
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }
    return provider
  }
}

export const cacheManager = new CacheManager()

// Initialize Redis provider if REDIS_URL is available
if (process.env.REDIS_URL) {
  const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN || ''
  })
  cacheManager.addProvider('redis', new RedisCache(redis))
  // Set Redis as default if available
  cacheManager.setDefaultProvider('redis')
} 