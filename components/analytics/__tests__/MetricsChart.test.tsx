import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MetricsChart } from '../MetricsChart'
import type { MetricData } from '../../../types/analytics'

// Mock recharts
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey, renderDot }: any) => {
    const mockProps = { cx: 0, cy: 0, payload: { value: 100 } }
    return (
      <div data-testid="line">
        {renderDot && renderDot(mockProps)}
      </div>
    )
  },
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}))

describe('MetricsChart', () => {
  const mockMetrics: MetricData[] = [
    {
      timestamp: new Date('2024-01-01T00:00:00Z'),
      value: 100,
      metricName: 'pageViews',
      dimensions: { page: '/home' },
    },
    {
      timestamp: new Date('2024-01-01T01:00:00Z'),
      value: 150,
      metricName: 'pageViews',
      dimensions: { page: '/about' },
    },
  ]

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders chart with metrics data', () => {
    render(<MetricsChart metrics={mockMetrics} title="Page Views" />)
    expect(screen.getByText('Page Views')).toBeInTheDocument()
    expect(screen.getByTestId('metrics-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line')).toBeInTheDocument()
  })

  it('displays loading state when loading prop is true', () => {
    render(<MetricsChart metrics={[]} loading={true} title="Page Views" />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('displays empty state when no metrics are provided', () => {
    render(<MetricsChart metrics={[]} title="Page Views" />)
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('handles metric type selection', async () => {
    const user = userEvent.setup({ delay: null })
    const onMetricTypeChange = jest.fn()
    const metricTypes = ['pageViews', 'uniqueVisitors']

    render(
      <MetricsChart
        metrics={mockMetrics}
        title="Metrics"
        metricTypes={metricTypes}
        onMetricTypeChange={onMetricTypeChange}
      />
    )

    const trigger = screen.getByTestId('select-trigger-Metric Type')
    await user.click(trigger)

    const option = screen.getByText('uniqueVisitors')
    await user.click(option)

    expect(onMetricTypeChange).toHaveBeenCalledWith('uniqueVisitors')
  }, 10000)

  it('handles dimension filtering', async () => {
    const user = userEvent.setup({ delay: null })
    const onDimensionChange = jest.fn()
    const dimensions = ['page', 'browser']

    render(
      <MetricsChart
        metrics={mockMetrics}
        title="Page Views"
        dimensions={dimensions}
        onDimensionChange={onDimensionChange}
      />
    )

    const trigger = screen.getByTestId('select-trigger-Dimension')
    await user.click(trigger)

    const option = screen.getByText('browser')
    await user.click(option)

    expect(onDimensionChange).toHaveBeenCalledWith('browser')
  }, 10000)

  it('handles time range selection', async () => {
    const user = userEvent.setup({ delay: null })
    const onTimeRangeChange = jest.fn()

    render(
      <MetricsChart
        metrics={mockMetrics}
        title="Page Views"
        onTimeRangeChange={onTimeRangeChange}
      />
    )

    const trigger = screen.getByTestId('select-trigger-Time Range')
    await user.click(trigger)

    const option = screen.getByText('7d')
    await user.click(option)

    expect(onTimeRangeChange).toHaveBeenCalledWith('7d')
  }, 10000)

  it('handles retry action when loading fails', async () => {
    const user = userEvent.setup({ delay: null })
    const onRetry = jest.fn()

    render(
      <MetricsChart
        metrics={[]}
        title="Page Views"
        error="Failed to load metrics"
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  }, 10000)
})
