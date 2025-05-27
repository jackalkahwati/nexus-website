import { VehicleData } from './vehicle-data';
import { DiagnosticData } from './diagnostic-data';

/**
 * Configuration options for OEM adapters
 */
export interface OEMAdapterConfig {
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  timeout?: number;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  region?: 'NA' | 'EU' | 'APAC';
  useSandbox?: boolean;
  credentials?: Record<string, string>;
}

/**
 * OEM Integration authorization result
 */
export interface AuthResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
}

/**
 * Location data
 */
export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: string;
}

/**
 * Lock status
 */
export interface LockStatus {
  overall: boolean;
  doors: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  };
  trunk: boolean;
  frunk?: boolean; // Front trunk for applicable vehicles
}

/**
 * Door status
 */
export interface DoorStatus {
  frontLeft: boolean;
  frontRight: boolean;
  rearLeft: boolean;
  rearRight: boolean;
  trunk: boolean;
  hood: boolean;
  windows: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  };
}

/**
 * Command response for vehicle actions
 */
export interface CommandResponse {
  success: boolean;
  message?: string;
  timestamp: string;
  requestId?: string;
  commandId?: string;
  status?: 'PENDING' | 'EXECUTING' | 'SUCCESSFUL' | 'FAILED';
}

/**
 * Base OEM interface that all adapter implementations must follow
 */
export interface OEMInterface {
  /**
   * Initialize the adapter with configuration options
   */
  initialize(config: OEMAdapterConfig): Promise<void>;
  
  /**
   * Authenticate with the OEM service
   */
  authenticate(): Promise<AuthResult>;
  
  /**
   * Get list of vehicles associated with the account
   */
  getVehicles(): Promise<string[]>;
  
  /**
   * Get detailed vehicle data
   */
  getVehicleData(vehicleId: string): Promise<VehicleData>;
  
  /**
   * Get diagnostic data for the vehicle
   */
  getDiagnosticData(vehicleId: string): Promise<DiagnosticData>;
  
  /**
   * Get current vehicle location
   */
  getLocation(vehicleId: string): Promise<Location>;
  
  /**
   * Get current vehicle lock status
   */
  getLockStatus(vehicleId: string): Promise<LockStatus>;
  
  /**
   * Lock the vehicle
   */
  lockVehicle(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Unlock the vehicle
   */
  unlockVehicle(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Start the vehicle (if supported)
   */
  startVehicle?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Stop the vehicle (if supported)
   */
  stopVehicle?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Start charging (for electric vehicles)
   */
  startCharging?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Stop charging (for electric vehicles)
   */
  stopCharging?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Set charging limit (for electric vehicles)
   */
  setChargingLimit?(vehicleId: string, limit: number): Promise<CommandResponse>;
  
  /**
   * Set climate temperature
   */
  setClimateTemperature?(vehicleId: string, temperature: number): Promise<CommandResponse>;
  
  /**
   * Start climate system
   */
  startClimate?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Stop climate system
   */
  stopClimate?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Honk horn
   */
  honkHorn?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Flash lights
   */
  flashLights?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Get door status
   */
  getDoorStatus?(vehicleId: string): Promise<DoorStatus>;
  
  /**
   * Get tire pressure
   */
  getTirePressure?(vehicleId: string): Promise<{ [key: string]: number }>;
  
  /**
   * Get vehicle wake state
   */
  isVehicleAwake?(vehicleId: string): Promise<boolean>;
  
  /**
   * Wake up vehicle
   */
  wakeVehicle?(vehicleId: string): Promise<CommandResponse>;
  
  /**
   * Close the adapter connection and clean up resources
   */
  close(): Promise<void>;
}