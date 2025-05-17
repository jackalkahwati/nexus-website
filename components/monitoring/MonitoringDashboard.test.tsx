import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonitoringDashboard } from './MonitoringDashboard'
import { server } from '../../mocks/server'
import { rest } from 'msw'
import { toast } from 'components/ui/use-toast'

// Mock the toast function
jest.mock('components/ui/use-toast', () => ({
  toast: jest.fn()
}))

describe('MonitoringDashboard', () => {
  const mockHealthData = {
    services: [
      {
        name: 'API',
        status: 'healthy',
        message: 'All systems operational',
        timestamp: new Date().toISOString(),
      },
      {
        name: 'Database',
        status: 'healthy',
        message: 'Connected',
        timestamp: new Date().toISOString(),
      },
      {
        name: 'Cache',
        status: 'healthy',
        message: 'Cache hit rate: 95%',
        timestamp: new Date().toISOString(),
      },
    ],
  }

  const mockMetricsData = {
    metrics: [
      {
        name: 'Memory Usage',
        value: 75,
        unit: '%',
        trend: 'up',
      },
      {
        name: 'CPU Usage',
        value: 60,
        unit: '%',
        trend: 'stable',
      },
    ],
  }

  const mockErrorLogs = {
    logs: [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Database connection failed',
        service: 'database',
      },
      {
        id: '2',
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'API request timeout',
        service: 'api',
      },
    ],
  }

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Setup MSW handlers
    server.use(
      rest.get('/api/monitoring/health', (req, res, ctx) => {
        return res(ctx.json(mockHealthData))
      }),
      rest.get('/api/monitoring/metrics', (req, res, ctx) => {
        return res(ctx.json(mockMetricsData))
      }),
      rest.get('/api/monitoring/errors', (req, res, ctx) => {
        return res(ctx.json(mockErrorLogs))
      })
    )

    // Use fake timers
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Cleanup
    server.resetHandlers()
    jest.useRealTimers()
  })

  it('renders the dashboard with all sections', async () => {
    render(<MonitoringDashboard />)

    // Check loading state
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('API')).toBeInTheDocument()
    })

    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Cache')).toBeInTheDocument()

    // Switch to metrics tab
    const metricsTab = screen.getByRole('tab', { name: /system metrics/i })
    await userEvent.click(metricsTab)

    // Check metrics content
    await waitFor(() => {
      expect(screen.getByText('Memory Usage')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()
      expect(screen.getByText('CPU Usage')).toBeInTheDocument()
      expect(screen.getByText('60')).toBeInTheDocument()
    })
  })

  it('displays error state when health check fails', async () => {
    // Override health check handler to return error
    server.use(
      rest.get('/api/monitoring/health', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Health check failed' })
        )
      })
    )

    render(<MonitoringDashboard />)

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Health check failed')).toBeInTheDocument()
    })

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Health check failed',
      variant: 'destructive',
    })
  })

  it('updates metrics data periodically', async () => {
    const updatedMetricsData = {
      metrics: [
        {
          name: 'Memory Usage',
          value: 85,
          unit: '%',
          trend: 'up',
        },
      ],
    }

    render(<MonitoringDashboard />)

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('Memory Usage')).toBeInTheDocument()
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    // Update metrics data
    server.use(
      rest.get('/api/monitoring/metrics', (req, res, ctx) => {
        return res(ctx.json(updatedMetricsData))
      })
    )

    // Fast-forward 30 seconds
    await act(async () => {
      jest.advanceTimersByTime(30000)
    })

    // Wait for updated data
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument()
    })
  })

  it('handles error log filtering', async () => {
    render(<MonitoringDashboard />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Database connection failed')).toBeInTheDocument()
    })

    // Switch to error log tab
    const errorTab = screen.getByRole('tab', { name: /error log/i })
    await userEvent.click(errorTab)

    // Filter logs
    const searchInput = screen.getByPlaceholderText(/search error logs/i)
    await userEvent.type(searchInput, 'api')

    // Check filtered results
    await waitFor(() => {
      expect(screen.getByText('API request timeout')).toBeInTheDocument()
      expect(screen.queryByText('Database connection failed')).not.toBeInTheDocument()
    })
  })
})
