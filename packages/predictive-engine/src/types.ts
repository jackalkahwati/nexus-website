import { z } from 'zod';

// General location interface
export interface Location {
  lat: number;
  lng: number;
}

// Demand forecast types
export const DemandFactorsSchema = z.object({
  time: z.string(), // ISO datetime string
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  dayOfWeek: z.number().min(0).max(6),
  isHoliday: z.boolean(),
  isWeekend: z.boolean(),
  weatherCondition: z.enum(['sunny', 'cloudy', 'rainy', 'snowy']).optional(),
  temperature: z.number().optional(),
  nearbyEvents: z.array(z.object({
    name: z.string(),
    attendees: z.number(),
    distance: z.number()
  })).optional(),
  historicalDemand: z.number().optional(),
});

export type DemandFactors = z.infer<typeof DemandFactorsSchema>;

export interface DemandForecast {
  predictedDemand: number;
  confidence: number;
  recommendedFleetSize: number;
}

// Maintenance prediction types
export const VehicleHealthDataSchema = z.object({
  vehicleId: z.string(),
  mileage: z.number(),
  engineHours: z.number(),
  lastMaintenance: z.string(), // ISO date
  fuelLevel: z.number().min(0).max(100).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  oilLife: z.number().min(0).max(100).optional(),
  tirePressure: z.array(z.number()).length(4).optional(),
  brakeWear: z.number().min(0).max(100).optional(),
  engineTemperature: z.number().optional(),
  diagnosticCodes: z.array(z.string()).optional(),
  sensorReadings: z.record(z.string(), z.number()).optional(),
});

export type VehicleHealthData = z.infer<typeof VehicleHealthDataSchema>;

export interface MaintenancePrediction {
  vehicleId: string;
  maintenanceProbability: number;
  predictedIssues: Array<{
    component: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    recommendedAction: string;
  }>;
  recommendedMaintenanceDate: string; // ISO date
  estimatedDowntime: number; // in hours
}

// Dynamic pricing types
export const PricingFactorsSchema = z.object({
  basePrice: z.number(),
  time: z.string(), // ISO datetime string
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  vehicleType: z.string(),
  vehicleAvailability: z.number().min(0).max(100), // percentage
  demandLevel: z.number().min(0).max(100), // percentage
  competitorPricing: z.record(z.string(), z.number()).optional(),
  userType: z.enum(['new', 'returning', 'premium']).optional(),
  distanceFromHighDemand: z.number().optional(),
  specialEvent: z.boolean().optional(),
  weatherFactor: z.number().min(0).max(1).optional(),
});

export type PricingFactors = z.infer<typeof PricingFactorsSchema>;

export interface PricingRecommendation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  demandElasticity: number; // how price affects demand
  expectedUtilization: number; // percentage
  priceBreakdown: {
    basePrice: number;
    demandSurge: number;
    locationFactor: number;
    timeFactor: number;
    specialEventFactor: number;
    weatherFactor: number;
  };
}

// Route optimization types
export const RouteOptimizationRequestSchema = z.object({
  vehicleId: z.string(),
  currentLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  destinations: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    arrivalWindowStart: z.string().optional(), // ISO datetime
    arrivalWindowEnd: z.string().optional(), // ISO datetime
    stayDuration: z.number().optional(), // in minutes
    priority: z.number().min(1).max(10).optional(),
  })),
  optimizationGoal: z.enum(['time', 'distance', 'energy', 'balanced']),
  avoidTolls: z.boolean().optional(),
  avoidHighways: z.boolean().optional(),
  trafficConsideration: z.boolean().optional(),
  vehicleRange: z.number().optional(), // in kilometers
  chargingStations: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    chargingSpeed: z.number().optional(), // kW
  })).optional(),
});

export type RouteOptimizationRequest = z.infer<typeof RouteOptimizationRequestSchema>;

export interface OptimizedRoute {
  waypoints: Array<{
    location: Location;
    arrivalTime: string; // ISO datetime
    departureTime: string; // ISO datetime
    distanceFromPrevious: number; // in meters
    timeFromPrevious: number; // in seconds
    isChargingStop?: boolean;
  }>;
  totalDistance: number; // in meters
  totalTime: number; // in seconds
  estimatedEnergyConsumption: number; // in kWh
  alternateRoutes?: OptimizedRoute[];
}