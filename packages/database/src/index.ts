// Export the Prisma client
export * from './prisma-client';

// Re-export types from Prisma
export type {
  User,
  Vehicle,
  Booking,
  Fleet,
  Zone,
  Technician,
  MaintenanceTask,
  Payment,
  LoyaltyAccount,
  Station,
  BookingPolicy,
  InsurancePolicy,
  RebalancingTask,
  DemandForecast,
  // Enums
  UserStatus,
  VehicleStatus,
  BookingStatus,
  BookingType,
  PaymentStatus,
  MaintenanceTaskType,
  MaintenanceTaskPriority,
  MaintenanceTaskStatus,
  TechnicianAvailability,
  StationType,
  RebalancingPriority,
  RebalancingStatus
} from '@prisma/client';

// Export utility functions
export * from './repositories';