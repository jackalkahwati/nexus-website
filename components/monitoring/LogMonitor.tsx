"use client"

import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { LogStats } from '../../lib/logger'
import { formatBytes, formatDate } from '../../lib/utils'
import { AlertManager } from './AlertManager'

interface LogFile {
  name: string
  size: number
  modified: Date
}

export function LogMonitor() {
  const [stats, setStats] = useState<LogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/monitoring/logs')
      if (!response.ok) {
        throw new Error('Failed to fetch log statistics')
      }
      const newStats = await response.json()
      setStats(newStats)
      setError(null)
    } catch (err) {
      setError('Failed to fetch log statistics')
      console.error('Log monitor error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh stats every 30 seconds
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRotateNow = async () => {
    try {
      const response = await fetch('/api/monitoring/logs', {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to rotate logs')
      }
      const newStats = await response.json()
      setStats(newStats)
      setError(null)
    } catch (err) {
      setError('Failed to rotate logs')
      console.error('Log rotation error:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <AlertManager stats={null} />
        <Card className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <AlertManager stats={null} />
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-red-700">{error}</div>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <AlertManager stats={null} />
        <Card className="p-4">
          <div className="text-gray-500">No log data available</div>
        </Card>
      </div>
    )
  }

  // Calculate disk usage (assuming 1GB max)
  const maxSize = 1024 * 1024 * 1024 // 1GB
  const usagePercent = (stats.totalSize / maxSize) * 100

  // Determine progress bar color based on usage
  const progressClass = usagePercent > 90 
    ? 'bg-red-500' 
    : usagePercent > 70 
    ? 'bg-yellow-500' 
    : 'bg-blue-500'

  return (
    <div className="space-y-4">
      <AlertManager stats={stats} />
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Log Files</h3>
          <button
            onClick={handleRotateNow}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Rotate Now
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Disk Usage</span>
            <span>{formatBytes(stats.totalSize)} / {formatBytes(maxSize)}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressClass} transition-all duration-500`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Files ({stats.fileCount})</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {stats.files.map((file: LogFile) => (
              <div
                key={file.name}
                className="text-sm flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(file.modified)}
                  </span>
                </div>
                <span className="text-gray-500 ml-4 whitespace-nowrap">
                  {formatBytes(file.size)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>Auto-refreshes every 30 seconds</span>
          <span>Last updated: {formatDate(new Date())}</span>
        </div>
      </Card>
    </div>
  )
}
