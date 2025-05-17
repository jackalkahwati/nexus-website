import React from 'react'
import { MetricData } from 'types/analytics'

interface MetricsChartProps {
  metrics: MetricData[]
  title: string
  loading?: boolean
  error?: string
  metricTypes?: string[]
  dimensions?: string[]
  onMetricTypeChange?: (type: string) => void
  onDimensionChange?: (dimension: string) => void
  onRetry?: () => void
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metrics,
  title,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return <div data-testid="chart-loading">Loading...</div>
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <button onClick={onRetry}>Retry</button>
      </div>
    )
  }

  if (!metrics.length) {
    return <div>No data available</div>
  }

  return (
    <div data-testid="metrics-chart">
      <h3>{title}</h3>
      <div>
        {metrics.map((metric, index) => (
          <div key={index} data-testid="data-point" data-value={metric.value}>
            {new Date(metric.timestamp).toISOString()}: {metric.value}
          </div>
        ))}
      </div>
      <div>
        <button aria-label="metric type">Select Metric Type</button>
        <button aria-label="dimension">Select Dimension</button>
      </div>
    </div>
  )
}
