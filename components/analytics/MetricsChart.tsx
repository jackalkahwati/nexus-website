'use client'

import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { MetricData } from '../../types/analytics'

interface MetricsChartProps {
  metrics?: MetricData[]
  title?: string
  loading?: boolean
  error?: string
  metricTypes?: string[]
  dimensions?: string[]
  onMetricTypeChange?: (type: string) => void
  onDimensionChange?: (dimension: string) => void
  onTimeRangeChange?: (range: string) => void
  onRetry?: () => void
}

export function MetricsChart({
  metrics = [],
  title = 'Metrics',
  loading = false,
  error,
  metricTypes,
  dimensions,
  onMetricTypeChange,
  onDimensionChange,
  onTimeRangeChange,
  onRetry
}: MetricsChartProps) {
  if (loading) {
    return (
      <Card className="p-4" data-testid="chart-loading">
        <Skeleton className="h-[300px] w-full" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry}>Retry</Button>
          )}
        </div>
      </Card>
    )
  }

  if (!metrics.length) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">No data available</div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex gap-2">
          {metricTypes && (
            <Select
              data-testid="metric-type-select"
              label="Metric Type"
              options={metricTypes}
              onChange={onMetricTypeChange}
            />
          )}
          {dimensions && (
            <Select
              data-testid="dimension-select"
              label="Dimension"
              options={dimensions}
              onChange={onDimensionChange}
            />
          )}
          <Select
            data-testid="time-range-select"
            label="Time Range"
            options={['7d', '30d', '90d']}
            onChange={onTimeRangeChange}
          />
        </div>
      </div>

      <div className="h-[300px]" data-testid="metrics-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(time) => new Date(time).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              dot={false}
              renderDot={(props) => (
                <circle
                  {...props}
                  data-testid="data-point"
                  data-value={props.payload.value}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
