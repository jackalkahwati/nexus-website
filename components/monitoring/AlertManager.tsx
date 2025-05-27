"use client"

import { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Bell, BellOff, CheckCircle, XCircle, Settings } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { LogStats } from '../../lib/logger'
import { alertNotificationService, AlertConfig } from '../../lib/services/alert-notifications'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

interface AlertState {
  id: string
  type: string
  title: string
  message: string
  severity: 'critical' | 'warning'
  timestamp: Date
}

interface AlertSettingsProps {
  config: AlertConfig
  onSave: (config: AlertConfig) => void
}

function AlertSettings({ config, onSave }: AlertSettingsProps) {
  const [localConfig, setLocalConfig] = useState<AlertConfig>(config)

  const handleSave = () => {
    onSave(localConfig)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={localConfig.emailNotifications}
            onCheckedChange={(checked) =>
              setLocalConfig((prev) => ({ ...prev, emailNotifications: checked }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Critical Thresholds</Label>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="disk-usage">Disk Usage (%)</Label>
            <Input
              id="disk-usage"
              type="number"
              min="0"
              max="100"
              value={localConfig.criticalThresholds.diskUsage}
              onChange={(e) =>
                setLocalConfig((prev) => ({
                  ...prev,
                  criticalThresholds: {
                    ...prev.criticalThresholds,
                    diskUsage: Number(e.target.value)
                  }
                }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="file-count">Max Files</Label>
            <Input
              id="file-count"
              type="number"
              min="0"
              value={localConfig.criticalThresholds.fileCount}
              onChange={(e) =>
                setLocalConfig((prev) => ({
                  ...prev,
                  criticalThresholds: {
                    ...prev.criticalThresholds,
                    fileCount: Number(e.target.value)
                  }
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email Recipients</Label>
        <Input
          value={localConfig.emailRecipients.join(', ')}
          onChange={(e) =>
            setLocalConfig((prev) => ({
              ...prev,
              emailRecipients: e.target.value.split(',').map((email) => email.trim())
            }))
          }
          placeholder="email1@example.com, email2@example.com"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Save Settings
      </button>
    </div>
  )
}

export function AlertManager({ stats }: { stats: LogStats | null }) {
  const [alerts, setAlerts] = useState<AlertState[]>([])
  const [isEnabled, setIsEnabled] = useState(true)
  const { toast } = useToast()
  const [config, setConfig] = useState<AlertConfig>(
    alertNotificationService.getConfig()
  )

  useEffect(() => {
    if (!isEnabled || !stats) return

    const checkAlerts = async () => {
      const criticalAlerts = await alertNotificationService.checkAndNotify(stats)
      
      setAlerts(criticalAlerts.map(alert => ({
        id: `${alert.type}-${Date.now()}`,
        ...alert,
        timestamp: new Date()
      })))

      // Show toast for new critical alerts
      criticalAlerts.forEach(alert => {
        if (alert.severity === 'critical') {
          toast({
            title: alert.title,
            description: alert.message,
            variant: 'destructive'
          })
        }
      })
    }

    checkAlerts()
  }, [stats, isEnabled, toast])

  const handleConfigSave = (newConfig: AlertConfig) => {
    alertNotificationService.setConfig(newConfig)
    setConfig(newConfig)
    toast({
      title: 'Settings Saved',
      description: 'Alert settings have been updated'
    })
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const toggleAlerts = () => {
    setIsEnabled(!isEnabled)
    if (!isEnabled) {
      toast({
        title: 'Alerts Enabled',
        description: 'You will now receive log monitoring alerts'
      })
    } else {
      toast({
        title: 'Alerts Disabled',
        description: 'Log monitoring alerts have been disabled'
      })
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                title="Alert Settings"
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alert Settings</DialogTitle>
              </DialogHeader>
              <AlertSettings config={config} onSave={handleConfigSave} />
            </DialogContent>
          </Dialog>
          <button
            onClick={clearAlerts}
            className="p-1 hover:bg-gray-100 rounded"
            title="Clear all alerts"
          >
            <CheckCircle className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={toggleAlerts}
            className="p-1 hover:bg-gray-100 rounded"
            title={isEnabled ? 'Disable alerts' : 'Enable alerts'}
          >
            {isEnabled ? (
              <Bell className="w-5 h-5 text-blue-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">
          No active alerts
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              variant={alert.severity === 'critical' ? 'destructive' : 'default'}
            >
              <AlertTitle className="flex items-center gap-2">
                {alert.severity === 'critical' ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {alert.title}
              </AlertTitle>
              <AlertDescription>
                {alert.message}
                <div className="text-xs text-gray-500 mt-1">
                  {alert.timestamp.toLocaleString()}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {isEnabled && (
        <div className="text-xs text-gray-500">
          Monitoring active • Last check: {new Date().toLocaleString()}
        </div>
      )}
    </Card>
  )
}
