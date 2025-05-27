"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationPreference } from "@/components/notifications/notification-preference"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PreferencesTabProps {
  pushEnabled: boolean
  isPushLoading: boolean
  onPushToggle: (enabled: boolean) => void
}

export function PreferencesTab({ pushEnabled, isPushLoading, onPushToggle }: PreferencesTabProps) {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationPreference
                title="Critical Alerts"
                description="Battery levels, maintenance alerts, and safety warnings"
                enabled={true}
                onChange={() => {}}
              />
              <NotificationPreference
                title="Performance Updates"
                description="Route optimization and efficiency reports"
                enabled={true}
                onChange={() => {}}
              />
              <NotificationPreference
                title="System Updates"
                description="New features and platform updates"
                enabled={false}
                onChange={() => {}}
              />
              <NotificationPreference
                title="Analytics Reports"
                description="Weekly and monthly performance summaries"
                enabled={true}
                onChange={() => {}}
              />
              <NotificationPreference
                title="Team Activity"
                description="Updates about team members and collaboration"
                enabled={false}
                onChange={() => {}}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Channel Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive different types of notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationPreference
                title="Email Notifications"
                description="Receive notifications via email"
                enabled={true}
                onChange={() => {}}
              />
              <NotificationPreference
                title="Push Notifications"
                description="Browser and mobile push notifications"
                enabled={pushEnabled}
                onChange={onPushToggle}
                loading={isPushLoading}
              />
              <NotificationPreference
                title="SMS Alerts"
                description="Receive critical alerts via SMS"
                enabled={false}
                onChange={() => {}}
              />
              <NotificationPreference
                title="In-App Notifications"
                description="Notifications within the dashboard"
                enabled={true}
                onChange={() => {}}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
