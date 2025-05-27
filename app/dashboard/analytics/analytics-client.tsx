"use client"

import { Suspense, lazy } from 'react'
import * as React from 'react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { addDays, subDays, format } from 'date-fns'
import { Calendar, BarChart3, TrendingUp, Users, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricData } from '@/types/analytics'

// Lazy load heavy components
const MetricsChart = lazy(() => import('@/components/analytics/MetricsChart').then(mod => ({ default: mod.MetricsChart })))
const FunnelChart = lazy(() => import('@/components/analytics/FunnelChart').then(mod => ({ default: mod.FunnelChart })))
const TopDimensionsChart = lazy(() => import('@/components/analytics/TopDimensionsChart').then(mod => ({ default: mod.TopDimensionsChart })))
const DownloadReports = lazy(() => import('@/components/analytics/DownloadReports').then(mod => ({ default: mod.DownloadReports })))

function LoadingSpinner() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export function AnalyticsPageClient() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [interval, setInterval] = useState<string>('day')
  const { metrics, isLoading } = useAnalytics()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and analyze your system metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Hourly</SelectItem>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricsChart data={metrics} />
          <FunnelChart />
          <TopDimensionsChart />
        </div>
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <DownloadReports />
      </Suspense>
    </div>
  )
} 