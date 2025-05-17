'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useCache } from '@/hooks/use-cache'

interface CacheStats {
  provider: string
  size: number
  hits: number
  misses: number
}

export function CacheMonitor() {
  const { toast } = useToast()
  const [stats, setStats] = useState<CacheStats>({
    provider: 'unknown',
    size: 0,
    hits: 0,
    misses: 0
  })

  const { data, error, isLoading, clear } = useCache<CacheStats>('cache:stats', {
    ttl: 5000, // Refresh every 5 seconds
    onError: (error) => {
      toast({
        title: 'Cache Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  useEffect(() => {
    if (data) {
      setStats(data)
    }
  }, [data])

  const handleClearCache = async () => {
    try {
      await clear()
      toast({
        title: 'Cache Cleared',
        description: 'The cache has been successfully cleared.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cache',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200">
        <div className="text-red-500">Failed to load cache statistics</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Cache Monitor</h3>
          <Button
            variant="outline"
            onClick={handleClearCache}
            className="text-sm"
          >
            Clear Cache
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Provider</p>
            <p className="text-2xl font-bold">{stats.provider}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Size</p>
            <p className="text-2xl font-bold">{stats.size}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Hit Rate</p>
            <p className="text-2xl font-bold">
              {stats.hits + stats.misses > 0
                ? Math.round((stats.hits / (stats.hits + stats.misses)) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Miss Rate</p>
            <p className="text-2xl font-bold">
              {stats.hits + stats.misses > 0
                ? Math.round((stats.misses / (stats.hits + stats.misses)) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
} 