import { Redis } from '@upstash/redis'
import { prisma } from 'lib/prisma'
import logger from 'lib/logger'

// Initialize Redis client for storing metrics
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: '', // No token needed for local Redis
})

// Cache TTLs
const CACHE_TTLS = {
  metrics: 86400, // 24 hours
  health: 300,   // 5 minutes
  errors: 604800 // 7 days
}

// Batch size for operations
const BATCH_SIZE = 100

// Metric types
export type MetricType = 'counter' | 'gauge' | 'histogram'

export interface Metric {
  name: string
  value: number
  type: MetricType
  labels?: Record<string, string>
  timestamp: number
}

export interface MetricStats {
  min: number
  max: number
  avg: number
  count: number
  sum: number
}

export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  details?: Record<string, any>
  lastChecked: number
}

export interface ErrorEvent {
  message: string
  stack?: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
  timestamp: number
}

export class MonitoringService {
  private static instance: MonitoringService;
  private healthChecks: Map<string, HealthCheck> = new Map();
  private healthPrefix: string = 'health:';
  private metricsPrefix: string = 'metrics:';
  private errorPrefix: string = 'error:';
  private metricsBatch: Metric[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeHealthChecks();
    this.startMetricsCleaner();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'Unknown error occurred'
  }

  // Initialize default health checks
  private async initializeHealthChecks() {
    // Database health check
    this.registerHealthCheck('database', async () => {
      const cacheKey = `${this.healthPrefix}database:status`
      const cached = await redis.get(cacheKey)
      
      if (cached) {
        return JSON.parse(cached as string)
      }

      try {
        await prisma.$queryRaw`SELECT 1`
        const result = {
          status: 'healthy' as const,
          details: { connection: 'successful' }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      } catch (error) {
        const result = {
          status: 'unhealthy' as const,
          details: { error: this.getErrorMessage(error) }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      }
    })

    // Redis health check
    this.registerHealthCheck('redis', async () => {
      const cacheKey = `${this.healthPrefix}redis:status`
      const cached = await redis.get(cacheKey)
      
      if (cached) {
        return JSON.parse(cached as string)
      }

      try {
        await redis.ping()
        const result = {
          status: 'healthy' as const,
          details: { connection: 'successful' }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      } catch (error) {
        const result = {
          status: 'unhealthy' as const,
          details: { error: this.getErrorMessage(error) }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      }
    })

    // API health check
    this.registerHealthCheck('api', async () => {
      const cacheKey = `${this.healthPrefix}api:status`
      const cached = await redis.get(cacheKey)
      
      if (cached) {
        return JSON.parse(cached as string)
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
        const result = {
          status: response.ok ? 'healthy' as const : 'unhealthy' as const,
          details: { statusCode: response.status }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      } catch (error) {
        const result = {
          status: 'unhealthy' as const,
          details: { error: this.getErrorMessage(error) }
        }
        await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTLS.health })
        return result
      }
    })
  }

  // Register a new health check
  public registerHealthCheck(
    name: string,
    check: () => Promise<{ status: HealthCheck['status']; details?: Record<string, any> }>
  ) {
    this.healthChecks.set(name, {
      name,
      status: 'unhealthy',
      lastChecked: Date.now(),
      details: {}
    })

    // Schedule periodic health check
    setInterval(async () => {
      try {
        const result = await check()
        await this.updateHealthCheck(name, result.status, result.details)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        await this.updateHealthCheck(name, 'unhealthy', { error: errorMessage })
      }
    }, CACHE_TTLS.health * 1000) // Check every 5 minutes
  }

  // Update health check status
  private async updateHealthCheck(
    name: string,
    status: HealthCheck['status'],
    details?: Record<string, any>
  ) {
    const healthCheck: HealthCheck = {
      name,
      status,
      details,
      lastChecked: Date.now()
    }

    this.healthChecks.set(name, healthCheck)
    await redis.set(
      `${this.healthPrefix}${name}`,
      JSON.stringify(healthCheck),
      { ex: CACHE_TTLS.health }
    )
    logger.info('Health check updated', { name, status })
  }

  // Batch process metrics
  private async processBatch() {
    if (this.metricsBatch.length === 0) return

    const metrics = [...this.metricsBatch]
    this.metricsBatch = []

    try {
      await Promise.all(metrics.map(async (metric) => {
        const key = `${this.metricsPrefix}${metric.name}:${metric.timestamp}`
        await redis.set(key, JSON.stringify(metric), { ex: CACHE_TTLS.metrics })

        if (metric.type === 'counter' || metric.type === 'gauge') {
          await redis.set(
            `${this.metricsPrefix}${metric.name}:current`,
            metric.value.toString()
          )
        }

        if (metric.type === 'histogram') {
          const histogramKey = `${this.metricsPrefix}${metric.name}:histogram`
          const scoreMember = {
            score: metric.value,
            member: metric.timestamp.toString()
          }
          await redis.zadd(histogramKey, scoreMember)
        }
      }))
    } catch (error) {
      logger.error('Failed to process metrics batch', { error })
      // Re-add failed metrics to batch
      this.metricsBatch.push(...metrics)
    }
  }

  // Record a metric
  public async recordMetric(metric: Omit<Metric, 'timestamp'>) {
    const timestamp = Date.now()
    const fullMetric: Metric = { ...metric, timestamp }

    this.metricsBatch.push(fullMetric)

    if (this.metricsBatch.length >= BATCH_SIZE) {
      await this.processBatch()
    } else if (!this.batchTimeout) {
      // Process batch after 1 second if no more metrics are added
      this.batchTimeout = setTimeout(async () => {
        await this.processBatch()
        this.batchTimeout = null
      }, 1000)
    }
  }

  // Clean up old metrics
  private async startMetricsCleaner() {
    setInterval(async () => {
      const now = Date.now()
      const keys = await redis.keys(`${this.metricsPrefix}*`)

      try {
        await Promise.all(keys.map(async (key) => {
          const value = await redis.get(key)
          if (value) {
            try {
              const metric = JSON.parse(value as string)
              if (now - metric.timestamp > CACHE_TTLS.metrics * 1000) {
                await redis.del(key)
              }
            } catch (error) {
              logger.error('Failed to parse metric', { key, error })
            }
          }
        }))
      } catch (error) {
        logger.error('Failed to clean up old metrics', { error })
      }
    }, 3600000) // Run every hour
  }

  // Record an error
  public async recordError(error: Error | string, severity: ErrorEvent['severity'] = 'medium', context?: Record<string, any>) {
    const errorEvent: Omit<ErrorEvent, 'timestamp'> = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : 'StringError',
      severity,
      context
    }
    
    await this.trackError(errorEvent)
  }

  // Track an error
  public async trackError(error: Omit<ErrorEvent, 'timestamp'>) {
    const timestamp = Date.now()
    const errorEvent: ErrorEvent = { ...error, timestamp }

    // Store error in Redis
    await redis.set(
      `${this.errorPrefix}${timestamp}`,
      JSON.stringify(errorEvent),
      { ex: CACHE_TTLS.errors }
    )

    // Log error
    logger.error(errorEvent.message, {
      type: errorEvent.type,
      severity: errorEvent.severity,
      context: errorEvent.context,
    })

    // Alert on critical errors
    if (error.severity === 'critical') {
      await this.sendAlert(errorEvent)
    }
  }

  // Get all health checks
  public async getHealthStatus(): Promise<HealthCheck[]> {
    return Array.from(this.healthChecks.values())
  }

  // Get metrics for a specific time range with caching
  public async getMetrics(
    name: string,
    startTime: number,
    endTime: number
  ): Promise<Metric[]> {
    const cacheKey = `${this.metricsPrefix}${name}:range:${startTime}:${endTime}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached as string)
    }

    const metrics: Metric[] = []
    const keys = await redis.keys(`${this.metricsPrefix}${name}:*`)

    for (const key of keys) {
      const value = await redis.get(key)
      if (value) {
        const metric: Metric = JSON.parse(value as string)
        if (metric.timestamp >= startTime && metric.timestamp <= endTime) {
          metrics.push(metric)
        }
      }
    }

    // Cache results for 1 minute
    await redis.set(cacheKey, JSON.stringify(metrics), { ex: 60 })

    return metrics
  }

  // Get metric statistics for a time range with caching
  public async getMetricStats(name: string, timeRange: number): Promise<MetricStats> {
    const cacheKey = `${this.metricsPrefix}${name}:stats:${timeRange}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached as string)
    }

    const now = Date.now()
    const startTime = now - timeRange
    const metrics = await this.getMetrics(name, startTime, now)

    if (metrics.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        count: 0,
        sum: 0
      }
    }

    const values = metrics.map(m => m.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      count: values.length,
      sum
    }

    // Cache results for 1 minute
    await redis.set(cacheKey, JSON.stringify(stats), { ex: 60 })

    return stats
  }

  // Get recent errors with caching
  public async getRecentErrors(limit: number = 100): Promise<ErrorEvent[]> {
    const cacheKey = `${this.errorPrefix}recent:${limit}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached as string)
    }

    const keys = await redis.keys(`${this.errorPrefix}*`)
    const errors: ErrorEvent[] = []

    for (const key of keys.slice(0, limit)) {
      const value = await redis.get(key)
      if (value) {
        errors.push(JSON.parse(value as string))
      }
    }

    const sortedErrors = errors.sort((a, b) => b.timestamp - a.timestamp)

    // Cache results for 1 minute
    await redis.set(cacheKey, JSON.stringify(sortedErrors), { ex: 60 })

    return sortedErrors
  }

  // Send alert for critical errors
  private async sendAlert(error: ErrorEvent): Promise<void> {
    // Implement your alert mechanism here (e.g., email, Slack, etc.)
    logger.error('Critical error alert', {
      message: error.message,
      type: error.type,
      severity: error.severity,
      context: error.context
    })
  }
}

export const monitoring = MonitoringService.getInstance()
