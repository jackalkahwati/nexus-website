import { GET, POST } from '@/app/api/analytics/route'
import { NextRequest } from 'next/server'
import { AnalyticsService } from '@/lib/services/analytics'
import type { MetricData } from '@/types/analytics'

// Mock NextResponse
const mockJson = jest.fn()
jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => {
      mockJson(...args)
      // Return a proper Response object with json method
      return new Response(JSON.stringify(args[0]), {
        status: args[1]?.status || 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },
  NextRequest: jest.fn()
}))

// Mock Logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: mockLogger,
}))

// Mock AnalyticsService
jest.mock('@/lib/services/analytics', () => ({
  AnalyticsService: jest.fn().mockImplementation(() => ({
    getMetrics: jest.fn(),
    trackMetric: jest.fn(),
  })),
}))

describe('Analytics API', () => {
  let analyticsService: jest.Mocked<AnalyticsService>

  beforeEach(() => {
    jest.clearAllMocks()
    analyticsService = new AnalyticsService() as jest.Mocked<AnalyticsService>
    mockJson.mockClear()
    Object.keys(mockLogger).forEach(key => {
      mockLogger[key as keyof typeof mockLogger].mockClear()
    })
  })

  describe('GET', () => {
    it('should return metrics for a given time range', async () => {
      const mockMetrics = [
        {
          timestamp: new Date(),
          value: 1,
          metricName: 'pageViews',
          dimensions: {},
          metadata: {},
        },
      ]

      ;(analyticsService.getMetrics as jest.Mock).mockResolvedValue(mockMetrics)

      const request = new NextRequest(
        new URL(
          'http://localhost/api/analytics?startDate=2024-01-01&endDate=2024-01-31&metrics=pageViews'
        )
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ metrics: mockMetrics })
      expect(analyticsService.getMetrics).toHaveBeenCalledWith('default', {
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        metrics: ['pageViews'],
      })
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.any(Array)
        })
      )
    })

    it('should handle missing query parameters', async () => {
      const mockMetrics: MetricData[] = [{
        timestamp: new Date(),
        value: 1,
        metricName: 'pageViews',
        dimensions: {},
        metadata: {}
      }]
      
      ;(analyticsService.getMetrics as jest.Mock).mockResolvedValue(mockMetrics)

      const request = new NextRequest(new URL('http://localhost/api/analytics'))
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ metrics: mockMetrics })
      expect(analyticsService.getMetrics).toHaveBeenCalledWith('default', {
        startDate: undefined,
        endDate: undefined,
        metrics: undefined
      })
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          metrics: expect.any(Array)
        })
      )
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(analyticsService.getMetrics as jest.Mock).mockRejectedValue(error)

      const request = new NextRequest(new URL('http://localhost/api/analytics'))

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to get analytics data' })
      expect(mockLogger.error).toHaveBeenCalledWith('Analytics API error', { error })
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Failed to get analytics data' },
        { status: 500 }
      )
    })
  })

  describe('POST', () => {
    it('should track a metric successfully', async () => {
      const mockMetric = {
        userId: 'user123',
        metricName: 'pageViews',
        value: 1,
        dimensions: { page: '/home' },
        metadata: { referrer: 'google' },
      }

      const request = new NextRequest(new URL('http://localhost/api/analytics'), {
        method: 'POST',
        body: JSON.stringify(mockMetric),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(analyticsService.trackMetric).toHaveBeenCalledWith(
        mockMetric.userId,
        mockMetric.metricName,
        mockMetric.value,
        mockMetric.dimensions,
        mockMetric.metadata
      )
      expect(mockJson).toHaveBeenCalledWith({ success: true })
    })

    it('should validate required fields', async () => {
      const request = new NextRequest(new URL('http://localhost/api/analytics'), {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Missing required fields' })
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(analyticsService.trackMetric as jest.Mock).mockRejectedValue(error)

      const request = new NextRequest(new URL('http://localhost/api/analytics'), {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user123',
          metricName: 'pageViews',
          value: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to track metric' })
      expect(mockLogger.error).toHaveBeenCalledWith('Analytics API error', { error })
      expect(mockJson).toHaveBeenCalledWith(
        { error: 'Failed to track metric' },
        { status: 500 }
      )
    })
  })
})
