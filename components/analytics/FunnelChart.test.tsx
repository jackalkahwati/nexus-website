import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FunnelChart } from './FunnelChart'
import type { FunnelData } from '@/types/analytics'

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  FunnelChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="funnel-chart-container">{children}</div>
  ),
  Funnel: ({ children, data, dataKey, onClick }: { children: React.ReactNode; data?: any[]; dataKey?: string; onClick?: (data: any) => void }) => (
    <div 
      data-testid="funnel-chart" 
      data-chart-data={JSON.stringify(data)}
      data-key={dataKey}
      onClick={() => onClick && onClick(data?.[0])}
    >
      {children}
    </div>
  ),
  LabelList: ({ position, dataKey }: { position?: string; dataKey?: string }) => (
    <div data-testid="label-list" data-position={position} data-key={dataKey} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
}))

// Mock Select component
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <div data-testid="select-container">
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: any) => (
    <button {...props} role="combobox" aria-expanded="false" type="button">
      {children}
    </button>
  ),
  SelectContent: ({ children }: any) => (
    <div role="listbox">
      {children}
    </div>
  ),
  SelectItem: ({ value, children, onSelect }: any) => (
    <div role="option" data-value={value} onClick={() => onSelect?.(value)}>
      {children}
    </div>
  )
}))

// Mock console.log before tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('FunnelChart', () => {
  const mockFunnelData: FunnelData[] = [
    {
      name: 'Page View',
      value: 1000,
      fill: '#4F46E5',
    },
    {
      name: 'Add to Cart',
      value: 500,
      fill: '#6366F1',
    },
    {
      name: 'Purchase',
      value: 200,
      fill: '#818CF8',
    },
  ]

  it('renders funnel chart with data', () => {
    render(<FunnelChart data={mockFunnelData} title="Conversion Funnel" />)

    expect(screen.getByText('Conversion Funnel')).toBeInTheDocument()
    expect(screen.getByTestId('funnel-chart-container')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<FunnelChart title="Conversion Funnel" loading={true} data={[]} />)
    const loadingWrapper = screen.getByTestId('chart-loading-indicator')
    expect(loadingWrapper).toBeInTheDocument()
    expect(loadingWrapper).toHaveTextContent('Loading...')
  })

  it('displays empty state when no data is provided', () => {
    render(<FunnelChart data={[]} title="Conversion Funnel" />)

    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('displays conversion rates between stages', () => {
    render(
      <FunnelChart
        data={mockFunnelData}
        title="Conversion Funnel"
        showConversionRates
      />
    )

    const stages = screen.getAllByTestId('funnel-stage')
    expect(stages[1]).toHaveTextContent('50%')
    expect(stages[2]).toHaveTextContent('40%')
  })

  it('handles date range selection', async () => {
    const onDateRangeChange = jest.fn()
    const user = userEvent.setup()

    render(
      <FunnelChart
        data={mockFunnelData}
        title="Conversion Funnel"
        onDateRangeChange={onDateRangeChange}
      />
    )

    const trigger = screen.getByRole('combobox', { name: 'date range' })
    await user.click(trigger)

    const option = screen.getByRole('option', { name: 'Last 7 days' })
    await user.click(option)

    await waitFor(() => {
      expect(onDateRangeChange).toHaveBeenCalledWith('7d')
    })
  })

  it('updates chart when new data is provided', () => {
    const { rerender } = render(
      <FunnelChart data={mockFunnelData} title="Conversion Funnel" />
    )

    const newData = [
      ...mockFunnelData,
      {
        name: 'Repeat Purchase',
        value: 100,
        fill: '#A5B4FC',
      },
    ]

    rerender(<FunnelChart data={newData} title="Conversion Funnel" />)

    const stages = screen.getAllByTestId('funnel-stage')
    expect(stages).toHaveLength(4)
    expect(stages[3]).toHaveTextContent('Repeat Purchase')
  })

  it('displays tooltips with correct information', () => {
    render(<FunnelChart data={mockFunnelData} title="Conversion Funnel" />)

    const tooltips = mockFunnelData.map(item => 
      screen.getByTestId(`funnel-tooltip-${item.name}`)
    )
    expect(tooltips[0]).toHaveTextContent('1,000')
    expect(tooltips[1]).toHaveTextContent('500')
    expect(tooltips[2]).toHaveTextContent('200')
  })

  it('handles segment click events', async () => {
    const onSegmentClick = jest.fn()
    const user = userEvent.setup()

    render(
      <FunnelChart
        data={mockFunnelData}
        title="Conversion Funnel"
        onSegmentClick={onSegmentClick}
      />
    )

    const segment = screen.getByTestId('funnel-chart')
    await user.click(segment)

    await waitFor(() => {
      expect(onSegmentClick).toHaveBeenCalledWith(mockFunnelData[0])
    })
  })

  it('displays error state when error prop is provided', () => {
    render(
      <FunnelChart
        data={[]}
        title="Conversion Funnel"
        error="Failed to load funnel data"
        onRetry={() => {}}
      />
    )

    expect(screen.getByText(/failed to load funnel data/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('handles retry action when loading fails', async () => {
    const onRetry = jest.fn()
    const user = userEvent.setup()

    render(
      <FunnelChart
        data={[]}
        title="Conversion Funnel"
        error="Failed to load funnel data"
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
      width: '800px',
      height: '600px',
    }

    render(
      <FunnelChart
        data={mockFunnelData}
        title="Conversion Funnel"
        style={customStyles}
      />
    )

    const chartContainer = screen.getByTestId('funnel-chart-container')
    expect(chartContainer).toHaveStyle(customStyles)
  })
})
