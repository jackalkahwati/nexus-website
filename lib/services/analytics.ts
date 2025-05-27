import { PrismaClient } from '@prisma/client'
import { startOfDay, endOfDay, subDays } from 'date-fns'
import logger from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { MetricData, FunnelStep, TopDimension, MetricsOptions } from '@/types/analytics'

interface AnalyticsEvent {
  id: number
  userId: string
  metricName: string
  value: number
  dimensions: Record<string, any>
  metadata: Record<string, any>
  timestamp: Date
}

interface Event {
  id: number
  name: string
  properties: Record<string, any>
  timestamp: Date
}

declare module '@prisma/client' {
  interface PrismaClient {
    analyticsEvent: {
      create: (args: { data: Omit<AnalyticsEvent, 'id'> }) => Promise<AnalyticsEvent>
      findMany: (args: { where: any; orderBy?: any }) => Promise<AnalyticsEvent[]>
    }
    event: {
      create: (args: { data: Omit<Event, 'id'> }) => Promise<Event>
    }
  }
}

export class AnalyticsService {
  // Track a metric
  async trackMetric(
    userId: string,
    metricName: string,
    value: number,
    dimensions: Record<string, any> = {},
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          metricName,
          value,
          dimensions: dimensions as any,
          metadata: metadata as any,
          timestamp: new Date(),
        },
      })
    } catch (error) {
      logger.error('Error tracking metric:', error)
      throw error
    }
  }

  // Get metrics for a time range
  async getMetrics(
    userId: string,
    options: MetricsOptions = {}
  ): Promise<MetricData[]> {
    try {
      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          timestamp: {
            gte: options.startDate,
            lte: options.endDate,
          },
          metricName: options.metrics ? { in: options.metrics } : undefined,
        },
        orderBy: {
          timestamp: 'asc',
        },
      })

      return events.map(event => ({
        timestamp: event.timestamp,
        value: event.value,
        metricName: event.metricName,
        dimensions: event.dimensions as Record<string, string> ?? {},
      }))
    } catch (error) {
      logger.error('Error getting metrics:', error)
      throw error
    }
  }

  // Get real-time metrics for the last hour
  async getRealTimeMetrics(userId: string, metrics?: string[]): Promise<MetricData[]> {
    try {
      const lastHour = subDays(new Date(), 1)

      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          timestamp: {
            gte: lastHour,
          },
          ...(metrics ? { metricName: { in: metrics } } : {}),
        },
        orderBy: {
          timestamp: 'desc',
        },
      })

      return events.map(event => ({
        timestamp: event.timestamp,
        value: event.value,
        metricName: event.metricName,
        dimensions: event.dimensions as Record<string, string> ?? {},
      }))
    } catch (error) {
      logger.error('Error getting real-time metrics:', error)
      throw error
    }
  }

  // Get top dimensions by value
  async getTopDimensions(
    userId: string,
    metricName: string,
    dimension: string,
    limit: number = 10
  ): Promise<TopDimension[]> {
    try {
      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          metricName,
        },
      })

      const dimensionCounts = events.reduce((acc, event) => {
        const dimensions = event.dimensions as Record<string, any> ?? {}
        const dimensionValue = dimensions[dimension]
        if (dimensionValue) {
          acc[dimensionValue] = (acc[dimensionValue] || 0) + event.value
        }
        return acc
      }, {} as Record<string, number>)

      return Object.entries(dimensionCounts)
        .map(([dimension, value]) => ({ dimension, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit)
    } catch (error) {
      logger.error('Error getting top dimensions:', error)
      throw error
    }
  }

  // Get funnel metrics
  async getFunnelMetrics(
    userId: string,
    steps: string[],
    startDate?: Date,
    endDate?: Date
  ): Promise<FunnelStep[]> {
    try {
      if (!steps || !Array.isArray(steps) || steps.length < 2) {
        logger.warn('Invalid funnel steps provided', { userId, steps })
        return []
      }

      const start = startDate || subDays(new Date(), 30)
      const end = endDate || new Date()

      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          metricName: { in: steps },
          timestamp: {
            gte: startOfDay(start),
            lte: endOfDay(end),
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      })

      const stepCounts = steps.reduce((acc, step) => {
        acc[step] = events.filter(event => event.metricName === step).length
        return acc
      }, {} as Record<string, number>)

      const funnelSteps: FunnelStep[] = []
      for (let i = 0; i < steps.length - 1; i++) {
        const fromStep = steps[i]
        const toStep = steps[i + 1]
        const fromCount = stepCounts[fromStep] || 0
        const toCount = stepCounts[toStep] || 0
        const conversionRate = fromCount > 0 ? (toCount / fromCount) * 100 : 0

        funnelSteps.push({
          fromStep,
          toStep,
          conversionRate,
          fromCount,
          toCount,
        })
      }

      return funnelSteps
    } catch (error) {
      logger.error('Error getting funnel metrics:', error)
      throw error
    }
  }

  // Get funnel data for chart
  async getFunnelData(
    userId: string,
    steps: string[],
    startDate?: Date,
    endDate?: Date
  ): Promise<FunnelData[]> {
    try {
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        logger.warn('Invalid funnel steps provided', { userId, steps })
        return []
      }

      const start = startDate || subDays(new Date(), 30)
      const end = endDate || new Date()

      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          metricName: { in: steps },
          timestamp: {
            gte: startOfDay(start),
            lte: endOfDay(end),
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      })

      const colors = [
        '#4F46E5', // Indigo
        '#6366F1', // Indigo lighter
        '#818CF8', // Indigo lightest
        '#A5B4FC', // Indigo ultra light
        '#C7D2FE', // Indigo ultra lighter
      ]

      return steps.map((step, index) => ({
        name: step,
        value: events.filter(event => event.metricName === step).length,
        fill: colors[index % colors.length],
      }))
    } catch (error) {
      logger.error('Error getting funnel data:', error)
      throw error
    }
  }

  // Track a custom event
  async trackEvent(event: { name: string; properties?: Record<string, any> }): Promise<void> {
    try {
      await prisma.event.create({
        data: {
          name: event.name,
          properties: event.properties || {},
          timestamp: new Date(),
        },
      })
    } catch (error) {
      logger.error('Error tracking custom event:', error)
      throw error
    }
  }
}
