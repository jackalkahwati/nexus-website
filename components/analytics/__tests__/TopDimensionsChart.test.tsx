import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TopDimensionsChart } from '../TopDimensionsChart'
import type { DimensionData } from '../../../types/analytics'

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart">
      {data.map((item: any, index: number) => (
        <div
          key={index}
          data-testid={`dimension-bar-${item.name}`}
          data-value={item.value}
          data-dimension={item.dimension}
          className="flex justify-between text-sm"
        >
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-medium">
            {item.value.toLocaleString()}
            {item.percentage && ` (${item.percentage}%)`}
          </span>
        </div>
      ))}
      {children}
    </div>
  ),
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

// Mock UI components
jest.mock('components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}))

// Mock Select component with proper event handling
const mockSelectComponent = ({ children, onValueChange, value, 'aria-label': ariaLabel }: any) => (
  <div data-testid="select-root" data-value={value}>
    <button
      data-testid={`select-trigger-${ariaLabel}`}
      onClick={() => onValueChange?.(ariaLabel === 'select dimension' ? 'os' : '10')}
      aria-label={ariaLabel}
      role="combobox"
    >
      {value}
    </button>
    {children}
  </div>
)

jest.mock('components/ui/select', () => ({
  Select: mockSelectComponent,
  SelectTrigger: ({ children, 'aria-label': ariaLabel, onClick }: any) => (
    <button
      data-testid={`select-trigger-${ariaLabel}`}
      onClick={onClick}
      aria-label={ariaLabel}
      role="combobox"
    >
      {children}
    </button>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content" role="listbox">
      {children}
    </div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div 
      data-testid={`select-item-${value}`}
      role="option"
      data-value={value}
    >
      {children}
    </div>
  ),
}))

jest.mock('components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="chart-loading" className={className}>
      Loading...
    </div>
  ),
}))

jest.mock('components/ui/alert', () => ({
  Alert: ({ children, variant }: any) => (
    <div role="alert" data-variant={variant}>
      {children}
    </div>
  ),
  AlertDescription: ({ children }: any) => <div>{children}</div>,
  AlertActions: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('TopDimensionsChart', () => {
  const mockData = {
    browser: [
      { name: 'Chrome', value: 5000 },
      { name: 'Firefox', value: 3000 },
      { name: 'Safari', value: 2000 }
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders chart with dimension data', () => {
    render(
      <TopDimensionsChart
        data={mockData}
        dimension="browser"
        loading={false}
      />
    )
    
    const bars = screen.getAllByTestId(/^dimension-bar-/)
    expect(bars).toHaveLength(3)
    expect(bars[0]).toHaveAttribute('data-value', '5000')
    expect(bars[1]).toHaveAttribute('data-value', '3000')
    expect(bars[2]).toHaveAttribute('data-value', '2000')

    expect(screen.getByTestId('dimension-bar-Chrome')).toHaveTextContent('Chrome')
    expect(screen.getByTestId('dimension-bar-Firefox')).toHaveTextContent('Firefox')
    expect(screen.getByTestId('dimension-bar-Safari')).toHaveTextContent('Safari')
  })

  it('displays loading state when loading prop is true', () => {
    render(
      <TopDimensionsChart
        data={[]}
        loading={true}
        title="Top Browsers"
        dimension="browser"
      />
    )

    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('displays empty state when no data is provided', () => {
    render(
      <TopDimensionsChart
        data={[]}
        title="Top Browsers"
        dimension="browser"
      />
    )

    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('handles dimension selection change', async () => {
    const onDimensionChange = jest.fn()
    const user = userEvent.setup()

    render(
      <TopDimensionsChart
        data={mockData}
        dimension="browser"
        onDimensionChange={onDimensionChange}
        loading={false}
      />
    )

    const trigger = screen.getByTestId('select-trigger-select dimension')
    await user.click(trigger)

    await waitFor(() => {
      expect(onDimensionChange).toHaveBeenCalledWith('os')
    })
  })

  it('handles limit selection', async () => {
    const onLimitChange = jest.fn()
    const user = userEvent.setup()

    render(
      <TopDimensionsChart
        data={mockData}
        dimension="browser"
        onLimitChange={onLimitChange}
        loading={false}
      />
    )

    const trigger = screen.getByTestId('select-trigger-select limit')
    await user.click(trigger)

    await waitFor(() => {
      expect(onLimitChange).toHaveBeenCalledWith(10)
    })
  })

  it('displays percentage values correctly', () => {
    render(
      <TopDimensionsChart
        data={mockData}
        title="Top Browsers"
        dimension="browser"
        showPercentages
      />
    )

    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('sorts data in descending order', () => {
    const unsortedData = {
      browser: [
        { name: 'Safari', value: 2000 },
        { name: 'Chrome', value: 5000 },
        { name: 'Firefox', value: 3000 }
      ]
    }

    render(
      <TopDimensionsChart
        data={unsortedData}
        dimension="browser"
      />
    )

    const bars = screen.getAllByTestId(/^dimension-bar-/)
    expect(bars[0]).toHaveAttribute('data-value', '5000')
    expect(bars[1]).toHaveAttribute('data-value', '3000')
    expect(bars[2]).toHaveAttribute('data-value', '2000')
  })

  it('displays error state when error prop is provided', () => {
    render(
      <TopDimensionsChart
        data={[]}
        title="Top Browsers"
        dimension="browser"
        error="Failed to load dimension data"
        onRetry={() => {}}
      />
    )

    expect(screen.getByText(/failed to load dimension data/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('handles retry action when loading fails', async () => {
    const onRetry = jest.fn()
    const user = userEvent.setup()

    render(
      <TopDimensionsChart
        data={[]}
        title="Top Browsers"
        dimension="browser"
        error="Failed to load dimension data"
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)

    await waitFor(() => {
      expect(onRetry).toHaveBeenCalledTimes(1)
    }, { timeout: 1000 })
  }, 5000)

  it('applies custom styles when provided', () => {
    const customStyles = {
      width: '100%',
      height: '400px',
    }

    render(
      <TopDimensionsChart
        data={mockData}
        title="Top Browsers"
        dimension="browser"
        style={customStyles}
      />
    )

    const chartContainer = screen.getByTestId('dimensions-chart-container')
    expect(chartContainer).toHaveStyle(customStyles)
  })
})
