import React from 'react'
import { DimensionData } from 'types/analytics'

interface TopDimensionsChartProps {
  data: DimensionData[]
  title: string
  dimension: string
  loading?: boolean
  error?: string
  availableDimensions?: string[]
  showPercentages?: boolean
  limit?: number
  onDimensionChange?: (dimension: string) => void
  onLimitChange?: (limit: number) => void
  onRetry?: () => void
  style?: React.CSSProperties
}

export const TopDimensionsChart: React.FC<TopDimensionsChartProps> = ({
  data,
  title,
  loading,
  error,
  style,
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

  if (!data.length) {
    return <div>No data available</div>
  }

  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  return (
    <div data-testid="dimensions-chart-container" style={style}>
      <div data-testid="dimensions-chart">
        <h3>{title}</h3>
        <div>
          {sortedData.map((item, index) => (
            <div
              key={`${item.dimension}-${item.value}`}
              data-testid="dimension-bar"
              data-value={item.count}
            >
              {item.value}: {item.count} ({item.percentage}%)
            </div>
          ))}
        </div>
        <div>
          <div role="combobox" aria-label="select dimension">
            Select Dimension
          </div>
          <div role="combobox" aria-label="select limit">
            Select Limit
          </div>
        </div>
      </div>
    </div>
  )
}
