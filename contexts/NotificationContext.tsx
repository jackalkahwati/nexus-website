"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from 'next/navigation'

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: "alert" | "info" | "success" | "warning"
  read: boolean
  duration?: number // Optional duration in milliseconds
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAsUnread: (id: string) => void
  deleteNotification: (id: string) => void
  snoozeNotification: (id: string) => void
  isConnected: boolean
  isLoading: boolean
  showToasts: boolean
  setShowToasts: (show: boolean) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = ['/demo', '/login', '/signup', '/'].includes(pathname)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showToasts, setShowToasts] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  const handleNotification = useCallback((data: any) => {
    if (data.type === 'connection') {
      setIsConnected(data.status === 'connected')
      setIsLoading(false)
      return
    }

    setNotifications(prev => {
      // Avoid duplicate notifications
      if (prev.some(n => n.id === data.id)) {
        return prev
      }
      return [data, ...prev]
    })

    if (showToasts) {
      toast({
        title: data.title,
        description: data.description,
        variant: data.type === 'alert' ? 'destructive' : 'default',
      })
    }
  }, [toast, showToasts])

  useEffect(() => {
    // Skip SSE connection on public pages and if notification stream is disabled
    if (isPublicPage) {
      setIsLoading(false)
      return
    }

    // Check if SSE is enabled - feature flag to prevent connection attempts when we know the endpoint is disabled
    const SSE_DISABLED = true // Set to true because the API endpoint is disabled (see route.ts)
    
    if (SSE_DISABLED) {
      // Skip connection attempt but set state as if we tried
      setIsLoading(false)
      setIsConnected(false)
      console.warn('SSE notifications are currently disabled')
      return
    }

    let eventSource: EventSource | undefined
    const MAX_RETRIES = 3
    const INITIAL_RETRY_DELAY = 1000
    let retryDelay = INITIAL_RETRY_DELAY
    let retryTimeout: NodeJS.Timeout

    const connectSSE = () => {
      if (retryCount >= MAX_RETRIES) {
        console.log('Max retry attempts reached')
        setIsLoading(false)
        setIsConnected(false)
        return
      }

      try {
        console.log('Connecting to SSE...')
        setIsLoading(true)
        
        if (eventSource) {
          eventSource.close()
        }

        eventSource = new EventSource('/api/notifications/stream')

        eventSource.onopen = () => {
          console.log('SSE Connected')
          setIsConnected(true)
          setIsLoading(false)
          setRetryCount(0)
          retryDelay = INITIAL_RETRY_DELAY
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            handleNotification(data)
          } catch (error) {
            console.error('Error processing notification:', error)
          }
        }

        eventSource.onerror = (error) => {
          console.error('SSE Error:', error)
          eventSource?.close()
          setIsConnected(false)
          setIsLoading(false)

          // Only retry if we haven't reached max retries
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1)
            retryTimeout = setTimeout(() => {
              connectSSE()
              retryDelay *= 2 // Exponential backoff
            }, retryDelay)
          }
        }
      } catch (error) {
        console.error('Error creating SSE connection:', error)
        setIsConnected(false)
        setIsLoading(false)
        
        // Only retry if we haven't reached max retries
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1)
          retryTimeout = setTimeout(() => {
            connectSSE()
            retryDelay *= 2 // Exponential backoff
          }, retryDelay)
        }
      }
    }

    // Only attempt connection if SSE is enabled
    if (!SSE_DISABLED) {
      connectSSE()
    }

    return () => {
      if (eventSource) {
        console.log('Closing SSE connection')
        eventSource.close()
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [handleNotification, retryCount, isPublicPage])

  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAsUnread = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: false }
          : notification
      )
    )
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    )
  }, [])

  const snoozeNotification = useCallback((id: string) => {
    deleteNotification(id)
  }, [deleteNotification])

  const addNotification = (notification: Notification) => {
    const id = notification.id || Date.now().toString()
    const newNotification = { ...notification, id }
    setNotifications(prev => [...prev, newNotification])

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        deleteNotification,
        snoozeNotification,
        isConnected,
        isLoading,
        showToasts,
        setShowToasts,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
