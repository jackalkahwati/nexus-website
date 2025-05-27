/**
 * Diagnostic data interface containing vehicle diagnostic information
 */
export interface DiagnosticData {
  vehicleId: string;
  timestamp: string;
  
  // DTC (Diagnostic Trouble Codes)
  dtcCodes: Array<{
    code: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    system: string;
    timestamp: string;
    status: 'active' | 'pending' | 'history';
  }>;
  
  // Engine diagnostics
  engine?: {
    oilLife: number; // percentage remaining
    oilPressure?: number; // in kPa
    coolantTemp: number; // in celsius
    coolantLevel?: number; // percentage
    engineTemp: number; // in celsius
    rpm?: number;
    load?: number; // percentage
    throttlePosition?: number; // percentage
    maf?: number; // Mass Air Flow in g/s
    intakeTemp?: number; // in celsius
    timing?: number; // in degrees
    engineRuntime?: number; // in hours
  };
  
  // Battery diagnostics (all vehicles)
  battery?: {
    voltage: number; // in volts
    health: number; // percentage
    status: 'good' | 'warning' | 'critical';
    lastReplaced?: string; // ISO date
  };
  
  // EV specific diagnostics (electric vehicles)
  evBattery?: {
    stateOfCharge: number; // percentage
    stateOfHealth: number; // percentage
    range: number; // in kilometers
    cycleCount?: number;
    temperature: number; // in celsius
    chargingStatus?: 'not_charging' | 'charging' | 'regenerating' | 'discharging';
    chargingPower?: number; // in kW
    dischargePower?: number; // in kW
    timeToFullCharge?: number; // in minutes
    fastChargePort?: 'available' | 'in_use' | 'fault';
    lowVoltAlerts?: number; // count
    cells?: Array<{
      id: number;
      voltage: number;
      temperature: number;
      status: 'normal' | 'warning' | 'fault';
    }>;
  };
  
  // Fluid levels
  fluids?: {
    brakeFluid: 'normal' | 'low' | 'critical';
    washerFluid: 'normal' | 'low' | 'empty';
    transmissionFluid?: 'normal' | 'low' | 'critical';
    coolant: 'normal' | 'low' | 'critical';
    adBlue?: 'normal' | 'low' | 'critical'; // Diesel vehicles
  };
  
  // Break system
  brakes?: {
    frontLeft: number; // percentage remaining
    frontRight: number;
    rearLeft: number;
    rearRight: number;
    abs: 'operational' | 'fault';
    handbrake: 'engaged' | 'disengaged' | 'fault';
  };
  
  // Tire diagnostics
  tires?: {
    frontLeft: {
      pressure: number; // in kPa
      recommended: number; // in kPa
      temperature?: number; // in celsius
      treadDepth?: number; // in mm
      status: 'normal' | 'low' | 'high' | 'flat';
    };
    frontRight: {
      pressure: number;
      recommended: number;
      temperature?: number;
      treadDepth?: number;
      status: 'normal' | 'low' | 'high' | 'flat';
    };
    rearLeft: {
      pressure: number;
      recommended: number;
      temperature?: number;
      treadDepth?: number;
      status: 'normal' | 'low' | 'high' | 'flat';
    };
    rearRight: {
      pressure: number;
      recommended: number;
      temperature?: number;
      treadDepth?: number;
      status: 'normal' | 'low' | 'high' | 'flat';
    };
    spare?: {
      pressure: number;
      recommended: number;
      temperature?: number;
      treadDepth?: number;
      status: 'normal' | 'low' | 'high' | 'flat';
    };
    tpms: 'operational' | 'fault';
  };
  
  // Emissions system
  emissions?: {
    status: 'normal' | 'fault';
    o2Sensors: 'normal' | 'fault';
    catalyticConverter: 'normal' | 'fault';
    evaporativeSystems: 'normal' | 'fault';
    egr?: 'normal' | 'fault';
    particulateFilter?: 'normal' | 'regenerating' | 'blocked' | 'fault';
  };
  
  // Lights status
  lights?: {
    headlights: 'operational' | 'fault';
    tailLights: 'operational' | 'fault';
    brakeLights: 'operational' | 'fault';
    turnSignals: 'operational' | 'fault';
    fogLights?: 'operational' | 'fault';
    interiorLights: 'operational' | 'fault';
  };
  
  // Safety systems
  safetySystems?: {
    airbags: 'operational' | 'fault';
    seatbelts: 'operational' | 'fault';
    antitheft: 'operational' | 'disabled' | 'triggered' | 'fault';
    abs: 'operational' | 'fault';
    stabilityControl: 'operational' | 'disabled' | 'fault';
    tractionControl: 'operational' | 'disabled' | 'fault';
    tpms: 'operational' | 'fault';
  };
  
  // ADAS (Advanced Driver Assistance Systems)
  adas?: {
    adaptiveCruiseControl?: 'operational' | 'disabled' | 'fault';
    laneKeepAssist?: 'operational' | 'disabled' | 'fault';
    blindSpotMonitoring?: 'operational' | 'disabled' | 'fault';
    forwardCollisionWarning?: 'operational' | 'disabled' | 'fault';
    automaticEmergencyBraking?: 'operational' | 'disabled' | 'fault';
    parkingSensors?: 'operational' | 'disabled' | 'fault';
    rearCamera?: 'operational' | 'disabled' | 'fault';
    surroundCamera?: 'operational' | 'disabled' | 'fault';
  };
  
  // Connected services
  connectivity?: {
    cellular: 'connected' | 'limited' | 'disconnected';
    wifi?: 'connected' | 'disconnected';
    bluetooth?: 'connected' | 'disconnected';
    gps: 'operational' | 'limited' | 'fault';
    softwareUpdates?: {
      current: string;
      available?: string;
      status: 'up_to_date' | 'update_available' | 'updating';
    };
  };
  
  // Maintenance info
  maintenance?: {
    scheduledItems: Array<{
      id: string;
      type: string;
      description: string;
      dueDate?: string;
      dueDistance?: number; // km remaining
      severity: 'recommended' | 'required' | 'urgent';
    }>;
    recalls: Array<{
      id: string;
      description: string;
      dateIssued: string;
      repaired: boolean;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
  
  // Overall health score (0-100)
  overallHealth: number;
  
  // OEM-specific diagnostic data
  oemDiagnostics?: Record<string, any>;
}