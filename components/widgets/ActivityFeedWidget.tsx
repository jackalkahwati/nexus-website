"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { cn } from "@/lib/cn"
import { Skeleton } from "components/ui/skeleton"
import { AlertCircle, CheckCircle2, Wrench, Truck } from "lucide-react"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

interface ActivityFeedWidgetProps {
  className?: string
}

const ActivityFeedWidget = ({ className }: ActivityFeedWidgetProps) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activity')
        if (!response.ok) throw new Error('Failed to fetch activities')
        const data = await response.json()
        setActivities(data.activities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
    // Refresh every minute
    const interval = setInterval(fetchActivities, 60000)
    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string, status: string) => {
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-500" />
    if (type === 'maintenance') return <Wrench className="w-4 h-4 text-blue-500" />
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />
    return <Truck className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !activities.length) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="mt-1">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityFeedWidget
