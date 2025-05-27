'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { MetricData, FunnelStep, FunnelData } from 'types/analytics'

export interface AnalyticsFilter {
  dimension: string
  value: string | number
}

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

interface AnalyticsContextType {
  metrics: MetricData[]
  realTimeMetrics: MetricData[]
  funnelSteps: FunnelStep[]
  topDimensions: { dimension: string; value: number }[]
  isLoading: boolean
  getMetrics: (options: { startDate: Date; endDate: Date; interval: string }) => Promise<void>
  getRealTimeMetrics: () => Promise<void>
  getTopDimensions: (metricName: string, dimension: string, limit: number) => Promise<void>
  getFunnelMetrics: (steps: string[], startDate: Date, endDate: Date) => Promise<void>
  trackMetric: (metricName: string, value: number, dimensions?: Record<string, any>) => Promise<void>
  isTracking: boolean
  events: AnalyticsEvent[]
  startTracking: () => void
  stopTracking: () => void
  trackEvent: (name: string, properties?: Record<string, any>) => void
  clearEvents: () => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<MetricData[]>([])
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([])
  const [topDimensions, setTopDimensions] = useState<{ dimension: string; value: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTracking, setIsTracking] = useState(true)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])

  const transformMetricData = (data: any[]): MetricData[] => {
    return data.map(metric => ({
      ...metric,
      timestamp: new Date(metric.timestamp),
      dimensions: metric.dimensions || {}
    }))
  }

  const getMetrics = React.useCallback(async (options: { startDate: Date; endDate: Date; interval: string }) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        type: 'metrics',
        startDate: options.startDate.toISOString(),
        endDate: options.endDate.toISOString(),
        interval: options.interval
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      setMetrics(transformMetricData(data.metrics))
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getRealTimeMetrics = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        type: 'realtime'
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      setRealTimeMetrics(transformMetricData(data.metrics))
    } catch (error) {
      console.error('Failed to fetch real-time metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getTopDimensions = React.useCallback(async (metricName: string, dimension: string, limit: number) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        type: 'dimensions',
        metricName,
        dimension,
        limit: limit.toString()
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      setTopDimensions(data.dimensions)
    } catch (error) {
      console.error('Failed to fetch top dimensions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFunnelMetrics = React.useCallback(async (steps: string[], startDate: Date, endDate: Date) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        type: 'funnel',
        steps: steps.join(','),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      setFunnelSteps(data.funnel)
    } catch (error) {
      console.error('Failed to fetch funnel metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const trackMetric = React.useCallback(async (
    metricName: string,
    value: number,
    dimensions?: Record<string, any>
  ) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'default', // You might want to get this from auth context
          metricName,
          value,
          dimensions
        }),
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
    } catch (error) {
      console.error('Failed to track metric:', error)
    }
  }, [])

  const startTracking = useCallback(() => {
    setIsTracking(true)
    console.log('Analytics tracking started')
  }, [])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
    console.log('Analytics tracking stopped')
  }, [])

  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    if (!isTracking) return

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now()
    }

    setEvents(prev => [...prev, event])
    console.log('Event tracked:', event)

    // Here you would typically send the event to your analytics service
    // For example: 
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(event)
    // })
  }, [isTracking])

  const clearEvents = useCallback(() => {
    setEvents([])
    console.log('Analytics events cleared')
  }, [])

  const value = React.useMemo(
    () => ({
      metrics,
      realTimeMetrics,
      funnelSteps,
      topDimensions,
      isLoading,
      getMetrics,
      getRealTimeMetrics,
      getTopDimensions,
      getFunnelMetrics,
      trackMetric,
      isTracking,
      events,
      startTracking,
      stopTracking,
      trackEvent,
      clearEvents
    }),
    [
      metrics,
      realTimeMetrics,
      funnelSteps,
      topDimensions,
      isLoading,
      getMetrics,
      getRealTimeMetrics,
      getTopDimensions,
      getFunnelMetrics,
      trackMetric,
      isTracking,
      events,
      startTracking,
      stopTracking,
      trackEvent,
      clearEvents
    ]
  )

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
