import { Vehicle, MaintenanceTask, MaintenanceTaskType, MaintenanceTaskStatus, MaintenanceTaskPriority } from '@prisma/client'
import { differenceInDays, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns'
import { prisma, withPrisma } from './prisma'

interface MaintenanceMetrics {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  completionRate: number
  averageCompletionTime: number
  tasksByPriority: Record<MaintenanceTaskPriority, number>
  tasksByType: Record<MaintenanceTaskType, number>
  monthlyCompletion: {
    completed: number
    total: number
    rate: number
  }
}

interface MaintenanceThresholds {
  critical: { days: number; mileage: number }
  high: { days: number; mileage: number }
  medium: { days: number; mileage: number }
}

export async function calculateMaintenanceMetrics(
  where: any = {}
): Promise<MaintenanceMetrics> {
  return withPrisma(async (prisma) => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Get all tasks matching the filter
    const tasks = await prisma.maintenanceTask.findMany({
      where,
    })

    // Calculate basic metrics
    const total = tasks.length
    const pending = tasks.filter((task) => task.status === MaintenanceTaskStatus.PENDING).length
    const inProgress = tasks.filter((task) => task.status === MaintenanceTaskStatus.IN_PROGRESS).length
    const completed = tasks.filter((task) => task.status === MaintenanceTaskStatus.COMPLETED).length
    const overdue = tasks.filter((task) => 
      task.status !== MaintenanceTaskStatus.COMPLETED && 
      task.dueDate && 
      isBefore(new Date(task.dueDate), now)
    ).length

    // Calculate completion rate
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    // Calculate average completion time
    const completedTasks = tasks.filter((task) => 
      task.status === MaintenanceTaskStatus.COMPLETED && task.completedAt
    )
    const totalCompletionTime = completedTasks.reduce((sum, task) => {
      if (!task.completedAt) return sum
      const completionTime = differenceInDays(
        new Date(task.completedAt),
        new Date(task.createdAt)
      )
      return sum + completionTime
    }, 0)
    const averageCompletionTime = completedTasks.length > 0
      ? totalCompletionTime / completedTasks.length
      : 0

    // Calculate tasks by priority
    const tasksByPriority = tasks.reduce((acc: Record<MaintenanceTaskPriority, number>, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<MaintenanceTaskPriority, number>)

    // Calculate tasks by type
    const tasksByType = tasks.reduce((acc: Record<MaintenanceTaskType, number>, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    }, {} as Record<MaintenanceTaskType, number>)

    // Calculate monthly completion rate
    const monthlyTasks = tasks.filter((task) =>
      isAfter(new Date(task.createdAt), monthStart) && isBefore(new Date(task.createdAt), monthEnd)
    )
    const monthlyCompleted = monthlyTasks.filter((task) => task.status === MaintenanceTaskStatus.COMPLETED).length
    const monthlyTotal = monthlyTasks.length
    const monthlyRate = monthlyTotal > 0 ? (monthlyCompleted / monthlyTotal) * 100 : 0

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      completionRate,
      averageCompletionTime,
      tasksByPriority,
      tasksByType,
      monthlyCompletion: {
        completed: monthlyCompleted,
        total: monthlyTotal,
        rate: monthlyRate,
      },
    }
  })
}

function getMaintenanceThresholds(taskType: MaintenanceTaskType): MaintenanceThresholds {
  switch (taskType) {
    case 'ROUTINE':
      return {
        critical: { days: 120, mileage: 7500 },
        high: { days: 90, mileage: 5000 },
        medium: { days: 60, mileage: 3000 }
      }
    case 'INSPECTION':
      return {
        critical: { days: 210, mileage: 15000 },
        high: { days: 180, mileage: 12000 },
        medium: { days: 150, mileage: 10000 }
      }
    case 'REPAIR':
      return {
        critical: { days: 450, mileage: 25000 },
        high: { days: 365, mileage: 20000 },
        medium: { days: 300, mileage: 15000 }
      }
    default:
      return {
        critical: { days: 120, mileage: 7500 },
        high: { days: 90, mileage: 5000 },
        medium: { days: 60, mileage: 3000 }
      }
  }
}

function calculateMileageAdjustment(vehicle: Vehicle): number {
  // Only calculate if we have both creation date and mileage
  if (!vehicle.createdAt || typeof vehicle.mileage !== 'number') {
    return 1.0 // Return default adjustment if we can't calculate
  }
  
  const averageDailyMileage = vehicle.mileage / differenceInDays(new Date(), vehicle.createdAt)
  const baselineMileage = 100 // miles per day

  return Math.max(0.5, Math.min(1.5, averageDailyMileage / baselineMileage))
}

export function predictNextMaintenance(
  vehicle: Vehicle,
  maintenanceHistory: MaintenanceTask[]
): Date | null {
  if (!vehicle || !maintenanceHistory.length) {
    return null
  }

  // Calculate average time between maintenance tasks
  const intervals = []
  for (let i = 1; i < maintenanceHistory.length; i++) {
    if (maintenanceHistory[i].completedAt && maintenanceHistory[i - 1].completedAt) {
      const days = differenceInDays(
        maintenanceHistory[i].completedAt,
        maintenanceHistory[i - 1].completedAt
      )
      intervals.push(days)
    }
  }

  if (!intervals.length) {
    return null
  }

  // Calculate average interval
  const averageInterval = intervals.reduce((sum, days) => sum + days, 0) / intervals.length

  // Get the last maintenance date
  const lastTask = maintenanceHistory[maintenanceHistory.length - 1]
  if (!lastTask.completedAt) return null

  // Predict next maintenance based on average interval and vehicle usage
  const baseNextDate = new Date(lastTask.completedAt)
  baseNextDate.setDate(baseNextDate.getDate() + averageInterval)

  // Adjust based on vehicle usage (mileage)
  const mileageAdjustment = calculateMileageAdjustment(vehicle)
  const adjustedDays = averageInterval * mileageAdjustment

  const predictedDate = new Date(lastTask.completedAt)
  predictedDate.setDate(predictedDate.getDate() + adjustedDays)

  return predictedDate
}

export function calculateMaintenancePriority(
  vehicle: Vehicle,
  taskType: MaintenanceTaskType,
  lastMaintenance: Date | null
): MaintenanceTaskPriority {
  const now = new Date()
  
  // If no last maintenance, consider it high priority
  if (!lastMaintenance) {
    return MaintenanceTaskPriority.HIGH
  }

  // Ensure we're working with Date objects
  const lastMaintenanceDate = new Date(lastMaintenance)
  const daysSinceLastMaintenance = differenceInDays(now, lastMaintenanceDate)
  const mileageSinceLastMaintenance = vehicle.mileage - (vehicle.lastMaintenanceMileage || 0)

  // Define thresholds based on task type
  const thresholds = getMaintenanceThresholds(taskType)

  // Calculate priority based on time and mileage
  if (daysSinceLastMaintenance > thresholds.critical.days ||
      mileageSinceLastMaintenance > thresholds.critical.mileage) {
    return MaintenanceTaskPriority.CRITICAL
  }

  if (daysSinceLastMaintenance > thresholds.high.days ||
      mileageSinceLastMaintenance > thresholds.high.mileage) {
    return MaintenanceTaskPriority.HIGH
  }

  if (daysSinceLastMaintenance > thresholds.medium.days ||
      mileageSinceLastMaintenance > thresholds.medium.mileage) {
    return MaintenanceTaskPriority.MEDIUM
  }

  return MaintenanceTaskPriority.LOW
} 