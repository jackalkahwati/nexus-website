// Base Vehicle Type
export interface Vehicle {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  location: string;
  lastUpdate: string;
  battery: number;
  speed: number;
  driver: string;
}

// Sensor Data Types
export interface SensorData {
  timestamp: string;
  vehicleId: string;
  sensorType: 'lidar' | 'camera' | 'radar' | 'gps';
  data: Record<string, any>;
}

// Vehicle Capability Types
export interface AutonomyCapabilities {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  features: {
    autonomousEmergencyBraking: boolean;
    laneKeeping: boolean;
    adaptiveCruiseControl: boolean;
    selfParking: boolean;
    fullAutonomy: boolean;
  };
  operationalDesignDomain: {
    weatherConditions: string[];
    timeOfDay: string[];
    roadTypes: string[];
    maxSpeed: number;
    geofenceRegions: string[];
  };
}

// Digital Twin Types
export interface DigitalTwinState {
  id: string;
  vehicleId: string;
  timestamp: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  motion: {
    speed: number;
    acceleration: number;
    heading: number;
  };
  systemStatus: {
    batteryLevel: number;
    autonomyLevel: number;
    safetyStatus: 'normal' | 'warning' | 'critical';
    currentMode: 'manual' | 'autonomous' | 'assisted';
  };
  environment: {
    weather: string;
    trafficDensity: number;
    roadConditions: string;
    visibility: number;
  };
}

// V2X Communication Types
export interface V2XMessage {
  messageType: 'BSM' | 'PSM' | 'SPaT' | 'MAP';
  senderId: string;
  receiverId?: string;
  timestamp: string;
  priority: 'emergency' | 'safety' | 'mobility' | 'info';
  payload: Record<string, any>;
}

// Predictive Maintenance Types
export interface MaintenancePrediction {
  vehicleId: string;
  componentId: string;
  componentType: string;
  predictionTimestamp: string;
  failureProbability: number;
  estimatedTimeToFailure: number;
  confidenceScore: number;
  recommendedAction: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Compliance and Safety Types
export interface AutonomyEvent {
  eventId: string;
  vehicleId: string;
  timestamp: string;
  eventType: 'disengagement' | 'handover' | 'emergency' | 'geofenceViolation';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: 'info' | 'warning' | 'critical';
  data: Record<string, any>;
}

// Extended Vehicle Type
export interface AutonomousVehicle extends Vehicle {
  capabilities: AutonomyCapabilities;
  currentMode: 'manual' | 'autonomous' | 'assisted';
  operationalStatus: {
    autonomyEnabled: boolean;
    safetySystemsStatus: Record<string, boolean>;
    sensorStatus: Record<string, 'active' | 'degraded' | 'failed'>;
  };
  lastDisengagement?: {
    timestamp: string;
    reason: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
} 