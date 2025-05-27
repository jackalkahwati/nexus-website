import { MaintenanceTaskType, MaintenanceTaskPriority, MaintenanceTaskStatus } from '@prisma/client'
import { addDays, isAfter, isBefore, differenceInDays } from 'date-fns'
import { prisma, withPrisma } from './prisma'

interface MaintenanceRule {
  type: MaintenanceTaskType
  frequency: number // in days
  priority: MaintenanceTaskPriority
  mileageThreshold?: number
}

const MAINTENANCE_RULES: MaintenanceRule[] = [
  {
    type: 'ROUTINE',
    frequency: 90, // Every 3 months
    priority: MaintenanceTaskPriority.MEDIUM,
    mileageThreshold: 5000,
  },
  {
    type: 'INSPECTION',
    frequency: 180, // Every 6 months
    priority: MaintenanceTaskPriority.LOW,
  },
  {
    type: 'REPAIR',
    frequency: 365, // Yearly major check
    priority: MaintenanceTaskPriority.HIGH,
    mileageThreshold: 20000,
  },
]

export async function createMaintenanceSchedule(
  vehicleId: string,
  templateId: string,
  frequency: number
) {
  return withPrisma(async (prisma) => {
    return prisma.maintenanceSchedule.create({
      data: {
        vehicleId,
        templateId,
        frequency,
        nextScheduled: addDays(new Date(), frequency),
      },
      include: {
        vehicle: true,
        template: true,
      },
    })
  })
}

export async function checkAndScheduleMaintenance() {
  return withPrisma(async (prisma) => {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        maintenanceSchedules: {
          include: {
            template: true,
          },
        },
        maintenanceTasks: {
          where: {
            status: { in: [MaintenanceTaskStatus.PENDING, MaintenanceTaskStatus.IN_PROGRESS] },
          },
        },
      },
    })

    const newTasks = []

    for (const vehicle of vehicles) {
      // Check each maintenance rule
      for (const rule of MAINTENANCE_RULES) {
        // Skip if there are pending tasks of this type
        const hasPendingTask = vehicle.maintenanceTasks.some(
          task => task.type === rule.type
        )
        if (hasPendingTask) continue

        // Check if maintenance is due based on time or mileage
        const lastMaintenance = vehicle.lastMaintenance || vehicle.createdAt
        if (!lastMaintenance) continue // Skip if we can't determine last maintenance

        const daysSinceLastMaintenance = differenceInDays(new Date(), new Date(lastMaintenance))
        const mileageSinceLastMaintenance = vehicle.mileage - (vehicle.lastMaintenanceMileage || 0)

        if (
          daysSinceLastMaintenance >= rule.frequency ||
          (rule.mileageThreshold && mileageSinceLastMaintenance >= rule.mileageThreshold)
        ) {
          try {
            // Find suitable template
            const template = await prisma.maintenanceTemplate.findFirst({
              where: {
                type: rule.type,
              },
            })

            if (template) {
              // Create maintenance task
              const task = await prisma.maintenanceTask.create({
                data: {
                  title: `${rule.type} Maintenance - ${vehicle.name}`,
                  description: `Scheduled ${rule.type.toLowerCase()} maintenance`,
                  type: rule.type,
                  priority: rule.priority,
                  vehicleId: vehicle.id,
                  templateId: template.id,
                  dueDate: addDays(new Date(), 7), // Due in a week
                },
              })

              newTasks.push(task)
            }
          } catch (error) {
            console.error(`Failed to create maintenance task for vehicle ${vehicle.id}:`, error)
            // Continue with other rules/vehicles even if one fails
            continue
          }
        }
      }
    }

    return newTasks
  })
}

export async function updateMaintenanceSchedules() {
  return withPrisma(async (prisma) => {
    const schedules = await prisma.maintenanceSchedule.findMany({
      where: {
        isActive: true,
        nextScheduled: {
          lte: new Date(),
        },
      },
      include: {
        vehicle: true,
        template: true,
      },
    })

    const updatedSchedules = []

    for (const schedule of schedules) {
      // Create maintenance task
      const task = await prisma.maintenanceTask.create({
        data: {
          title: `Scheduled Maintenance - ${schedule.vehicle.name}`,
          description: schedule.template.description || 'Regular scheduled maintenance',
          type: schedule.template.type,
          priority: MaintenanceTaskPriority.MEDIUM,
          vehicleId: schedule.vehicle.id,
          templateId: schedule.template.id,
          dueDate: addDays(new Date(), 7), // Due in a week
        },
      })

      // Update schedule
      const updatedSchedule = await prisma.maintenanceSchedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          lastScheduled: new Date(),
          nextScheduled: addDays(new Date(), schedule.frequency),
        },
      })

      updatedSchedules.push({ schedule: updatedSchedule, task })
    }

    return updatedSchedules
  })
}

export async function optimizeMaintenanceSchedule(vehicleId: string) {
  return withPrisma(async (prisma) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        maintenanceTasks: {
          where: {
            status: MaintenanceTaskStatus.COMPLETED,
            completedAt: { not: null }
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!vehicle) {
      throw new Error('Vehicle not found')
    }

    // Analyze maintenance history
    const completedTasks = vehicle.maintenanceTasks
    if (completedTasks.length < 2) {
      return null // Not enough history for optimization
    }

    // Calculate average time between maintenance tasks
    let totalDays = 0
    let validIntervals = 0

    for (let i = 1; i < completedTasks.length; i++) {
      const currentTask = completedTasks[i]
      const previousTask = completedTasks[i-1]
      
      if (currentTask.completedAt && previousTask.completedAt) {
        const days = differenceInDays(
          new Date(previousTask.completedAt),
          new Date(currentTask.completedAt)
        )
        if (days > 0) {
          totalDays += days
          validIntervals++
        }
      }
    }

    if (validIntervals === 0) {
      return null // No valid intervals found
    }

    const averageDays = Math.round(totalDays / validIntervals)

    try {
      // Update maintenance schedules with optimized frequency
      const schedules = await prisma.maintenanceSchedule.findMany({
        where: {
          vehicleId,
          isActive: true,
        },
      })

      const updates = []
      for (const schedule of schedules) {
        // Adjust frequency based on maintenance history
        const adjustedFrequency = Math.max(averageDays, Math.floor(schedule.frequency * 0.8))
        
        const update = await prisma.maintenanceSchedule.update({
          where: { id: schedule.id },
          data: {
            frequency: adjustedFrequency,
            nextScheduled: addDays(new Date(), adjustedFrequency),
          },
        })
        
        updates.push(update)
      }

      return updates
    } catch (error) {
      console.error(`Failed to optimize maintenance schedule for vehicle ${vehicleId}:`, error)
      throw error // Re-throw to be handled by the caller
    }
  })
} 