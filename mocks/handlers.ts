import { rest } from 'msw'
import { MetricData, FunnelData, DimensionData } from 'types/analytics'

export const handlers = [
  // Analytics API handlers
  rest.get('/api/analytics/metrics', (req, res, ctx) => {
    const mockMetrics: MetricData[] = [
      {
        timestamp: new Date(),
        value: 100,
        metricName: 'pageViews',
        dimensions: { page: '/home' },
      },
      {
        timestamp: new Date(),
        value: 150,
        metricName: 'pageViews',
        dimensions: { page: '/about' },
      },
    ]
    return res(ctx.json(mockMetrics))
  }),

  rest.get('/api/analytics/funnel', (req, res, ctx) => {
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
    return res(ctx.json(mockFunnelData))
  }),

  rest.get('/api/analytics/dimensions', (req, res, ctx) => {
    const mockDimensionData: DimensionData[] = [
      {
        dimension: 'browser',
        value: 'Chrome',
        count: 5000,
        percentage: 50,
      },
      {
        dimension: 'browser',
        value: 'Firefox',
        count: 3000,
        percentage: 30,
      },
      {
        dimension: 'browser',
        value: 'Safari',
        count: 2000,
        percentage: 20,
      },
    ]
    return res(ctx.json(mockDimensionData))
  }),

  // Monitoring API handlers
  rest.get('/api/monitoring/health', (req, res, ctx) => {
    return res(ctx.json({
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
    }))
  }),

  rest.get('/api/monitoring/metrics', (req, res, ctx) => {
    return res(ctx.json({
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
    }))
  }),

  rest.get('/api/monitoring/errors', (req, res, ctx) => {
    return res(ctx.json({
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
    }))
  }),
]
