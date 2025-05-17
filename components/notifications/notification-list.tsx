"use client"

import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationItem } from "@/components/notifications/notification-item"
import type { Notification } from "@/contexts/NotificationContext"

interface NotificationListProps {
  notifications: Notification[]
  unreadCount: number
  className?: string
}

export function NotificationList({ notifications, unreadCount, className }: NotificationListProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notifications require attention` : 'All caught up!'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'alert' && !n.read).length} High
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-4">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              {...notification}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
