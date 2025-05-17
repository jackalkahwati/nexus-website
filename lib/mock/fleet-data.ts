import { faker } from '@faker-js/faker'

// Vehicle Types
export const vehicleTypes = ['Truck', 'Van', 'Car', 'Electric Vehicle', 'Autonomous Vehicle']

// Vehicle Status
export const vehicleStatus = ['Active', 'Maintenance', 'Charging', 'Offline', 'Reserved']

// Generate a random vehicle
export const generateVehicle = () => ({
  id: faker.string.uuid(),
  name: `Vehicle-${faker.string.alphanumeric(6).toUpperCase()}`,
  type: faker.helpers.arrayElement(vehicleTypes),
  status: faker.helpers.arrayElement(vehicleStatus),
  location: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  batteryLevel: faker.number.int({ min: 0, max: 100 }),
  mileage: faker.number.int({ min: 0, max: 150000 }),
  lastMaintenance: faker.date.recent({ days: 30 }),
  nextMaintenance: faker.date.soon({ days: 30 }),
  driver: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
  },
  telemetry: {
    speed: faker.number.int({ min: 0, max: 120 }),
    temperature: faker.number.float({ min: 18, max: 25, precision: 0.1 }),
    engineStatus: faker.helpers.arrayElement(['Normal', 'Warning', 'Critical']),
    fuelEfficiency: faker.number.float({ min: 20, max: 40, precision: 0.1 }),
  },
})

// Generate a random route
export const generateRoute = () => ({
  id: faker.string.uuid(),
  name: `Route-${faker.string.alphanumeric(6).toUpperCase()}`,
  status: faker.helpers.arrayElement(['Planned', 'In Progress', 'Completed', 'Delayed']),
  startLocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    address: faker.location.streetAddress(),
  },
  endLocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    address: faker.location.streetAddress(),
  },
  waypoints: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    address: faker.location.streetAddress(),
  })),
  estimatedDuration: faker.number.int({ min: 30, max: 180 }),
  actualDuration: faker.number.int({ min: 30, max: 180 }),
  distance: faker.number.float({ min: 5, max: 100, precision: 0.1 }),
  vehicleId: faker.string.uuid(),
  driverId: faker.string.uuid(),
  createdAt: faker.date.recent(),
  scheduledAt: faker.date.soon(),
})

// Generate analytics data
export const generateAnalytics = () => ({
  fleetUtilization: Number(faker.number.float({ min: 60, max: 95, fractionDigits: 1 })),
  activeVehicles: faker.number.int({ min: 50, max: 200 }),
  totalRoutes: faker.number.int({ min: 100, max: 500 }),
  completedRoutes: faker.number.int({ min: 80, max: 400 }),
  averageRouteTime: faker.number.int({ min: 45, max: 120 }),
  fuelEfficiency: Number(faker.number.float({ min: 25, max: 40, fractionDigits: 1 })),
  maintenanceMetrics: {
    scheduled: faker.number.int({ min: 5, max: 20 }),
    completed: faker.number.int({ min: 3, max: 15 }),
    pending: faker.number.int({ min: 2, max: 10 }),
  },
  safetyMetrics: {
    incidents: faker.number.int({ min: 0, max: 5 }),
    warnings: faker.number.int({ min: 2, max: 15 }),
    safetyScore: Number(faker.number.float({ min: 85, max: 100, fractionDigits: 1 })),
  },
  costMetrics: {
    fuelCosts: Number(faker.number.float({ min: 5000, max: 15000, fractionDigits: 1 })),
    maintenanceCosts: Number(faker.number.float({ min: 2000, max: 8000, fractionDigits: 1 })),
    totalOperatingCosts: Number(faker.number.float({ min: 10000, max: 30000, fractionDigits: 1 })),
  },
  timeRange: {
    start: faker.date.recent(),
    end: faker.date.recent(),
  },
  funnel: [
    {
      fromStep: 'Visit',
      fromCount: faker.number.int({ min: 1000, max: 2000 }),
      toStep: 'Signup',
      toCount: faker.number.int({ min: 500, max: 1000 }),
      conversionRate: Number(faker.number.float({ min: 20, max: 50, fractionDigits: 1 })),
    },
    {
      fromStep: 'Signup',
      fromCount: faker.number.int({ min: 500, max: 1000 }),
      toStep: 'Purchase',
      toCount: faker.number.int({ min: 100, max: 500 }),
      conversionRate: Number(faker.number.float({ min: 10, max: 30, fractionDigits: 1 })),
    },
    {
      fromStep: 'Purchase',
      fromCount: faker.number.int({ min: 100, max: 500 }),
      toStep: 'Repeat',
      toCount: faker.number.int({ min: 50, max: 200 }),
      conversionRate: Number(faker.number.float({ min: 20, max: 40, fractionDigits: 1 })),
    },
  ],
})

// Generate maintenance record
export const generateMaintenanceRecord = () => ({
  id: faker.string.uuid(),
  vehicleId: faker.string.uuid(),
  type: faker.helpers.arrayElement(['Routine', 'Repair', 'Inspection', 'Emergency']),
  status: faker.helpers.arrayElement(['Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  description: faker.lorem.sentence(),
  scheduledDate: faker.date.soon(),
  completedDate: faker.date.recent(),
  cost: faker.number.float({ min: 100, max: 5000, precision: 0.1 }),
  technician: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    certification: faker.helpers.arrayElement(['Level 1', 'Level 2', 'Level 3', 'Master']),
  },
  parts: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    cost: faker.number.float({ min: 50, max: 500, precision: 0.1 }),
  })),
  notes: faker.lorem.paragraph(),
})

export const driverStatus = ['Available', 'On Route', 'Off Duty', 'On Break', 'Training']
export const bookingStatus = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']
export const licenseTypes = ['Class A', 'Class B', 'Class C', 'CDL', 'Special']
export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const certifications = ['Hazmat', 'Tanker', 'Doubles/Triples', 'Passenger Transport', 'Air Brakes']

export const generateDriverLicense = () => ({
  number: faker.string.alphanumeric(10).toUpperCase(),
  type: faker.helpers.arrayElement(licenseTypes),
  expiryDate: faker.date.future().toISOString(),
  issuedDate: faker.date.past().toISOString(),
  restrictions: faker.helpers.arrayElements(['No Night Driving', 'No Highway', 'Corrective Lenses Required'], { min: 0, max: 2 }),
})

export const generateDriverSchedule = () => ({
  weekDay: faker.helpers.arrayElement(weekDays),
  startTime: '08:00',
  endTime: '17:00',
  breaks: [
    {
      startTime: '12:00',
      endTime: '13:00',
    },
  ],
})

export const generateDriverDetails = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  phone: faker.phone.number(),
  rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
  status: faker.helpers.arrayElement(driverStatus),
  license: generateDriverLicense(),
  schedule: Array.from({ length: 5 }, generateDriverSchedule),
  certifications: faker.helpers.arrayElements(certifications, { min: 1, max: 3 }),
  performanceMetrics: {
    rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
    completedTrips: faker.number.int({ min: 100, max: 1000 }),
    totalHours: faker.number.int({ min: 500, max: 5000 }),
    safetyScore: faker.number.float({ min: 85, max: 100, precision: 0.1 }),
    onTimeDeliveryRate: faker.number.float({ min: 90, max: 100, precision: 0.1 }),
  },
  emergencyContact: {
    name: faker.person.fullName(),
    relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
    phone: faker.phone.number(),
  },
})

export const generateBooking = () => ({
  id: faker.string.uuid(),
  vehicleId: faker.string.uuid(),
  driverId: faker.string.uuid(),
  status: faker.helpers.arrayElement(bookingStatus),
  startTime: faker.date.soon().toISOString(),
  endTime: faker.date.soon({ days: 2 }).toISOString(),
  pickupLocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    address: faker.location.streetAddress(),
  },
  dropoffLocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    address: faker.location.streetAddress(),
  },
  customer: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
  },
  route: generateRoute(),
  cost: {
    base: faker.number.float({ min: 20, max: 50, precision: 0.1 }),
    distance: faker.number.float({ min: 10, max: 100, precision: 0.1 }),
    time: faker.number.float({ min: 15, max: 60, precision: 0.1 }),
    total: faker.number.float({ min: 50, max: 200, precision: 0.1 }),
    currency: 'USD',
  },
  notes: faker.helpers.maybe(() => faker.lorem.sentence()),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
})

// Update generateFleetData to include drivers and bookings
export const generateFleetData = (vehicleCount = 10) => ({
  vehicles: Array.from({ length: vehicleCount }, generateVehicle),
  routes: Array.from({ length: Math.ceil(vehicleCount * 1.5) }, generateRoute),
  analytics: generateAnalytics(),
  maintenance: Array.from({ length: Math.ceil(vehicleCount * 0.3) }, generateMaintenanceRecord),
  drivers: Array.from({ length: Math.ceil(vehicleCount * 0.8) }, generateDriverDetails),
  bookings: Array.from({ length: Math.ceil(vehicleCount * 2) }, generateBooking),
})

export const automationLevels: AutomationLevel[] = ['L4', 'L5']
export const passengerCapacities: PassengerCapacity[] = [2, 4, 6, 8]
export const sensorStatus = ['Operational', 'Degraded', 'Failed']
export const autonomyStatus = ['Active', 'Standby', 'Disabled']
export const riskLevels = ['Low', 'Medium', 'High']
export const weatherConditions = ['Clear', 'Rain', 'Snow', 'Fog', 'Wind']
export const trafficDensity = ['Light', 'Moderate', 'Heavy']
export const roadComplexity = ['Simple', 'Moderate', 'Complex']

export const generateRobotaxiTelemetry = () => ({
  ...generateVehicle().telemetry,
  autonomyStatus: faker.helpers.arrayElement(autonomyStatus),
  lidarStatus: faker.helpers.arrayElement(sensorStatus),
  cameraStatus: faker.helpers.arrayElement(sensorStatus),
  radarStatus: faker.helpers.arrayElement(sensorStatus),
  softwareVersion: `v${faker.system.semver()}`,
  lastCalibration: faker.date.recent().toISOString(),
})

export const generateRobotaxiVehicle = () => ({
  ...generateVehicle(),
  type: 'Autonomous Vehicle',
  automationLevel: faker.helpers.arrayElement(automationLevels),
  passengerCapacity: faker.helpers.arrayElement(passengerCapacities),
  telemetry: generateRobotaxiTelemetry(),
  safetyMetrics: {
    disengagements: faker.number.int({ min: 0, max: 10 }),
    incidentFreeHours: faker.number.int({ min: 1000, max: 10000 }),
    safetyScore: faker.number.float({ min: 90, max: 100, precision: 0.1 }),
    lastSafetyAudit: faker.date.recent().toISOString(),
  },
  operationalBoundary: {
    geofence: {
      type: 'Polygon',
      coordinates: Array.from({ length: 4 }, () => [
        faker.location.longitude(),
        faker.location.latitude(),
      ]),
    },
    speedLimit: faker.number.int({ min: 25, max: 70 }),
    weatherRestrictions: faker.helpers.arrayElements(weatherConditions, { min: 1, max: 3 }),
  },
})

export const generateRobotaxiBooking = () => ({
  ...generateBooking(),
  autonomyLevel: faker.helpers.arrayElement(automationLevels),
  safetyOperator: faker.helpers.maybe(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    certification: faker.helpers.arrayElement(['Level 1', 'Level 2', 'Level 3']),
  })),
  passengerCount: faker.number.int({ min: 1, max: 6 }),
  specialRequirements: faker.helpers.maybe(() => 
    faker.helpers.arrayElements([
      'Wheelchair Access',
      'Child Seat',
      'Extra Luggage Space',
      'Pet Friendly',
    ], { min: 1, max: 2 })
  ),
  routeSafety: {
    riskLevel: faker.helpers.arrayElement(riskLevels),
    weatherConditions: faker.helpers.arrayElement(weatherConditions),
    trafficDensity: faker.helpers.arrayElement(trafficDensity),
    roadComplexity: faker.helpers.arrayElement(roadComplexity),
  },
})

// Update generateFleetData to include robotaxi vehicles and bookings
export const generateRobotaxiFleetData = (vehicleCount = 10) => ({
  vehicles: Array.from({ length: vehicleCount }, generateRobotaxiVehicle),
  routes: Array.from({ length: Math.ceil(vehicleCount * 1.5) }, generateRoute),
  analytics: generateAnalytics(),
  maintenance: Array.from({ length: Math.ceil(vehicleCount * 0.3) }, generateMaintenanceRecord),
  drivers: Array.from({ length: Math.ceil(vehicleCount * 0.8) }, generateDriverDetails),
  bookings: Array.from({ length: Math.ceil(vehicleCount * 2) }, generateRobotaxiBooking),
}) 