import { useState, useCallback } from 'react'
import { cacheManager, CacheOptions } from '@/lib/services/cache'

interface UseCacheOptions<T> extends CacheOptions {
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
  provider?: string
}

export function useCache<T>(key: string, options: UseCacheOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const provider = cacheManager.getProvider(options.provider)

  const get = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await provider.get<T>(key)
      setData(result)
      options.onSuccess?.(result as T)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get cached data')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [key, provider, options])

  const set = useCallback(async (value: T) => {
    try {
      setIsLoading(true)
      await provider.set(key, value, {
        ttl: options.ttl,
        namespace: options.namespace
      })
      setData(value)
      options.onSuccess?.(value)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to set cached data')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [key, provider, options])

  const remove = useCallback(async () => {
    try {
      setIsLoading(true)
      await provider.delete(key)
      setData(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove cached data')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [key, provider, options])

  const clear = useCallback(async () => {
    try {
      setIsLoading(true)
      await provider.clear(options.namespace)
      setData(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear cache')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [provider, options])

  return {
    data,
    error,
    isLoading,
    get,
    set,
    remove,
    clear
  }
} 