import { rest } from 'msw'

const handlers = [
  rest.get('/api/monitoring/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        services: {
          api: { status: 'up', latency: 120 },
          database: { status: 'up', latency: 50 },
          cache: { status: 'up', latency: 5 }
        }
      })
    )
  }),

  rest.get('/api/monitoring/metrics', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cpu: 75,
        memory: 60,
        disk: 45,
        network: {
          in: 1200,
          out: 800
        }
      })
    )
  }),

  rest.get('/api/monitoring/logs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { level: 'error', message: 'Database connection failed', timestamp: new Date().toISOString() },
        { level: 'info', message: 'Request processed', timestamp: new Date().toISOString() },
        { level: 'warn', message: 'High memory usage', timestamp: new Date().toISOString() }
      ])
    )
  })
]

module.exports = handlers 