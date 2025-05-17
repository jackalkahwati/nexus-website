"use client"

import { Clock, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/NotificationContext"
import { useCallback } from "react"

interface NotificationItemProps {
  id: string
  title: string
  description: string
  time: string
  type: "alert" | "info" | "success" | "warning"
  read: boolean
}

export function NotificationItem({ id, title, description, time, type, read }: NotificationItemProps) {
  const { markAsRead, markAsUnread, deleteNotification, snoozeNotification } = useNotifications()

  const handleMarkReadUnread = useCallback(() => {
    if (read) {
      markAsUnread(id)
    } else {
      markAsRead(id)
    }
  }, [id, read, markAsRead, markAsUnread])

  const handleSnooze = useCallback(() => {
    snoozeNotification(id)
  }, [id, snoozeNotification])

  const handleDelete = useCallback(() => {
    deleteNotification(id)
  }, [id, deleteNotification])

  return (
    <div className={`p-4 border rounded-lg mb-2 ${read ? 'bg-background' : 'bg-muted'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div>
            <h4 className="text-sm font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(time).toLocaleString()}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMarkReadUnread}>
              Mark as {read ? 'unread' : 'read'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSnooze}>
              Snooze
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
