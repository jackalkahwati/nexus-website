"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { cn } from "@/lib/cn"
import { Skeleton } from "components/ui/skeleton"

interface FleetStatus {
  active: number
  parked: number
  maintenance: number
  activeChange: number
  parkedChange: number
  maintenanceChange: number
}

interface FleetStatusWidgetProps {
  className?: string
}

const FleetStatusWidget = ({ className }: FleetStatusWidgetProps) => {
  const [status, setStatus] = useState<FleetStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/fleet/status')
        if (!response.ok) throw new Error('Failed to fetch fleet status')
        const data = await response.json()
        setStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status')
        // Fallback data for development
        setStatus({
          active: 18,
          parked: 4,
          maintenance: 2,
          activeChange: 2,
          parkedChange: -1,
          maintenanceChange: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Refresh every minute
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !status) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Failed to load fleet status
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-2xl font-bold">{status.active}</p>
              <p className="text-xs text-muted-foreground">
                {status.activeChange > 0 ? '+' : ''}{status.activeChange} from last hour
              </p>
            </div>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Parked</p>
              <p className="text-2xl font-bold">{status.parked}</p>
              <p className="text-xs text-muted-foreground">
                {status.parkedChange > 0 ? '+' : ''}{status.parkedChange} from last hour
              </p>
            </div>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Maintenance</p>
              <p className="text-2xl font-bold">{status.maintenance}</p>
              <p className="text-xs text-muted-foreground">
                {status.maintenanceChange > 0 ? '+' : ''}{status.maintenanceChange} from last hour
              </p>
            </div>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FleetStatusWidget
