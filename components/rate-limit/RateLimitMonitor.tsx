"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface RateLimitStats {
  type: string
  total: number
  blocked: number
  success: number
  remaining: number
  resetAt: string
}

export function RateLimitMonitor() {
  const { toast } = useToast()
  const [stats, setStats] = useState<RateLimitStats[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rate-limit/stats')
      if (!response.ok) throw new Error('Failed to fetch rate limit stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch rate limit statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchStats()
  }

  if (loading) {
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Rate Limit Monitor</h3>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="text-sm"
          >
            Refresh
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Blocked</TableHead>
              <TableHead className="text-right">Success</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="text-right">Reset At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.type}>
                <TableCell className="font-medium">{stat.type}</TableCell>
                <TableCell className="text-right">{stat.total}</TableCell>
                <TableCell className="text-right text-red-500">
                  {stat.blocked}
                </TableCell>
                <TableCell className="text-right text-green-500">
                  {stat.success}
                </TableCell>
                <TableCell className="text-right">{stat.remaining}</TableCell>
                <TableCell className="text-right">
                  {new Date(stat.resetAt).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
} 