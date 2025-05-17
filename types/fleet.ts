export interface FleetStatus {
  active: number
  parked: number
  maintenance: number
  activeChange: number
  parkedChange: number
  maintenanceChange: number
}

export type VehicleStatus = 'Active' | 'Maintenance' | 'Charging' | 'Offline' | 'Reserved' | 'Parked'

export interface VehicleStatusHistory {
  id: string
  vehicleId: string
  status: VehicleStatus
  timestamp: string
}

export type VehicleType = 'Truck' | 'Van' | 'Car' | 'Electric Vehicle' | 'Autonomous Vehicle'
export type EngineStatus = 'Normal' | 'Warning' | 'Critical'
export type MaintenanceType = 'Routine' | 'Repair' | 'Inspection' | 'Emergency'
export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
export type RouteStatus = 'Planned' | 'In Progress' | 'Completed' | 'Delayed'

export interface Location {
  lat: number
  lng: number
  address?: string
  lastUpdated?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  rating: number
}

export interface Telemetry {
  speed: number
  temperature: number
  engineStatus: EngineStatus
  fuelEfficiency: number
}

export interface Vehicle {
  id: string
  name: string
  type: VehicleType
  status: VehicleStatus
  location: Location
  batteryLevel: number
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
  driver?: Driver
  telemetry: Telemetry
}

export interface Route {
  id: string
  name: string
  status: RouteStatus
  startLocation: Location
  endLocation: Location
  waypoints: Location[]
  estimatedDuration: number
  actualDuration?: number
  distance: number
  vehicleId: string
  driverId: string
  createdAt: string
  scheduledAt: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: MaintenanceType
  status: MaintenanceStatus
  description: string
  scheduledDate: string
  completedDate?: string
  cost: number
  technician: {
    id: string
    name: string
    certification: string
  }
  parts: {
    id: string
    name: string
    quantity: number
    cost: number
  }[]
  notes: string
}

export interface Analytics {
  fleetUtilization: number
  activeVehicles: number
  totalRoutes: number
  completedRoutes: number
  averageRouteTime: number
  fuelEfficiency: number
  maintenanceMetrics: {
    scheduled: number
    completed: number
    pending: number
  }
  safetyMetrics: {
    incidents: number
    warnings: number
    safetyScore: number
  }
  costMetrics: {
    fuelCosts: number
    maintenanceCosts: number
    totalOperatingCosts: number
  }
  timeRange: {
    start: string
    end: string
  }
}

export interface FleetData {
  vehicles: Vehicle[]
  routes: Route[]
  analytics: Analytics
  maintenance: MaintenanceRecord[]
}

export type DriverStatus = 'Available' | 'On Route' | 'Off Duty' | 'On Break' | 'Training'
export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'

export interface DriverLicense {
  number: string
  type: string
  expiryDate: string
  issuedDate: string
  restrictions: string[]
}

export interface DriverSchedule {
  weekDay: string
  startTime: string
  endTime: string
  breaks: {
    startTime: string
    endTime: string
  }[]
}

export interface DriverDetails extends Driver {
  status: DriverStatus
  license: DriverLicense
  schedule: DriverSchedule[]
  certifications: string[]
  performanceMetrics: {
    rating: number
    completedTrips: number
    totalHours: number
    safetyScore: number
    onTimeDeliveryRate: number
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

export interface Booking {
  id: string
  vehicleId: string
  driverId: string
  status: BookingStatus
  startTime: string
  endTime: string
  pickupLocation: Location
  dropoffLocation: Location
  customer: {
    id: string
    name: string
    phone: string
    email: string
  }
  route?: Route
  cost: {
    base: number
    distance: number
    time: number
    total: number
    currency: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export type RobotaxiStatus = 'Available' | 'In Transit' | 'Charging' | 'Maintenance' | 'Reserved'
export type AutomationLevel = 'L4' | 'L5'
export type PassengerCapacity = 2 | 4 | 6 | 8

export interface RobotaxiTelemetry extends Telemetry {
  autonomyStatus: 'Active' | 'Standby' | 'Disabled'
  lidarStatus: 'Operational' | 'Degraded' | 'Failed'
  cameraStatus: 'Operational' | 'Degraded' | 'Failed'
  radarStatus: 'Operational' | 'Degraded' | 'Failed'
  softwareVersion: string
  lastCalibration: string
}

export interface RobotaxiVehicle extends Vehicle {
  automationLevel: AutomationLevel
  passengerCapacity: PassengerCapacity
  telemetry: RobotaxiTelemetry
  safetyMetrics: {
    disengagements: number
    incidentFreeHours: number
    safetyScore: number
    lastSafetyAudit: string
  }
  operationalBoundary: {
    geofence: {
      coordinates: [number, number][]
      type: 'Polygon'
    }
    speedLimit: number
    weatherRestrictions: string[]
  }
}

export interface RobotaxiBooking extends Booking {
  autonomyLevel: AutomationLevel
  safetyOperator?: {
    id: string
    name: string
    certification: string
  }
  passengerCount: number
  specialRequirements?: string[]
  routeSafety: {
    riskLevel: 'Low' | 'Medium' | 'High'
    weatherConditions: string
    trafficDensity: string
    roadComplexity: string
  }
}

export type AlertType = 'info' | 'warning' | 'error' | 'maintenance' | 'system'
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus = 'active' | 'resolved' | 'acknowledged' | 'dismissed'

export interface FleetAlert {
  id: string
  vehicleId: string
  type: AlertType
  message: string
  timestamp: string
  status: AlertStatus
  priority: AlertPriority
  metadata?: Record<string, any>
}

export type FleetVehicleStatus = 'active' | 'inactive' | 'maintenance'

export type FleetVehicle = {
  id: string
  name: string
  status: FleetVehicleStatus
  lastKnownLocation?: {
    latitude: number
    longitude: number
    timestamp: string
  }
}

export type FleetMaintenanceRecord = {
  id: string
  vehicleId: string
  type: 'scheduled' | 'unscheduled'
  description: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
  cost?: number
  notes?: string
}

// Base status types
export type BaseStatus = 'active' | 'inactive' | 'maintenance'

// Fleet statistics types
export interface FleetStats {
  total: number
  active: number
  inactive: number
  maintenance: number
  charging: number
  utilization: number
  alerts: {
    high: number
    medium: number
    low: number
  }
  performance: {
    onTime: number
    delayed: number
    cancelled: number
  }
}
