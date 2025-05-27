import { MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority } from '@prisma/client'

// Re-export Prisma enums with our preferred names
export enum MaintenanceStatus {
  COMPLETED = 'completed',
  // ... other statuses ...
}

export type MaintenanceType = MaintenanceTaskType
export type ServicePriority = MaintenanceTaskPriority

export interface MaintenanceTask {
  id: string
  vehicleId: string
  type: MaintenanceType
  status: MaintenanceStatus
  priority: ServicePriority
  title: string
  description: string
  scheduledDate: string
  completedDate?: string
  assignedTo?: string
  estimatedDuration: number // in minutes
  actualDuration?: number // in minutes
  cost?: number
  parts?: MaintenancePart[]
  notes?: string[]
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface MaintenancePart {
  id: string
  name: string
  partNumber: string
  quantity: number
  cost: number
  status: 'in_stock' | 'ordered' | 'backordered' | 'installed'
  supplier?: string
  orderDate?: string
  expectedDeliveryDate?: string
}

export interface ServiceHistory {
  id: string
  vehicleId: string
  maintenanceId: string
  type: MaintenanceType
  description: string
  performedBy: string
  performedAt: string
  cost: number
  mileage: number
  parts: MaintenancePart[]
  notes?: string[]
  attachments?: string[]
}

export interface MaintenanceSchedule {
  id: string
  vehicleId: string
  tasks: MaintenanceTask[]
  recurringTasks: RecurringMaintenanceTask[]
  nextServiceDate: string
  lastServiceDate: string
  mileageInterval?: number
  timeInterval?: number // in days
}

export interface RecurringMaintenanceTask {
  id: string
  type: MaintenanceType
  title: string
  description: string
  frequency: {
    type: 'days' | 'weeks' | 'months' | 'miles'
    value: number
  }
  estimatedDuration: number
  estimatedCost: number
  requiredParts: MaintenancePart[]
  priority: ServicePriority
}