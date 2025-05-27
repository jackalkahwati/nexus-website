"use client"

import { Bell, Settings, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/contexts/NotificationContext"
import { useEffect, useState, useCallback } from "react"
import { registerPushNotifications, unregisterPushNotifications } from "@/lib/pushNotifications"
import { useToast } from "@/hooks/use-toast"
import { NotificationList, PreferencesTab } from "@/components/notifications"

export default function NotificationsPage() {
  const { notifications, unreadCount, isConnected, isLoading } = useNotifications()
  const [pushEnabled, setPushEnabled] = useState(false)
  const [isPushLoading, setIsPushLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkPushStatus = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setPushEnabled(!!subscription)
      }
      setIsPushLoading(false)
    }

    checkPushStatus()
  }, [])

  const handlePushToggle = useCallback(async (enabled: boolean) => {
    try {
      setIsPushLoading(true)
      if (enabled) {
        const success = await registerPushNotifications()
        if (success) {
          setPushEnabled(true)
          toast({
            title: "Push Notifications Enabled",
            description: "You will now receive push notifications for important alerts.",
          })
        }
      } else {
        await unregisterPushNotifications()
        setPushEnabled(false)
        toast({
          title: "Push Notifications Disabled",
          description: "You will no longer receive push notifications.",
        })
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error)
      toast({
        title: "Error",
        description: "Failed to update push notification settings.",
        variant: "destructive",
      })
    } finally {
      setIsPushLoading(false)
    }
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
              <p className="text-muted-foreground">
                Connecting to notification service...
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-pulse flex flex-col items-center space-y-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">
              Manage your notifications and alert preferences
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-yellow-500'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
              {isConnected ? 'Connected' : 'Offline Mode'}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="all" className="h-full">
              <NotificationList 
                notifications={notifications} 
                unreadCount={unreadCount} 
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="unread" className="h-full">
              <NotificationList 
                notifications={notifications.filter(n => !n.read)} 
                unreadCount={unreadCount}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="alerts" className="h-full">
              <NotificationList 
                notifications={notifications.filter(n => n.type === 'alert')} 
                unreadCount={unreadCount}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="preferences" className="h-full">
              <PreferencesTab
                pushEnabled={pushEnabled}
                isPushLoading={isPushLoading}
                onPushToggle={handlePushToggle}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
