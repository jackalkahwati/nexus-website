// Re-export all types with namespacing to avoid conflicts
import * as FleetTypes from './fleet'
import * as MaintenanceTypes from './maintenance'
import * as IntegrationTypes from './integration'
import * as PaymentTypes from './payment'
import * as BookingTypes from './booking'
import * as BillingTypes from './billing'
import * as RouteOptimizationTypes from './route-optimization'
import * as TaskQueueTypes from './task-queue'

export {
  FleetTypes,
  MaintenanceTypes,
  IntegrationTypes,
  PaymentTypes,
  BookingTypes,
  BillingTypes,
  RouteOptimizationTypes,
  TaskQueueTypes
}

// Re-export types that don't have conflicts
export * from './rate-limit'
export * from './logging'
export * from './storage'

// Direct type definitions
export interface Bike {
  id: number
  name: string
  status: 'active' | 'parked' | 'maintenance'
  lastUser: string
  battery: number
  location: {
    lat: number
    lng: number
  }
  model: string
  rideType: 'electric' | 'manual'
  serviceDates: string[]
  vehicleName: string
  qrCode: string
  equipment: string[]
  health: string
  description: string
  dateAdded: string
  lastServiceDate: string
  nextServiceDue: string
  totalKilometerage: number
}

export interface Hub {
  id: number
  name: string
  integrationType: 'Smart' | 'Basic'
  setup: 'Indoor' | 'Outdoor'
  make: string
  model: string
  description: string
  image: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'User'
  domain: string
}

export interface Trip {
  id: number
  user: string
  scooter: string
  distance: string
  duration: string
  start: string
  end: string
  route: [number, number][]
}

export interface Ticket {
  id: number
  type: string
  description: string
  status: 'Open' | 'In Progress' | 'Closed'
  priority: 'High' | 'Medium' | 'Low'
}

export interface RentalFare {
  id: number
  name: string
  type: 'Per Minute' | 'Fixed Duration' | 'Recurring'
  price: number
  duration?: string
  billingCycle?: string
}

export interface ActivityFeedData {
  totalRides: number
  tripsInProgress: number
  ridesOutOfService: number
  latestTickets: number
  totalTickets: number
}

export interface Notification {
  id: number
  title: string
  description: string
  time: string
  read?: boolean
}

export interface DashboardStats {
  totalBikes: number
  activeBikes: number
  lowBatteryBikes: number
  maintenanceBikes: number
  totalUsers: number
  activeUsers: number
  totalTrips: number
  revenue: number
}

export interface NavigationItem {
  icon: React.ComponentType
  label: string
  view: string
}

export interface BikeLocation {
  id: number
  lat: number
  lng: number
  status: 'active' | 'parked' | 'maintenance'
}
