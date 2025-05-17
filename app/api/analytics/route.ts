import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/analytics'
import logger from '@/lib/logger'
import { MetricsOptions, AnalyticsQueryParams } from '@/types/analytics'
import { generateAnalytics } from '@/lib/mock/fleet-data'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { VehicleStatus, BookingStatus, MaintenanceTask, MaintenanceTaskStatus } from '@prisma/client'

const analyticsService = new AnalyticsService()

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to last 30 days
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date()

    // Get fleet metrics
    const [
      totalVehicles,
      activeVehicles,
      maintenanceTasks,
      completedBookings,
      totalBookings,
      revenueStats,
    ] = await Promise.all([
      // Total vehicles
      prisma.vehicle.count(),
      
      // Active vehicles
      prisma.vehicle.count({
        where: { status: VehicleStatus.AVAILABLE }
      }),

      // Maintenance stats
      prisma.maintenanceTask.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Completed bookings
      prisma.booking.count({
        where: {
          status: BookingStatus.COMPLETED,
          startTime: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Total bookings
      prisma.booking.count({
        where: {
          startTime: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Revenue stats
      prisma.payment.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          amount: true
        },
        _avg: {
          amount: true
        }
      })
    ])

    // Calculate maintenance metrics
    const maintenanceMetrics = {
      total: maintenanceTasks.length,
      pending: maintenanceTasks.filter(task => task.status === MaintenanceTaskStatus.PENDING).length,
      inProgress: maintenanceTasks.filter(task => task.status === MaintenanceTaskStatus.IN_PROGRESS).length,
      completed: maintenanceTasks.filter(task => task.status === MaintenanceTaskStatus.COMPLETED).length,
      averageCompletionTime: calculateAverageCompletionTime(maintenanceTasks),
      costBreakdown: calculateMaintenanceCosts(maintenanceTasks)
    }

    // Calculate fleet utilization
    const fleetUtilization = completedBookings / (totalVehicles * getDaysBetween(startDate, endDate))

    // Compile analytics response
    const analytics = {
      overview: {
        totalVehicles,
        activeVehicles,
        fleetUtilization: Math.round(fleetUtilization * 100)
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        completionRate: totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0
      },
      maintenance: maintenanceMetrics,
      revenue: {
        total: revenueStats._sum.amount || 0,
        average: revenueStats._avg.amount || 0
      },
      timeRange: {
        start: startDate,
        end: endDate
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// Helper functions
function getDaysBetween(startDate: Date, endDate: Date): number {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

function calculateAverageCompletionTime(tasks: MaintenanceTask[]): number {
  const completedTasks = tasks.filter(task => 
    task.status === MaintenanceTaskStatus.COMPLETED && task.completedAt && task.createdAt
  )
  
  if (completedTasks.length === 0) return 0

  const totalTime = completedTasks.reduce((sum: number, task: MaintenanceTask) => {
    const completionTime = task.completedAt!.getTime() - task.createdAt.getTime()
    return sum + completionTime
  }, 0)

  return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60)) // Convert to hours
}

function calculateMaintenanceCosts(tasks: MaintenanceTask[]): {
  byType: Record<string, number>;
  total: number;
} {
  const costsByType = tasks.reduce((acc: Record<string, number>, task: MaintenanceTask) => {
    const type = task.type.toString()
    if (!acc[type]) acc[type] = 0
    // Note: cost is not in the schema, so we'll use a default of 0
    acc[type] += 0
    return acc
  }, {})

  return {
    byType: costsByType,
    total: Object.values(costsByType).reduce((a: number, b: number) => a + b, 0)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'default', metricName, value, dimensions, metadata } = body

    if (!metricName || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await analyticsService.trackMetric(
      userId,
      metricName,
      value,
      dimensions,
      metadata
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Analytics API error', { error })
    return NextResponse.json(
      { error: 'Failed to track metric' },
      { status: 500 }
    )
  }
}
