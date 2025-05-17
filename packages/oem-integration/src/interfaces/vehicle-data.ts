/**
 * Vehicle data interface containing standard vehicle information
 */
export interface VehicleData {
  // Basic vehicle information
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  color?: string;
  nickname?: string;
  
  // Vehicle specifications
  vehicleType: 'sedan' | 'suv' | 'truck' | 'van' | 'coupe' | 'wagon' | 'hatchback' | 'convertible' | 'other';
  driveType?: 'FWD' | 'RWD' | 'AWD' | '4WD';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plugin_hybrid' | 'hydrogen' | 'other';
  transmissionType?: 'automatic' | 'manual' | 'cvt' | 'dct' | 'single_speed';
  
  // Status information
  odometer: number; // in kilometers
  fuelLevelPercent?: number; // 0-100
  batteryLevelPercent?: number; // 0-100 for EVs
  batteryRange?: number; // in kilometers
  chargeStatus?: {
    isCharging: boolean;
    chargeMode?: 'standard' | 'fast' | 'supercharger';
    timeToFullCharge?: number; // in minutes
    chargingPower?: number; // in kW
    chargeLimit?: number; // in percent
  };
  
  // Location information
  location?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
  };
  
  // Environmental information
  climate?: {
    insideTemp?: number; // in celsius
    outsideTemp?: number; // in celsius
    isClimateOn: boolean;
    targetTemp?: number;
    defrostActive?: boolean;
    fanSpeed?: number;
  };
  
  // Security information
  lockStatus?: {
    isLocked: boolean;
    doorStatus: {
      driverDoor: 'locked' | 'unlocked' | 'open';
      passengerDoor: 'locked' | 'unlocked' | 'open';
      rearDriverDoor?: 'locked' | 'unlocked' | 'open';
      rearPassengerDoor?: 'locked' | 'unlocked' | 'open';
      trunk: 'locked' | 'unlocked' | 'open';
      hood?: 'locked' | 'unlocked' | 'open';
    };
    windowStatus?: {
      driverWindow: 'closed' | 'open' | 'partially_open';
      passengerWindow: 'closed' | 'open' | 'partially_open';
      rearDriverWindow?: 'closed' | 'open' | 'partially_open';
      rearPassengerWindow?: 'closed' | 'open' | 'partially_open';
      sunroof?: 'closed' | 'open' | 'partially_open' | 'tilted';
    };
  };
  
  // Engine information
  engine?: {
    isRunning: boolean;
    rpm?: number;
    oilLife?: number; // in percent
    oilTemp?: number; // in celsius
    coolantTemp?: number; // in celsius
  };
  
  // Tire information
  tires?: {
    frontLeft: {
      pressure: number; // in kPa
      recommended: number; // in kPa
      temperature?: number; // in celsius
    };
    frontRight: {
      pressure: number;
      recommended: number;
      temperature?: number;
    };
    rearLeft: {
      pressure: number;
      recommended: number;
      temperature?: number;
    };
    rearRight: {
      pressure: number;
      recommended: number;
      temperature?: number;
    };
    spare?: {
      pressure: number;
      recommended: number;
      temperature?: number;
    };
  };
  
  // Additional information
  lastUpdated: string; // ISO date string
  remoteCapable: boolean;
  state?: 'online' | 'offline' | 'asleep' | 'unknown';
  
  // OEM-specific data
  oemData?: Record<string, any>;
}