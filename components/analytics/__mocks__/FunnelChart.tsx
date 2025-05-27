import React from 'react'
import { FunnelData } from 'types/analytics'

interface FunnelChartProps {
  data: FunnelData[]
  title: string
  loading?: boolean
  error?: string
  showConversionRates?: boolean
  onDateRangeChange?: (range: string) => void
  onSegmentClick?: (segment: FunnelData) => void
  onRetry?: () => void
  style?: React.CSSProperties
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  title,
  loading,
  error,
  showConversionRates,
}) => {
  if (loading) {
    return <div data-testid="chart-loading">Loading...</div>
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <button>Retry</button>
      </div>
    )
  }

  if (!data.length) {
    return <div>No data available</div>
  }

  return (
    <div data-testid="funnel-chart" style={{ width: '100%', height: '400px' }}>
      <h3>{title}</h3>
      <div>
        {data.map((item, index) => (
          <div key={item.name} data-testid="funnel-stage">
            <div data-testid="funnel-segment">{item.name}</div>
            <div data-testid="funnel-tooltip">{item.value.toLocaleString()}</div>
            {showConversionRates && index > 0 && (
              <div>
                {Math.round((item.value / data[index - 1].value) * 100)}%
              </div>
            )}
          </div>
        ))}
      </div>
      <label>
        Date Range
        <select>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </label>
    </div>
  )
}
