"use client"

import { Switch } from "@/components/ui/switch"

interface NotificationPreferenceProps {
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  loading?: boolean
}

export function NotificationPreference({ title, description, enabled, onChange, loading }: NotificationPreferenceProps) {
  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={onChange} 
        disabled={loading}
      />
    </div>
  )
}
