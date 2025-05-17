/**
 * This file generates an expanded business logic graph for visualization
 * with hundreds of nodes representing a realistic enterprise application
 */

const fs = require('fs');
const path = require('path');

// Database path configuration
const DB_DIR = path.join(process.cwd(), 'data', 'graph-db');
const NODES_FILE = path.join(DB_DIR, 'nodes.json');
const RELS_FILE = path.join(DB_DIR, 'relationships.json');

// Ensure the directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log(`Created database directory: ${DB_DIR}`);
}

// Node type definitions for a fleet management system
const nodeTypes = {
  FILE: 'File',
  MODULE: 'Module',
  CLASS: 'Class',
  INTERFACE: 'Interface',
  METHOD: 'Method',
  FUNCTION: 'Function',
  ENUM: 'Enum',
  CONSTANT: 'Constant',
  TYPE: 'Type',
  COMPONENT: 'Component',
  SERVICE: 'Service',
  MODEL: 'Model',
  REPOSITORY: 'Repository',
  CONTROLLER: 'Controller',
  MIDDLEWARE: 'Middleware',
  UTIL: 'Util',
  HOOK: 'Hook',
  CONTEXT: 'Context',
  REDUCER: 'Reducer',
  SAGA: 'Saga',
  EVENT: 'Event',
  STORE: 'Store',
  API: 'Api',
  ROUTE: 'Route',
  CONFIG: 'Config'
};

// Relationship type definitions
const relationTypes = {
  IMPORTS: 'IMPORTS',
  EXPORTS: 'EXPORTS',
  EXTENDS: 'EXTENDS',
  IMPLEMENTS: 'IMPLEMENTS',
  CALLS: 'CALLS',
  CONTAINS: 'CONTAINS',
  USES: 'USES',
  DEPENDS_ON: 'DEPENDS_ON',
  REFERENCES: 'REFERENCES',
  INSTANTIATES: 'INSTANTIATES',
  SUBSCRIBES_TO: 'SUBSCRIBES_TO',
  DISPATCHES: 'DISPATCHES',
  HANDLES: 'HANDLES'
};

// Domain areas (for organizing nodes)
const domains = {
  VEHICLE: 'Vehicle',
  DRIVER: 'Driver',
  ROUTE: 'Route',
  BOOKING: 'Booking',
  CUSTOMER: 'Customer',
  PAYMENT: 'Payment',
  NOTIFICATION: 'Notification',
  MAINTENANCE: 'Maintenance',
  TELEMETRY: 'Telemetry',
  ANALYTICS: 'Analytics',
  SECURITY: 'Security',
  USER: 'User',
  ADMIN: 'Admin',
  REPORT: 'Report',
  FLEET: 'Fleet'
};

// Generate a large set of business-focused nodes
function generateBusinessNodes(projectId) {
  let nodes = [];
  let nodeId = 1;
  
  // Helper function to add a node
  function addNode(type, name, path, domain, properties = {}) {
    nodes.push({
      identity: String(nodeId),
      labels: [type],
      properties: {
        name,
        path,
        domain,
        projectId,
        ...properties
      }
    });
    return nodeId++;
  }

  // Create base structure files
  const indexId = addNode(nodeTypes.FILE, 'index.ts', '/src/index.ts', 'Core');
  
  // Config files
  const configId = addNode(nodeTypes.FILE, 'config.ts', '/src/config/index.ts', 'Core');
  const envConfigId = addNode(nodeTypes.FILE, 'env.ts', '/src/config/env.ts', 'Core');
  const dbConfigId = addNode(nodeTypes.FILE, 'database.ts', '/src/config/database.ts', 'Core');
  const authConfigId = addNode(nodeTypes.FILE, 'auth.ts', '/src/config/auth.ts', 'Core');
  
  // Shared utilities
  const utilsId = addNode(nodeTypes.FILE, 'utils.ts', '/src/utils/index.ts', 'Core');
  const loggerUtilId = addNode(nodeTypes.FILE, 'logger.ts', '/src/utils/logger.ts', 'Core');
  const dateUtilId = addNode(nodeTypes.FILE, 'dates.ts', '/src/utils/dates.ts', 'Core');
  const validationUtilId = addNode(nodeTypes.FILE, 'validation.ts', '/src/utils/validation.ts', 'Core');
  const geoUtilId = addNode(nodeTypes.FILE, 'geo.ts', '/src/utils/geo.ts', 'Core');
  
  // Middleware
  const middlewareId = addNode(nodeTypes.FILE, 'middleware.ts', '/src/middleware/index.ts', 'Core');
  const authMiddlewareId = addNode(nodeTypes.FILE, 'auth.middleware.ts', '/src/middleware/auth.middleware.ts', 'Security');
  const loggingMiddlewareId = addNode(nodeTypes.FILE, 'logging.middleware.ts', '/src/middleware/logging.middleware.ts', 'Core');
  const errorMiddlewareId = addNode(nodeTypes.FILE, 'error.middleware.ts', '/src/middleware/error.middleware.ts', 'Core');
  
  // Database
  const dbId = addNode(nodeTypes.FILE, 'database.ts', '/src/database/index.ts', 'Core');
  const modelsId = addNode(nodeTypes.FILE, 'models.ts', '/src/database/models/index.ts', 'Core');
  const reposId = addNode(nodeTypes.FILE, 'repositories.ts', '/src/database/repositories/index.ts', 'Core');
  
  // Now create domain-specific files for each domain
  Object.entries(domains).forEach(([key, domain]) => {
    // Add routes file
    const routeId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.routes.ts`, `/src/routes/${domain.toLowerCase()}.routes.ts`, domain);
    
    // Add controller
    const controllerId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.controller.ts`, `/src/controllers/${domain.toLowerCase()}.controller.ts`, domain);
    
    // Add service
    const serviceId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.service.ts`, `/src/services/${domain.toLowerCase()}.service.ts`, domain);
    
    // Add model
    const modelId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.model.ts`, `/src/models/${domain.toLowerCase()}.model.ts`, domain);
    
    // Add repository
    const repoId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.repository.ts`, `/src/repositories/${domain.toLowerCase()}.repository.ts`, domain);
    
    // Add types
    const typesId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.types.ts`, `/src/types/${domain.toLowerCase()}.types.ts`, domain);
    
    // Add hooks (for frontend)
    const hooksId = addNode(nodeTypes.FILE, `use${domain}.ts`, `/src/hooks/use${domain}.ts`, domain);
    
    // Add component (for frontend)
    const componentId = addNode(nodeTypes.FILE, `${domain}Component.tsx`, `/src/components/${domain.toLowerCase()}/${domain}Component.tsx`, domain);
    
    // Add utilities specific to this domain
    const domainUtilsId = addNode(nodeTypes.FILE, `${domain.toLowerCase()}.utils.ts`, `/src/utils/${domain.toLowerCase()}.utils.ts`, domain);
  });
  
  // Add specific business logic classes and functions (30-50 per domain)
  // Vehicle domain
  const vehicleModelId = addNode(nodeTypes.CLASS, 'VehicleModel', '/src/models/vehicle.model.ts', domains.VEHICLE);
  const vehicleServiceId = addNode(nodeTypes.CLASS, 'VehicleService', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'getVehicleById', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'getAllVehicles', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'createVehicle', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'updateVehicle', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'deleteVehicle', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'assignVehicleToDriver', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'trackVehicleLocation', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'getVehicleStatus', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'getVehicleUtilization', '/src/services/vehicle.service.ts', domains.VEHICLE);
  addNode(nodeTypes.METHOD, 'scheduleVehicleMaintenance', '/src/services/vehicle.service.ts', domains.VEHICLE);
  
  // Add classes for vehicle subsystems
  addNode(nodeTypes.CLASS, 'VehicleLocationTracker', '/src/services/vehicle/location-tracker.ts', domains.VEHICLE);
  addNode(nodeTypes.CLASS, 'VehicleDiagnostics', '/src/services/vehicle/diagnostics.ts', domains.VEHICLE);
  addNode(nodeTypes.CLASS, 'VehicleTelemetry', '/src/services/vehicle/telemetry.ts', domains.VEHICLE);
  addNode(nodeTypes.CLASS, 'FuelManagement', '/src/services/vehicle/fuel-management.ts', domains.VEHICLE);
  addNode(nodeTypes.CLASS, 'VehicleRegistration', '/src/services/vehicle/registration.ts', domains.VEHICLE);
  addNode(nodeTypes.CLASS, 'VehicleInsurance', '/src/services/vehicle/insurance.ts', domains.VEHICLE);
  
  // Maintenance domain
  const maintenanceModelId = addNode(nodeTypes.CLASS, 'MaintenanceModel', '/src/models/maintenance.model.ts', domains.MAINTENANCE);
  const maintenanceServiceId = addNode(nodeTypes.CLASS, 'MaintenanceService', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'scheduleMaintenance', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'completeMaintenance', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'getMaintenanceHistory', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'getPendingMaintenance', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'predictMaintenance', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'assignTechnician', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  addNode(nodeTypes.METHOD, 'estimateMaintenanceCost', '/src/services/maintenance.service.ts', domains.MAINTENANCE);
  
  // Add maintenance-related classes
  addNode(nodeTypes.CLASS, 'MaintenanceScheduler', '/src/services/maintenance/scheduler.ts', domains.MAINTENANCE);
  addNode(nodeTypes.CLASS, 'MaintenancePrediction', '/src/services/maintenance/prediction.ts', domains.MAINTENANCE);
  addNode(nodeTypes.CLASS, 'PartsInventory', '/src/services/maintenance/parts-inventory.ts', domains.MAINTENANCE);
  addNode(nodeTypes.CLASS, 'ServiceHistory', '/src/services/maintenance/service-history.ts', domains.MAINTENANCE);
  
  // Driver domain
  const driverModelId = addNode(nodeTypes.CLASS, 'DriverModel', '/src/models/driver.model.ts', domains.DRIVER);
  const driverServiceId = addNode(nodeTypes.CLASS, 'DriverService', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'getDriverById', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'getAllDrivers', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'createDriver', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'updateDriver', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'deleteDriver', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'assignVehicle', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'trackDriverLocation', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'getDriverAvailability', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'getDriverSchedule', '/src/services/driver.service.ts', domains.DRIVER);
  addNode(nodeTypes.METHOD, 'validateDriverLicense', '/src/services/driver.service.ts', domains.DRIVER);
  
  // Booking domain
  const bookingModelId = addNode(nodeTypes.CLASS, 'BookingModel', '/src/models/booking.model.ts', domains.BOOKING);
  const bookingServiceId = addNode(nodeTypes.CLASS, 'BookingService', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'createBooking', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'cancelBooking', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'getBookingById', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'getAllBookings', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'getBookingsByCustomer', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'getBookingsByVehicle', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'getBookingsByDriver', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'calculatePrice', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'checkAvailability', '/src/services/booking.service.ts', domains.BOOKING);
  addNode(nodeTypes.METHOD, 'assignDriver', '/src/services/booking.service.ts', domains.BOOKING);
  
  // Route domain
  const routeModelId = addNode(nodeTypes.CLASS, 'RouteModel', '/src/models/route.model.ts', domains.ROUTE);
  const routeServiceId = addNode(nodeTypes.CLASS, 'RouteService', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'createRoute', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'updateRoute', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'getRouteById', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'getAllRoutes', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'optimizeRoute', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'calculateETA', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'trackRouteProgress', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'findOptimalRoute', '/src/services/route.service.ts', domains.ROUTE);
  addNode(nodeTypes.METHOD, 'estimateFuelConsumption', '/src/services/route.service.ts', domains.ROUTE);
  
  // Add route-related classes
  addNode(nodeTypes.CLASS, 'RouteOptimizer', '/src/services/route/optimizer.ts', domains.ROUTE);
  addNode(nodeTypes.CLASS, 'RouteTracker', '/src/services/route/tracker.ts', domains.ROUTE);
  addNode(nodeTypes.CLASS, 'EtaCalculator', '/src/services/route/eta.ts', domains.ROUTE);
  addNode(nodeTypes.CLASS, 'GeoFencing', '/src/services/route/geo-fencing.ts', domains.ROUTE);
  
  // Customer domain
  const customerModelId = addNode(nodeTypes.CLASS, 'CustomerModel', '/src/models/customer.model.ts', domains.CUSTOMER);
  const customerServiceId = addNode(nodeTypes.CLASS, 'CustomerService', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'createCustomer', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'updateCustomer', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'getCustomerById', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'getAllCustomers', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'calculateLoyaltyPoints', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'getCustomerBookings', '/src/services/customer.service.ts', domains.CUSTOMER);
  addNode(nodeTypes.METHOD, 'getCustomerPreferences', '/src/services/customer.service.ts', domains.CUSTOMER);
  
  // Payment domain
  const paymentModelId = addNode(nodeTypes.CLASS, 'PaymentModel', '/src/models/payment.model.ts', domains.PAYMENT);
  const paymentServiceId = addNode(nodeTypes.CLASS, 'PaymentService', '/src/services/payment.service.ts', domains.PAYMENT);
  addNode(nodeTypes.METHOD, 'processPayment', '/src/services/payment.service.ts', domains.PAYMENT);
  addNode(nodeTypes.METHOD, 'refundPayment', '/src/services/payment.service.ts', domains.PAYMENT);
  addNode(nodeTypes.METHOD, 'getPaymentHistory', '/src/services/payment.service.ts', domains.PAYMENT);
  addNode(nodeTypes.METHOD, 'generateInvoice', '/src/services/payment.service.ts', domains.PAYMENT);
  addNode(nodeTypes.METHOD, 'validatePaymentMethod', '/src/services/payment.service.ts', domains.PAYMENT);
  
  // Add payment-related classes
  addNode(nodeTypes.CLASS, 'PaymentGateway', '/src/services/payment/gateway.ts', domains.PAYMENT);
  addNode(nodeTypes.CLASS, 'InvoiceGenerator', '/src/services/payment/invoice.ts', domains.PAYMENT);
  addNode(nodeTypes.CLASS, 'SubscriptionManager', '/src/services/payment/subscription.ts', domains.PAYMENT);
  
  // Analytics domain
  const analyticsServiceId = addNode(nodeTypes.CLASS, 'AnalyticsService', '/src/services/analytics.service.ts', domains.ANALYTICS);
  addNode(nodeTypes.METHOD, 'generateFleetReport', '/src/services/analytics.service.ts', domains.ANALYTICS);
  addNode(nodeTypes.METHOD, 'generateDriverReport', '/src/services/analytics.service.ts', domains.ANALYTICS);
  addNode(nodeTypes.METHOD, 'calculateFleetUtilization', '/src/services/analytics.service.ts', domains.ANALYTICS);
  addNode(nodeTypes.METHOD, 'analyzeBookingTrends', '/src/services/analytics.service.ts', domains.ANALYTICS);
  addNode(nodeTypes.METHOD, 'generateRevenueForecast', '/src/services/analytics.service.ts', domains.ANALYTICS);
  
  // Add analytics-related classes
  addNode(nodeTypes.CLASS, 'DataWarehouse', '/src/services/analytics/data-warehouse.ts', domains.ANALYTICS);
  addNode(nodeTypes.CLASS, 'ReportGenerator', '/src/services/analytics/report-generator.ts', domains.ANALYTICS);
  addNode(nodeTypes.CLASS, 'DashboardService', '/src/services/analytics/dashboard.ts', domains.ANALYTICS);
  addNode(nodeTypes.CLASS, 'PredictiveModels', '/src/services/analytics/predictive-models.ts', domains.ANALYTICS);
  
  // Notification domain
  const notificationServiceId = addNode(nodeTypes.CLASS, 'NotificationService', '/src/services/notification.service.ts', domains.NOTIFICATION);
  addNode(nodeTypes.METHOD, 'sendSMS', '/src/services/notification.service.ts', domains.NOTIFICATION);
  addNode(nodeTypes.METHOD, 'sendEmail', '/src/services/notification.service.ts', domains.NOTIFICATION);
  addNode(nodeTypes.METHOD, 'sendPushNotification', '/src/services/notification.service.ts', domains.NOTIFICATION);
  addNode(nodeTypes.METHOD, 'createNotification', '/src/services/notification.service.ts', domains.NOTIFICATION);
  addNode(nodeTypes.METHOD, 'getUnreadNotifications', '/src/services/notification.service.ts', domains.NOTIFICATION);
  
  // Add many more nodes as needed...
  
  // Add at least 150 additional method nodes to have over 200 total nodes
  for (let i = 1; i <= 30; i++) {
    // Add vehicle-related methods
    addNode(nodeTypes.METHOD, `processVehicleData${i}`, '/src/services/vehicle/data-processor.ts', domains.VEHICLE);
    
    // Add route-related methods
    addNode(nodeTypes.METHOD, `calculateRouteSegment${i}`, '/src/services/route/route-calculator.ts', domains.ROUTE);
    
    // Add booking-related methods
    addNode(nodeTypes.METHOD, `validateBookingDetails${i}`, '/src/services/booking/validation.ts', domains.BOOKING);
    
    // Add maintenance-related methods
    addNode(nodeTypes.METHOD, `checkMaintenanceRequirement${i}`, '/src/services/maintenance/checklist.ts', domains.MAINTENANCE);
    
    // Add analytics-related methods
    addNode(nodeTypes.METHOD, `generateAnalyticsReport${i}`, '/src/services/analytics/reports.ts', domains.ANALYTICS);
  }
  
  console.log(`Generated ${nodes.length} business-focused nodes`);
  return nodes;
}

// Generate relationships between nodes
function generateRelationships(nodes) {
  const relationships = [];
  let relationId = 1;
  
  // Helper function to add a relationship
  function addRelationship(sourceId, targetId, type, properties = {}) {
    relationships.push({
      identity: `r${relationId}`,
      type,
      start: sourceId,
      end: targetId,
      properties
    });
    return relationId++;
  }
  
  // Helper to find nodes by type and name
  function findNode(type, namePart) {
    return nodes.find(n => 
      n.labels.includes(type) && 
      n.properties.name.includes(namePart)
    );
  }
  
  // Helper to find all nodes by domain
  function findNodesByDomain(domain) {
    return nodes.filter(n => n.properties.domain === domain);
  }
  
  // Helper to find all nodes by type
  function findNodesByType(type) {
    return nodes.filter(n => n.labels.includes(type));
  }
  
  // Create relationships between classes and their methods
  const classes = findNodesByType(nodeTypes.CLASS);
  classes.forEach(classNode => {
    // Find methods with the same path
    const methods = nodes.filter(n => 
      n.labels.includes(nodeTypes.METHOD) && 
      n.properties.path === classNode.properties.path
    );
    
    // Create CONTAINS relationships
    methods.forEach(method => {
      addRelationship(classNode.identity, method.identity, relationTypes.CONTAINS);
    });
  });
  
  // Create domain-specific relationships
  Object.values(domains).forEach(domain => {
    const domainNodes = findNodesByDomain(domain);
    
    // Find service and model in this domain
    const serviceNode = domainNodes.find(n => n.labels.includes(nodeTypes.CLASS) && n.properties.name.includes('Service'));
    const modelNode = domainNodes.find(n => n.labels.includes(nodeTypes.CLASS) && n.properties.name.includes('Model'));
    
    if (serviceNode && modelNode) {
      // Service uses model
      addRelationship(serviceNode.identity, modelNode.identity, relationTypes.USES);
    }
    
    // Connect services to their domain-specific utilities
    const utilNodes = domainNodes.filter(n => n.properties.path.includes('/utils/'));
    if (serviceNode) {
      utilNodes.forEach(util => {
        addRelationship(serviceNode.identity, util.identity, relationTypes.USES);
      });
    }
    
    // Connect domain controller to service
    const controllerNode = domainNodes.find(n => n.properties.path.includes('controller'));
    if (controllerNode && serviceNode) {
      addRelationship(controllerNode.identity, serviceNode.identity, relationTypes.USES);
    }
    
    // Connect route to controller
    const routeNode = domainNodes.find(n => n.properties.path.includes('routes'));
    if (routeNode && controllerNode) {
      addRelationship(routeNode.identity, controllerNode.identity, relationTypes.USES);
    }
  });
  
  // Add cross-domain relationships
  
  // Booking uses Customer
  const bookingService = findNode(nodeTypes.CLASS, 'BookingService');
  const customerService = findNode(nodeTypes.CLASS, 'CustomerService');
  if (bookingService && customerService) {
    addRelationship(bookingService.identity, customerService.identity, relationTypes.USES);
  }
  
  // Booking uses Vehicle
  const vehicleService = findNode(nodeTypes.CLASS, 'VehicleService');
  if (bookingService && vehicleService) {
    addRelationship(bookingService.identity, vehicleService.identity, relationTypes.USES);
  }
  
  // Booking uses Route
  const routeService = findNode(nodeTypes.CLASS, 'RouteService');
  if (bookingService && routeService) {
    addRelationship(bookingService.identity, routeService.identity, relationTypes.USES);
  }
  
  // Booking uses Driver
  const driverService = findNode(nodeTypes.CLASS, 'DriverService');
  if (bookingService && driverService) {
    addRelationship(bookingService.identity, driverService.identity, relationTypes.USES);
  }
  
  // Booking uses Payment
  const paymentService = findNode(nodeTypes.CLASS, 'PaymentService');
  if (bookingService && paymentService) {
    addRelationship(bookingService.identity, paymentService.identity, relationTypes.USES);
  }
  
  // Vehicle uses Maintenance
  const maintenanceService = findNode(nodeTypes.CLASS, 'MaintenanceService');
  if (vehicleService && maintenanceService) {
    addRelationship(vehicleService.identity, maintenanceService.identity, relationTypes.USES);
  }
  
  // Analytics uses multiple services
  const analyticsService = findNode(nodeTypes.CLASS, 'AnalyticsService');
  if (analyticsService) {
    [vehicleService, driverService, bookingService, routeService, customerService, paymentService].forEach(service => {
      if (service) {
        addRelationship(analyticsService.identity, service.identity, relationTypes.USES);
      }
    });
  }
  
  // Create many more relationships to create a complex, interconnected graph
  // Add at least 300 relationships for our 200+ nodes
  
  // Connect all services to the middleware
  const middlewareNode = findNode(nodeTypes.FILE, 'middleware.ts');
  if (middlewareNode) {
    const services = findNodesByType(nodeTypes.CLASS).filter(n => n.properties.name.includes('Service'));
    services.forEach(service => {
      addRelationship(service.identity, middlewareNode.identity, relationTypes.USES);
    });
  }
  
  // Connect all business logic files to utils
  const utilsNode = findNode(nodeTypes.FILE, 'utils.ts');
  if (utilsNode) {
    const businessFiles = nodes.filter(n => n.labels.includes(nodeTypes.FILE) && !n.properties.path.includes('/utils/'));
    businessFiles.forEach(file => {
      addRelationship(file.identity, utilsNode.identity, relationTypes.IMPORTS);
    });
  }
  
  // Add many more inter-method relationships
  // Loop through all method nodes and create some CALLS relationships
  const methods = findNodesByType(nodeTypes.METHOD);
  for (let i = 0; i < methods.length; i++) {
    // Each method will call 2-3 other methods
    const callCount = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < callCount; j++) {
      // Pick a random target method that isn't this one
      let targetIdx;
      do {
        targetIdx = Math.floor(Math.random() * methods.length);
      } while (targetIdx === i);
      
      addRelationship(methods[i].identity, methods[targetIdx].identity, relationTypes.CALLS);
    }
  }
  
  console.log(`Generated ${relationships.length} relationships`);
  return relationships;
}

// Main function to generate and save the expanded graph
function generateAndSaveExpandedGraph() {
  const projectId = 'fleet-management';
  
  // Generate the nodes
  const nodes = generateBusinessNodes(projectId);
  
  // Generate relationships
  const relationships = generateRelationships(nodes);
  
  // Save to database files
  fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2), 'utf8');
  fs.writeFileSync(RELS_FILE, JSON.stringify(relationships, null, 2), 'utf8');
  
  console.log(`Saved expanded business graph with ${nodes.length} nodes and ${relationships.length} relationships to ${DB_DIR}`);
  console.log(`To view the graph, make sure your test API server is running and go to /api/refactor/graph?projectId=${projectId}`);
}

// Run the generator
generateAndSaveExpandedGraph();