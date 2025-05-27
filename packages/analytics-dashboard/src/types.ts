export interface AnalyticsOptions {
  // Time range options
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  
  // Data granularity
  granularity?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  // Filters
  vehicleTypes?: string[];
  regions?: string[];
  fleetIds?: string[];
  userSegments?: string[];
  
  // Additional options
  includePredictions?: boolean;
  compareWithPreviousPeriod?: boolean;
  realtime?: boolean;
  maxDataPoints?: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: VehicleStatus;
  fleetId?: string;
  lastMaintenance?: string;
  mileage: number;
  location?: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
}

export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service' | 'charging' | 'reserved';

export interface FleetOverviewData {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesByStatus: Record<VehicleStatus, number>;
  vehiclesByType: Record<string, number>;
  averageUtilization: number;
  averageTripDuration: number;
  totalBookings: number;
  revenueToday: number;
  revenueTrend: number; // percentage change
}

export interface UsageData {
  timestamp: string;
  utilizationRate: number;
  bookingCount: number;
  activeVehicles: number;
  totalVehicles: number;
  averageTripDuration: number;
  peakHours: {
    hour: number;
    count: number;
  }[];
}

export interface RevenueData {
  timestamp: string;
  revenue: number;
  costOfOperation: number;
  netIncome: number;
  revenuePerVehicle: number;
  revenueByVehicleType: Record<string, number>;
}

export interface DemandHeatmapPoint {
  lat: number;
  lng: number;
  weight: number; // Demand intensity
}

export interface MaintenancePrediction {
  vehicleId: string;
  vehicleName: string;
  maintenanceProbability: number;
  predictedComponents: {
    component: string;
    probabilityOfFailure: number;
    recommendedAction: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendedDate: string;
  daysUntilMaintenance: number;
  estimatedDowntime: number; // in hours
  estimatedCost: number;
}

export interface OptimizedRoute {
  vehicleId: string;
  route: {
    lat: number;
    lng: number;
    arrivalTime: string;
    destinationName?: string;
  }[];
  distance: number;
  duration: number;
  fuelConsumption: number;
}

export interface KPI {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number; // percentage change
  trendDirection?: 'up' | 'down' | 'stable';
  previousValue?: number | string;
  target?: number;
}

export interface DashboardProps {
  options?: AnalyticsOptions;
  onFilterChange?: (options: AnalyticsOptions) => void;
  onRefresh?: () => void;
  fleetId?: string;
  vehicleId?: string;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  showFilters?: boolean;
  showExport?: boolean;
  theme?: 'light' | 'dark' | 'system';
  customCharts?: React.ReactNode[];
}

export interface DemandForecastData {
  locationName: string;
  timestamp: string;
  predictedDemand: number;
  confidence: number;
  factors: {
    weather: string;
    events: string[];
    timeOfDay: string;
    dayOfWeek: string;
    historicalDemand: number;
  };
  recommendedFleetSize: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  [key: string]: any;
}

export interface RealtimeVehicleData extends Vehicle {
  speed: number;
  heading: number;
  batteryLevel?: number;
  fuelLevel?: number;
  engineStatus?: 'on' | 'off' | 'starting' | 'stopping';
  doorStatus: {
    driver: boolean;
    passenger: boolean;
    rear: boolean;
    trunk: boolean;
  };
  temperatureInside?: number;
  temperatureOutside?: number;
  diagnosticCodes?: string[];
}