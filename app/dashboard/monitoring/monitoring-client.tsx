"use client"

import { Suspense, lazy } from 'react'
import { Card } from '@/components/ui/card'
import { ErrorBoundary } from '@/app/components/error-boundary'

// Lazy load components
const LogMonitor = lazy(() => import('@/components/monitoring/LogMonitor').then(mod => ({ default: mod.LogMonitor })))
const MonitoringDashboard = lazy(() => import('@/components/monitoring/MonitoringDashboard').then(mod => ({ default: mod.MonitoringDashboard })))
const RateLimitMonitor = lazy(() => import('@/components/rate-limit/RateLimitMonitor').then(mod => ({ default: mod.RateLimitMonitor })))
const CacheMonitor = lazy(() => import('@/components/cache/CacheMonitor').then(mod => ({ default: mod.CacheMonitor })))
const AlertManager = lazy(() => import('@/components/monitoring/AlertManager').then(mod => ({ default: mod.AlertManager })))

function LoadingCard() {
  return (
    <Card className="p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </Card>
  )
}

export function MonitoringClient() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Monitoring</h1>
      </div>
      
      <ErrorBoundary>
        {/* Alerts Section - Full Width */}
        <div className="mb-6">
          <Suspense fallback={<LoadingCard />}>
            <AlertManager stats={null} />
          </Suspense>
        </div>

        {/* Main Monitoring Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Overview */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">System Overview</h2>
              <Suspense fallback={<LoadingCard />}>
                <MonitoringDashboard />
              </Suspense>
            </div>
          </div>

          {/* Log Management */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Log Management</h2>
              <Suspense fallback={<LoadingCard />}>
                <LogMonitor />
              </Suspense>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Rate Limiting</h2>
              <Suspense fallback={<LoadingCard />}>
                <RateLimitMonitor />
              </Suspense>
            </div>
          </div>

          {/* Cache Status */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Cache Status</h2>
              <Suspense fallback={<LoadingCard />}>
                <CacheMonitor />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-8 flex justify-between items-center">
          <span>All metrics are updated in real-time</span>
          <span>Last page load: {new Date().toLocaleString()}</span>
        </div>
      </ErrorBoundary>
    </div>
  )
} 