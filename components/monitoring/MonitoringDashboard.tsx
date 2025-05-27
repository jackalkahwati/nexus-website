"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Alert, AlertDescription } from '../ui/alert'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { useToast } from '../ui/use-toast'
import { LogMonitor } from './LogMonitor'
import { Skeleton } from '../ui/skeleton'

interface HealthCheck {
  name: string
  status: 'healthy' | 'warning' | 'error'
  message?: string
  timestamp: string
}

interface Metric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

interface ErrorLog {
  id: string
  timestamp: string
  level: string
  message: string
  service: string
}

export default function MonitoringDashboard() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchHealthData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/monitoring/health')
      if (!response.ok) throw new Error('Failed to fetch health checks')
      const data = await response.json()
      setHealthChecks(data)
    } catch (err: any) {
      setError(err.message)
      toast({ variant: "destructive", title: "Error", description: "Failed to load health data." })
    } finally {
      setLoading(false)
    }
  }

  const fetchMetricsData = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics data')
      }
      setMetrics(data.metrics)
      setError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch metrics data'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const fetchErrorLogs = async () => {
    try {
      const response = await fetch('/api/monitoring/errors')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch error logs')
      }
      setErrorLogs(data.logs)
      setError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch error logs'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchHealthData(),
        fetchMetricsData(),
        fetchErrorLogs(),
      ])
      setLoading(false)
    }

    fetchData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = errorLogs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4" data-testid="skeleton">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="errors">Error Log</TabsTrigger>
        </TabsList>
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthChecks?.map((check) => (
              <Card key={check.name} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{check.name}</h3>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      check.status === 'healthy'
                        ? 'bg-green-500'
                        : check.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                {check.message && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {check.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Last updated: {new Date(check.timestamp).toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics?.map((metric) => (
              <Card key={metric.name} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{metric.name}</h3>
                  <div
                    className={`flex items-center ${
                      metric.trend === 'up'
                        ? 'text-green-500'
                        : metric.trend === 'down'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {metric.value}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {metric.unit}
                  </span>
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="errors" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search error logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <Alert>
                <AlertDescription>No error logs found.</AlertDescription>
              </Alert>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          log.level === 'error'
                            ? 'bg-red-500'
                            : log.level === 'warn'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <span className="font-medium">{log.service}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{log.message}</p>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
