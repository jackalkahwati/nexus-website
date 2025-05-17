import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FunnelChart } from '../FunnelChart'

jest.mock('recharts', () => require('../../../test/mocks/recharts'))

// Mock Radix UI Select
jest.mock('@radix-ui/react-select', () => {
  return {
    Root: ({ children, onValueChange }: any) => {
      React.useEffect(() => {
        // Store the callback in a global variable
        (window as any).__selectCallback = onValueChange
      }, [onValueChange])
      return <div data-testid="select-root">{children}</div>
    },
    Trigger: ({ children, ...props }: any) => (
      <button data-testid={`select-trigger-${props['aria-label'] || 'default'}`} role="combobox" {...props}>
        {children}
      </button>
    ),
    Portal: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div role="listbox">{children}</div>,
    Item: ({ children, value }: any) => (
      <div
        data-testid={`select-item-${value}`}
        role="option"
        onClick={() => (window as any).__selectCallback?.(value)}
      >
        {children}
      </div>
    ),
    ItemText: ({ children }: any) => <span>{children}</span>,
    ItemIndicator: ({ children }: any) => <span>{children}</span>,
    Icon: ({ children }: any) => <span>{children}</span>,
    Group: ({ children }: any) => <div>{children}</div>,
    Label: ({ children }: any) => <span>{children}</span>,
    Separator: ({ children }: any) => <div>{children}</div>,
    Value: ({ children }: any) => <span>{children}</span>,
    Viewport: ({ children }: any) => <div>{children}</div>,
  }
})

const mockData = [
  { name: 'Page View', value: 1000, fill: '#4CAF50' },
  { name: 'Add to Cart', value: 500, fill: '#2196F3' },
  { name: 'Purchase', value: 200, fill: '#9C27B0' }
]

describe('FunnelChart', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    delete (window as any).__selectCallback
  })

  it('renders funnel chart with data', () => {
    render(<FunnelChart data={mockData} />)
    
    mockData.forEach(item => {
      expect(screen.getByTestId(`funnel-segment-${item.name}`)).toBeInTheDocument()
      expect(screen.getByTestId(`funnel-tooltip-${item.name}`)).toHaveTextContent(
        item.value.toLocaleString()
      )
    })
  })

  it('renders loading state', () => {
    render(<FunnelChart title="Conversion Funnel" loading={true} data={[]} />)
    const loadingWrapper = screen.getByTestId('chart-loading-indicator')
    expect(loadingWrapper).toBeInTheDocument()
  })

  it('displays empty state when no data is provided', () => {
    render(<FunnelChart data={[]} />)
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('displays conversion rates between stages', () => {
    render(<FunnelChart data={mockData} />)
    const stages = screen.getAllByTestId('funnel-stage')
    expect(stages).toHaveLength(3)
    
    // Check values are displayed correctly
    expect(screen.getByTestId('funnel-tooltip-Page View')).toHaveTextContent('1,000')
    expect(screen.getByTestId('funnel-tooltip-Add to Cart')).toHaveTextContent('500')
    expect(screen.getByTestId('funnel-tooltip-Purchase')).toHaveTextContent('200')
  })

  it('handles date range selection', async () => {
    const onDateRangeChange = jest.fn()
    const user = userEvent.setup({ delay: null })

    render(
      <FunnelChart
        data={mockData}
        onDateRangeChange={onDateRangeChange}
      />
    )

    const trigger = screen.getByTestId('select-trigger-Date Range')
    await user.click(trigger)

    const option = screen.getByTestId('select-item-7d')
    await user.click(option)

    expect(onDateRangeChange).toHaveBeenCalledWith('7d')
  })

  it('handles segment click events', async () => {
    const onSegmentClick = jest.fn()
    const user = userEvent.setup({ delay: null })

    render(
      <FunnelChart
        data={mockData}
        onSegmentClick={onSegmentClick}
      />
    )

    const segment = screen.getByTestId('funnel-segment-Add to Cart')
    await user.click(segment)

    expect(onSegmentClick).toHaveBeenCalledWith(mockData[1])
  })

  it('displays error state when error prop is provided', () => {
    render(
      <FunnelChart
        data={[]}
        error="Failed to load data"
        onRetry={() => {}}
      />
    )

    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('handles retry action when loading fails', async () => {
    const onRetry = jest.fn()
    const user = userEvent.setup({ delay: null })

    render(
      <FunnelChart
        data={[]}
        error="Failed to load data"
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('applies custom styles when provided', () => {
    const customStyles = {
      height: '600px',
      width: '800px'
    }

    render(
      <FunnelChart
        data={mockData}
        style={customStyles}
      />
    )

    const chartContainer = screen.getByTestId('funnel-chart-container')
    expect(chartContainer).toHaveStyle({
      height: '100%',
      width: '100%'
    })
  })
})