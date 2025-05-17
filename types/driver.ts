export type DriverStatus = 'Available' | 'On Route' | 'Off Duty' | 'On Break' | 'Training'

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

export interface DriverPerformance {
  rating: number
  completedTrips: number
  totalHours: number
  safetyScore: number
  onTimeDeliveryRate: number
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: DriverStatus
  license: DriverLicense
  schedule: DriverSchedule[]
  certifications: string[]
  performanceMetrics: DriverPerformance
  emergencyContact: EmergencyContact
} 