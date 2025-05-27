export type TimeWindow = {
  start: string
  end: string
}

export type OptimizationConstraint = {
  maxStops?: number
  maxDistance?: number
  maxDuration?: number
  vehicleCapacity?: number
  requireReturn?: boolean
  avoidTolls?: boolean
  avoidHighways?: boolean
}

export type Stop = {
  id: string
  address: string
  lat: number
  lng: number
  duration: number // service time in minutes
  timeWindow?: TimeWindow
  priority?: 'high' | 'medium' | 'low'
  type: 'pickup' | 'delivery'
  load?: number // for capacity constraints
  notes?: string
}

export type Vehicle = {
  id: string
  name: string
  startLocation: {
    address: string
    lat: number
    lng: number
  }
  endLocation?: {
    address: string
    lat: number
    lng: number
  }
  capacity?: number
  maxStops?: number
  maxDistance?: number
  maxDuration?: number
  breakTime?: {
    duration: number
    timeWindow?: TimeWindow
  }
  skills?: string[] // special vehicle capabilities
}

export type OptimizationRequest = {
  id: string
  name: string
  date: string
  vehicles: Vehicle[]
  stops: Stop[]
  constraints: OptimizationConstraint
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export type RouteSegment = {
  start: {
    lat: number
    lng: number
  }
  end: {
    lat: number
    lng: number
  }
  distance: number // in meters
  duration: number // in seconds
  polyline: string // encoded polyline
  trafficLevel?: 'low' | 'medium' | 'high'
}

export type OptimizedRoute = {
  vehicleId: string
  stops: (Stop & {
    arrivalTime: string
    departureTime: string
    delay?: number
  })[]
  segments: RouteSegment[]
  metrics: {
    totalDistance: number
    totalDuration: number
    totalStops: number
    totalLoad?: number
    utilization: number
  }
}

export type OptimizationResult = {
  id: string
  routes: OptimizedRoute[]
  unassignedStops?: Stop[]
  metrics: {
    totalDistance: number
    totalDuration: number
    totalStops: number
    totalVehicles: number
    averageUtilization: number
  }
  status: 'success' | 'partial' | 'failed'
  error?: string
} 