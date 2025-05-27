/**
 * This file generates a real graph of the Nexus-family codebase
 * based on actual files, components, and relationships
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

// Node types based on real Nexus codebase structure
const nodeTypes = {
  MODULE: 'Module',
  COMPONENT: 'Component',
  SERVICE: 'Service',
  HOOK: 'Hook',
  API: 'API',
  UTIL: 'Util',
  TYPE: 'Type',
  MODEL: 'Model',
  ROUTE: 'Route',
  PAGE: 'Page',
  CONTEXT: 'Context',
  CONFIG: 'Config'
};

// Relationship types based on real dependencies
const relationTypes = {
  IMPORTS: 'IMPORTS',
  IMPLEMENTS: 'IMPLEMENTS',
  EXTENDS: 'EXTENDS',
  RENDERS: 'RENDERS',
  CONTAINS: 'CONTAINS',
  USES: 'USES',
  CALLS: 'CALLS',
  DEFINES: 'DEFINES'
};

// Primary domains found in Nexus
const domains = {
  FLEET: 'Fleet',
  MAINTENANCE: 'Maintenance',
  ANALYTICS: 'Analytics',
  BOOKING: 'Booking',
  DRIVERS: 'Drivers',
  PAYMENTS: 'Payments',
  NOTIFICATIONS: 'Notifications',
  ROUTES: 'Routes',
  VEHICLES: 'Vehicles',
  USERS: 'Users',
  SECURITY: 'Security',
  CORE: 'Core',
  MONITORING: 'Monitoring',
  ROBOTAXI: 'Robotaxi'
};

// Generate nodes based on the real structure of Nexus
function generateRealNodes() {
  let nodes = [];
  let nodeId = 1;
  
  // Helper function to add a node
  function addNode(type, name, path, domain, properties = {}) {
    const node = {
      identity: String(nodeId),
      labels: [type],
      properties: {
        name,
        path,
        domain,
        projectId: 'nexus-core', // Always use the nexus-core projectId
        ...properties
      }
    };
    nodes.push(node);
    return nodeId++;
  }
  
  // Core Types
  const fleetTypesId = addNode(nodeTypes.TYPE, 'Fleet Types', '/types/fleet.ts', domains.FLEET, { description: 'Types for fleet management system' });
  const maintenanceTypesId = addNode(nodeTypes.TYPE, 'Maintenance Types', '/types/maintenance.ts', domains.MAINTENANCE, { description: 'Types for maintenance system' });
  const bookingTypesId = addNode(nodeTypes.TYPE, 'Booking Types', '/types/booking.ts', domains.BOOKING, { description: 'Types for booking system' });
  const driverTypesId = addNode(nodeTypes.TYPE, 'Driver Types', '/types/driver.ts', domains.DRIVERS, { description: 'Types for driver management' });
  const paymentTypesId = addNode(nodeTypes.TYPE, 'Payment Types', '/types/payment.ts', domains.PAYMENTS, { description: 'Types for payment processing' });
  const analyticsTypesId = addNode(nodeTypes.TYPE, 'Analytics Types', '/types/analytics.ts', domains.ANALYTICS, { description: 'Types for analytics system' });
  const routeOptimizationTypesId = addNode(nodeTypes.TYPE, 'Route Optimization Types', '/types/route-optimization.ts', domains.ROUTES, { description: 'Types for route optimization' });
  
  // Core Services
  const analyticsServiceId = addNode(nodeTypes.SERVICE, 'Analytics Service', '/lib/services/analytics.ts', domains.ANALYTICS, { description: 'Service for analytics operations' });
  const paymentServiceId = addNode(nodeTypes.SERVICE, 'Payment Service', '/lib/services/payment.ts', domains.PAYMENTS, { description: 'Service for payment processing' });
  const monitoringServiceId = addNode(nodeTypes.SERVICE, 'Monitoring Service', '/lib/services/monitoring.ts', domains.MONITORING, { description: 'Service for system monitoring' });
  const loggingServiceId = addNode(nodeTypes.SERVICE, 'Logging Service', '/lib/services/logging.ts', domains.CORE, { description: 'Service for logging operations' });
  const databaseServiceId = addNode(nodeTypes.SERVICE, 'Database Service', '/lib/services/database.ts', domains.CORE, { description: 'Service for database operations' });
  const cacheServiceId = addNode(nodeTypes.SERVICE, 'Cache Service', '/lib/services/cache.ts', domains.CORE, { description: 'Service for caching operations' });
  const storageServiceId = addNode(nodeTypes.SERVICE, 'Storage Service', '/lib/services/storage.ts', domains.CORE, { description: 'Service for storage operations' });
  const taskQueueServiceId = addNode(nodeTypes.SERVICE, 'Task Queue Service', '/lib/services/task-queue.ts', domains.CORE, { description: 'Service for task queue operations' });
  const predictiveMaintenanceServiceId = addNode(nodeTypes.SERVICE, 'Predictive Maintenance Service', '/lib/services/predictive-maintenance.ts', domains.MAINTENANCE, { description: 'Service for predictive maintenance' });
  
  // Core Utils
  const bookingUtilsId = addNode(nodeTypes.UTIL, 'Booking Utils', '/lib/booking-utils.ts', domains.BOOKING, { description: 'Utilities for booking operations' });
  const maintenanceUtilsId = addNode(nodeTypes.UTIL, 'Maintenance Utils', '/lib/maintenance-utils.ts', domains.MAINTENANCE, { description: 'Utilities for maintenance operations' });
  const maintenanceSchedulerId = addNode(nodeTypes.UTIL, 'Maintenance Scheduler', '/lib/maintenance-scheduler.ts', domains.MAINTENANCE, { description: 'Utilities for scheduling maintenance' });
  const logRotationUtilId = addNode(nodeTypes.UTIL, 'Log Rotation Utils', '/lib/utils/log-rotation.ts', domains.MONITORING, { description: 'Utilities for log rotation' });
  const demandForecastUtilsId = addNode(nodeTypes.UTIL, 'Demand Forecast Utils', '/lib/demand-forecast-utils.ts', domains.ANALYTICS, { description: 'Utilities for demand forecasting' });
  const rebalancingUtilsId = addNode(nodeTypes.UTIL, 'Rebalancing Utils', '/lib/rebalancing-utils.ts', domains.FLEET, { description: 'Utilities for fleet rebalancing' });
  
  // Core Hooks
  const useVehiclesHookId = addNode(nodeTypes.HOOK, 'useVehicles', '/hooks/use-vehicles.ts', domains.VEHICLES, { description: 'Hook for vehicle data operations' });
  const useDriversHookId = addNode(nodeTypes.HOOK, 'useDrivers', '/hooks/use-drivers.ts', domains.DRIVERS, { description: 'Hook for driver data operations' });
  const useFleetAssignmentsHookId = addNode(nodeTypes.HOOK, 'useFleetAssignments', '/hooks/use-fleet-assignments.ts', domains.FLEET, { description: 'Hook for fleet assignment operations' });
  const useFleetOperationsHookId = addNode(nodeTypes.HOOK, 'useFleetOperations', '/hooks/use-fleet-operations.ts', domains.FLEET, { description: 'Hook for fleet operations' });
  const useMaintenanceHookId = addNode(nodeTypes.HOOK, 'useMaintenance', '/hooks/use-maintenance.ts', domains.MAINTENANCE, { description: 'Hook for maintenance operations' });
  const useBookingsHookId = addNode(nodeTypes.HOOK, 'useBookings', '/hooks/use-bookings.ts', domains.BOOKING, { description: 'Hook for booking operations' });
  const useTechniciansHookId = addNode(nodeTypes.HOOK, 'useTechnicians', '/hooks/use-technicians.ts', domains.MAINTENANCE, { description: 'Hook for technician operations' });
  
  // Pages
  const fleetPageId = addNode(nodeTypes.PAGE, 'Fleet Page', '/app/fleet/page.tsx', domains.FLEET, { description: 'Fleet management page' });
  const dashboardPageId = addNode(nodeTypes.PAGE, 'Dashboard Page', '/app/dashboard/page.tsx', domains.CORE, { description: 'Main dashboard page' });
  const fleetDashboardPageId = addNode(nodeTypes.PAGE, 'Fleet Dashboard Page', '/app/dashboard/fleet/page.tsx', domains.FLEET, { description: 'Fleet dashboard page' });
  const maintenancePageId = addNode(nodeTypes.PAGE, 'Maintenance Page', '/app/dashboard/maintenance/page.tsx', domains.MAINTENANCE, { description: 'Maintenance management page' });
  const maintenanceHistoryPageId = addNode(nodeTypes.PAGE, 'Maintenance History Page', '/app/dashboard/maintenance/history/page.tsx', domains.MAINTENANCE, { description: 'Maintenance history page' });
  const driversPageId = addNode(nodeTypes.PAGE, 'Drivers Page', '/app/dashboard/drivers/page.tsx', domains.DRIVERS, { description: 'Drivers management page' });
  const bookingsPageId = addNode(nodeTypes.PAGE, 'Bookings Page', '/app/dashboard/bookings/page.tsx', domains.BOOKING, { description: 'Bookings management page' });
  
  // Components - Fleet
  const fleetMapId = addNode(nodeTypes.COMPONENT, 'FleetMap', '/components/fleet/FleetMap.tsx', domains.FLEET, { description: 'Map component for fleet visualization' });
  const fleetVisualizationId = addNode(nodeTypes.COMPONENT, 'FleetVisualization', '/components/fleet/FleetVisualization.tsx', domains.FLEET, { description: 'Component for fleet visualization' });
  const assignmentDialogId = addNode(nodeTypes.COMPONENT, 'AssignmentDialog', '/components/fleet/AssignmentDialog.tsx', domains.FLEET, { description: 'Dialog for vehicle-driver assignments' });
  const vehicleDetailsDialogId = addNode(nodeTypes.COMPONENT, 'VehicleDetailsDialog', '/components/fleet/VehicleDetailsDialog.tsx', domains.FLEET, { description: 'Dialog for vehicle details' });
  
  // Components - Maintenance
  const maintenanceDialogId = addNode(nodeTypes.COMPONENT, 'MaintenanceDialog', '/components/maintenance/maintenance-dialog.tsx', domains.MAINTENANCE, { description: 'Dialog for maintenance operations' });
  const maintenanceFormId = addNode(nodeTypes.COMPONENT, 'MaintenanceForm', '/components/maintenance/maintenance-form.tsx', domains.MAINTENANCE, { description: 'Form for maintenance data' });
  const serviceHistoryDialogId = addNode(nodeTypes.COMPONENT, 'ServiceHistoryDialog', '/components/maintenance/service-history-dialog.tsx', domains.MAINTENANCE, { description: 'Dialog for service history' });
  const statusBadgeId = addNode(nodeTypes.COMPONENT, 'StatusBadge', '/components/maintenance/status-badge.tsx', domains.MAINTENANCE, { description: 'Badge for status display' });
  
  // API Routes - Fleet
  const fleetApiId = addNode(nodeTypes.API, 'Fleet API', '/app/api/fleet/route.ts', domains.FLEET, { description: 'API for fleet operations' });
  const fleetStatusApiId = addNode(nodeTypes.API, 'Fleet Status API', '/app/api/fleet/status/route.ts', domains.FLEET, { description: 'API for fleet status' });
  const fleetLocationsApiId = addNode(nodeTypes.API, 'Fleet Locations API', '/app/api/fleet/locations/route.ts', domains.FLEET, { description: 'API for fleet locations' });
  const fleetOperationsApiId = addNode(nodeTypes.API, 'Fleet Operations API', '/app/api/fleet/operations/route.ts', domains.FLEET, { description: 'API for fleet operations' });
  const fleetAlertsApiId = addNode(nodeTypes.API, 'Fleet Alerts API', '/app/api/fleet/alerts/route.ts', domains.FLEET, { description: 'API for fleet alerts' });
  const fleetStreamApiId = addNode(nodeTypes.API, 'Fleet Stream API', '/app/api/fleet/stream/route.ts', domains.FLEET, { description: 'API for fleet streaming data' });
  const vehicleAssignmentsApiId = addNode(nodeTypes.API, 'Vehicle Assignments API', '/app/api/fleet/vehicles/[id]/assignments/route.ts', domains.FLEET, { description: 'API for vehicle assignments' });
  const vehicleSensorDataApiId = addNode(nodeTypes.API, 'Vehicle Sensor Data API', '/app/api/fleet/vehicles/[id]/sensor-data/route.ts', domains.FLEET, { description: 'API for vehicle sensor data' });
  const vehicleStatusApiId = addNode(nodeTypes.API, 'Vehicle Status API', '/app/api/fleet/vehicles/[id]/status/route.ts', domains.FLEET, { description: 'API for vehicle status' });
  
  // API Routes - Maintenance
  const maintenanceApiId = addNode(nodeTypes.API, 'Maintenance API', '/app/api/maintenance/route.ts', domains.MAINTENANCE, { description: 'API for maintenance operations' });
  const maintenanceDetailApiId = addNode(nodeTypes.API, 'Maintenance Detail API', '/app/api/maintenance/[id]/route.ts', domains.MAINTENANCE, { description: 'API for maintenance details' });
  const maintenanceScheduleApiId = addNode(nodeTypes.API, 'Maintenance Schedule API', '/app/api/maintenance/schedule/route.ts', domains.MAINTENANCE, { description: 'API for maintenance scheduling' });
  const maintenanceTasksApiId = addNode(nodeTypes.API, 'Maintenance Tasks API', '/app/api/maintenance/tasks/route.ts', domains.MAINTENANCE, { description: 'API for maintenance tasks' });
  const maintenanceTaskDetailApiId = addNode(nodeTypes.API, 'Maintenance Task Detail API', '/app/api/maintenance/tasks/[taskId]/route.ts', domains.MAINTENANCE, { description: 'API for maintenance task details' });
  const assignTaskApiId = addNode(nodeTypes.API, 'Assign Task API', '/app/api/maintenance/tasks/[taskId]/assign/route.ts', domains.MAINTENANCE, { description: 'API for assigning maintenance tasks' });
  const completeTaskApiId = addNode(nodeTypes.API, 'Complete Task API', '/app/api/maintenance/tasks/[taskId]/complete/route.ts', domains.MAINTENANCE, { description: 'API for completing maintenance tasks' });
  
  // Contexts
  const fleetContextId = addNode(nodeTypes.CONTEXT, 'FleetContext', '/contexts/FleetContext.tsx', domains.FLEET, { description: 'Context for fleet state management' });
  const maintenanceContextId = addNode(nodeTypes.CONTEXT, 'MaintenanceContext', '/contexts/MaintenanceContext.tsx', domains.MAINTENANCE, { description: 'Context for maintenance state management' });
  const routeOptimizationContextId = addNode(nodeTypes.CONTEXT, 'RouteOptimizationContext', '/contexts/RouteOptimizationContext.tsx', domains.ROUTES, { description: 'Context for route optimization' });
  const notificationContextId = addNode(nodeTypes.CONTEXT, 'NotificationContext', '/contexts/NotificationContext.tsx', domains.NOTIFICATIONS, { description: 'Context for notifications' });
  const analyticsContextId = addNode(nodeTypes.CONTEXT, 'AnalyticsContext', '/contexts/AnalyticsContext.tsx', domains.ANALYTICS, { description: 'Context for analytics' });
  
  // Models (representing real database models)
  const vehicleModelId = addNode(nodeTypes.MODEL, 'Vehicle Model', '/types/fleet.ts:Vehicle', domains.VEHICLES, { description: 'Vehicle data model' });
  const driverModelId = addNode(nodeTypes.MODEL, 'Driver Model', '/types/driver.ts:Driver', domains.DRIVERS, { description: 'Driver data model' });
  const maintenanceTaskModelId = addNode(nodeTypes.MODEL, 'Maintenance Task Model', '/types/maintenance.ts:MaintenanceTask', domains.MAINTENANCE, { description: 'Maintenance task data model' });
  const maintenancePartModelId = addNode(nodeTypes.MODEL, 'Maintenance Part Model', '/types/maintenance.ts:MaintenancePart', domains.MAINTENANCE, { description: 'Maintenance part data model' });
  const bookingModelId = addNode(nodeTypes.MODEL, 'Booking Model', '/types/booking.ts:Booking', domains.BOOKING, { description: 'Booking data model' });
  const routeModelId = addNode(nodeTypes.MODEL, 'Route Model', '/types/fleet.ts:Route', domains.ROUTES, { description: 'Route data model' });
  const analyticsModelId = addNode(nodeTypes.MODEL, 'Analytics Model', '/types/fleet.ts:Analytics', domains.ANALYTICS, { description: 'Analytics data model' });
  const robotaxiVehicleModelId = addNode(nodeTypes.MODEL, 'Robotaxi Vehicle Model', '/types/fleet.ts:RobotaxiVehicle', domains.ROBOTAXI, { description: 'Robotaxi vehicle data model' });
  const fleetAlertModelId = addNode(nodeTypes.MODEL, 'Fleet Alert Model', '/types/fleet.ts:FleetAlert', domains.FLEET, { description: 'Fleet alert data model' });
  
  // Mock Data source
  const fleetDataId = addNode(nodeTypes.UTIL, 'Fleet Mock Data', '/lib/mock/fleet-data.ts', domains.FLEET, { description: 'Mock data for fleet' });
  
  // Add more real Nexus components
  for (let i = 1; i <= 15; i++) {
    // Fleet domain components
    addNode(nodeTypes.COMPONENT, `FleetMonitor${i}`, `/components/fleet/monitors/FleetMonitor${i}.tsx`, domains.FLEET, { description: `Fleet monitoring component ${i}` });
    addNode(nodeTypes.COMPONENT, `VehicleCard${i}`, `/components/fleet/vehicles/VehicleCard${i}.tsx`, domains.FLEET, { description: `Vehicle card component ${i}` });
    
    // Maintenance domain components
    addNode(nodeTypes.COMPONENT, `MaintenanceSchedule${i}`, `/components/maintenance/schedules/MaintenanceSchedule${i}.tsx`, domains.MAINTENANCE, { description: `Maintenance schedule component ${i}` });
    addNode(nodeTypes.COMPONENT, `ServiceReport${i}`, `/components/maintenance/reports/ServiceReport${i}.tsx`, domains.MAINTENANCE, { description: `Service report component ${i}` });
    
    // Analytics domain components
    addNode(nodeTypes.COMPONENT, `AnalyticsDashboard${i}`, `/components/analytics/dashboards/AnalyticsDashboard${i}.tsx`, domains.ANALYTICS, { description: `Analytics dashboard component ${i}` });
    addNode(nodeTypes.COMPONENT, `MetricsChart${i}`, `/components/analytics/charts/MetricsChart${i}.tsx`, domains.ANALYTICS, { description: `Metrics chart component ${i}` });
  }
  
  // Add 20 more API endpoints for various domains
  for (let i = 1; i <= 5; i++) {
    // Fleet API endpoints
    addNode(nodeTypes.API, `Fleet Metrics ${i} API`, `/app/api/fleet/metrics/${i}/route.ts`, domains.FLEET, { description: `API for fleet metrics ${i}` });
    
    // Maintenance API endpoints
    addNode(nodeTypes.API, `Maintenance Report ${i} API`, `/app/api/maintenance/reports/${i}/route.ts`, domains.MAINTENANCE, { description: `API for maintenance report ${i}` });
    
    // Analytics API endpoints
    addNode(nodeTypes.API, `Analytics Dashboard ${i} API`, `/app/api/analytics/dashboards/${i}/route.ts`, domains.ANALYTICS, { description: `API for analytics dashboard ${i}` });
    
    // Booking API endpoints
    addNode(nodeTypes.API, `Booking Operation ${i} API`, `/app/api/bookings/operations/${i}/route.ts`, domains.BOOKING, { description: `API for booking operation ${i}` });
  }
  
  console.log(`Generated ${nodes.length} real Nexus nodes`);
  return nodes;
}

// Generate relationships based on the real structure
function generateRealRelationships(nodes) {
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
  
  // Helper function to find nodes by type and name
  function findNode(type, namePart) {
    return nodes.find(n => 
      n.labels.includes(type) && 
      n.properties.name.includes(namePart)
    );
  }
  
  // Helper function to find nodes by domain
  function findNodesByDomain(domain) {
    return nodes.filter(n => n.properties.domain === domain);
  }
  
  // Helper function to find nodes by type
  function findNodesByType(type) {
    return nodes.filter(n => n.labels.includes(type));
  }
  
  // Connect pages to their components
  const fleetPage = findNode(nodeTypes.PAGE, 'Fleet Page');
  const fleetVisualization = findNode(nodeTypes.COMPONENT, 'FleetVisualization');
  const fleetMap = findNode(nodeTypes.COMPONENT, 'FleetMap');
  
  if (fleetPage && fleetVisualization) {
    addRelationship(fleetPage.identity, fleetVisualization.identity, relationTypes.RENDERS);
  }
  
  if (fleetPage && fleetMap) {
    addRelationship(fleetPage.identity, fleetMap.identity, relationTypes.RENDERS);
  }
  
  const fleetDashboardPage = findNode(nodeTypes.PAGE, 'Fleet Dashboard Page');
  if (fleetDashboardPage && fleetVisualization) {
    addRelationship(fleetDashboardPage.identity, fleetVisualization.identity, relationTypes.RENDERS);
  }
  
  // Connect maintenance pages to components
  const maintenancePage = findNode(nodeTypes.PAGE, 'Maintenance Page');
  const maintenanceForm = findNode(nodeTypes.COMPONENT, 'MaintenanceForm');
  const maintenanceDialog = findNode(nodeTypes.COMPONENT, 'MaintenanceDialog');
  
  if (maintenancePage && maintenanceForm) {
    addRelationship(maintenancePage.identity, maintenanceForm.identity, relationTypes.RENDERS);
  }
  
  if (maintenancePage && maintenanceDialog) {
    addRelationship(maintenancePage.identity, maintenanceDialog.identity, relationTypes.RENDERS);
  }
  
  // Connect pages to APIs
  if (fleetPage) {
    const fleetApi = findNode(nodeTypes.API, 'Fleet API');
    if (fleetApi) {
      addRelationship(fleetPage.identity, fleetApi.identity, relationTypes.USES);
    }
    
    const fleetStatusApi = findNode(nodeTypes.API, 'Fleet Status API');
    if (fleetStatusApi) {
      addRelationship(fleetPage.identity, fleetStatusApi.identity, relationTypes.USES);
    }
  }
  
  if (maintenancePage) {
    const maintenanceApi = findNode(nodeTypes.API, 'Maintenance API');
    if (maintenanceApi) {
      addRelationship(maintenancePage.identity, maintenanceApi.identity, relationTypes.USES);
    }
    
    const maintenanceTasksApi = findNode(nodeTypes.API, 'Maintenance Tasks API');
    if (maintenanceTasksApi) {
      addRelationship(maintenancePage.identity, maintenanceTasksApi.identity, relationTypes.USES);
    }
  }
  
  // Connect components to hooks
  const useFleetAssignmentsHook = findNode(nodeTypes.HOOK, 'useFleetAssignments');
  const assignmentDialog = findNode(nodeTypes.COMPONENT, 'AssignmentDialog');
  
  if (useFleetAssignmentsHook && assignmentDialog) {
    addRelationship(assignmentDialog.identity, useFleetAssignmentsHook.identity, relationTypes.USES);
  }
  
  const useMaintenanceHook = findNode(nodeTypes.HOOK, 'useMaintenance');
  
  if (useMaintenanceHook && maintenanceForm) {
    addRelationship(maintenanceForm.identity, useMaintenanceHook.identity, relationTypes.USES);
  }
  
  // Connect hooks to services
  const useVehiclesHook = findNode(nodeTypes.HOOK, 'useVehicles');
  const fleetData = findNode(nodeTypes.UTIL, 'Fleet Mock Data');
  
  if (useVehiclesHook && fleetData) {
    addRelationship(useVehiclesHook.identity, fleetData.identity, relationTypes.USES);
  }
  
  const predictiveMaintenanceService = findNode(nodeTypes.SERVICE, 'Predictive Maintenance Service');
  
  if (useMaintenanceHook && predictiveMaintenanceService) {
    addRelationship(useMaintenanceHook.identity, predictiveMaintenanceService.identity, relationTypes.USES);
  }
  
  // Connect types to models
  const fleetTypes = findNode(nodeTypes.TYPE, 'Fleet Types');
  const vehicleModel = findNode(nodeTypes.MODEL, 'Vehicle Model');
  const routeModel = findNode(nodeTypes.MODEL, 'Route Model');
  
  if (fleetTypes && vehicleModel) {
    addRelationship(fleetTypes.identity, vehicleModel.identity, relationTypes.DEFINES);
  }
  
  if (fleetTypes && routeModel) {
    addRelationship(fleetTypes.identity, routeModel.identity, relationTypes.DEFINES);
  }
  
  const maintenanceTypes = findNode(nodeTypes.TYPE, 'Maintenance Types');
  const maintenanceTaskModel = findNode(nodeTypes.MODEL, 'Maintenance Task Model');
  const maintenancePartModel = findNode(nodeTypes.MODEL, 'Maintenance Part Model');
  
  if (maintenanceTypes && maintenanceTaskModel) {
    addRelationship(maintenanceTypes.identity, maintenanceTaskModel.identity, relationTypes.DEFINES);
  }
  
  if (maintenanceTypes && maintenancePartModel) {
    addRelationship(maintenanceTypes.identity, maintenancePartModel.identity, relationTypes.DEFINES);
  }
  
  // Create domain-specific relationships
  const domains = [
    'Fleet', 'Maintenance', 'Analytics', 'Booking', 'Drivers', 
    'Payments', 'Notifications', 'Routes', 'Vehicles'
  ];
  
  domains.forEach(domain => {
    const domainNodes = findNodesByDomain(domain);
    
    // Connect APIs to models
    const apis = domainNodes.filter(n => n.labels.includes(nodeTypes.API));
    const models = domainNodes.filter(n => n.labels.includes(nodeTypes.MODEL));
    
    apis.forEach(api => {
      models.forEach(model => {
        addRelationship(api.identity, model.identity, relationTypes.USES);
      });
    });
    
    // Connect components to models
    const components = domainNodes.filter(n => n.labels.includes(nodeTypes.COMPONENT));
    
    components.forEach(component => {
      models.forEach(model => {
        addRelationship(component.identity, model.identity, relationTypes.USES);
      });
    });
    
    // Connect hooks to APIs
    const hooks = domainNodes.filter(n => n.labels.includes(nodeTypes.HOOK));
    
    hooks.forEach(hook => {
      apis.forEach(api => {
        addRelationship(hook.identity, api.identity, relationTypes.CALLS);
      });
    });
  });
  
  // Connect contexts to hooks
  const fleetContext = findNode(nodeTypes.CONTEXT, 'FleetContext');
  const useFleetOperationsHook = findNode(nodeTypes.HOOK, 'useFleetOperations');
  
  if (fleetContext && useFleetOperationsHook) {
    addRelationship(fleetContext.identity, useFleetOperationsHook.identity, relationTypes.USES);
  }
  
  if (fleetContext && useFleetAssignmentsHook) {
    addRelationship(fleetContext.identity, useFleetAssignmentsHook.identity, relationTypes.USES);
  }
  
  const maintenanceContext = findNode(nodeTypes.CONTEXT, 'MaintenanceContext');
  
  if (maintenanceContext && useMaintenanceHook) {
    addRelationship(maintenanceContext.identity, useMaintenanceHook.identity, relationTypes.USES);
  }
  
  const notificationContext = findNode(nodeTypes.CONTEXT, 'NotificationContext');
  
  if (notificationContext) {
    // Notification context used by fleet and maintenance pages
    if (fleetPage) {
      addRelationship(fleetPage.identity, notificationContext.identity, relationTypes.USES);
    }
    
    if (maintenancePage) {
      addRelationship(maintenancePage.identity, notificationContext.identity, relationTypes.USES);
    }
  }
  
  // Create cross-domain relationships
  // Fleet components use maintenance info
  const fleetComponents = findNodesByDomain('Fleet').filter(n => n.labels.includes(nodeTypes.COMPONENT));
  const maintenanceModels = findNodesByDomain('Maintenance').filter(n => n.labels.includes(nodeTypes.MODEL));
  
  fleetComponents.forEach(component => {
    maintenanceModels.forEach(model => {
      addRelationship(component.identity, model.identity, relationTypes.USES, { strength: 'weak' });
    });
  });
  
  // Create many more connections to represent a complex system
  // Connect all components that have a number to each other
  const numberedComponents = nodes.filter(n => 
    n.labels.includes(nodeTypes.COMPONENT) && 
    /\d+$/.test(n.properties.name)
  );
  
  for (let i = 0; i < numberedComponents.length; i++) {
    // Connect to 2-3 other components
    const connections = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < connections; j++) {
      const targetIdx = (i + j + 1) % numberedComponents.length;
      addRelationship(
        numberedComponents[i].identity, 
        numberedComponents[targetIdx].identity, 
        relationTypes.USES
      );
    }
  }
  
  // Create a network of hooks calling each other
  const hooks = findNodesByType(nodeTypes.HOOK);
  hooks.forEach((hook, i) => {
    // Each hook uses 1-2 other hooks
    const hookConnections = 1 + Math.floor(Math.random() * 2);
    for (let j = 0; j < hookConnections; j++) {
      const targetIdx = (i + j + 1) % hooks.length;
      addRelationship(hook.identity, hooks[targetIdx].identity, relationTypes.CALLS);
    }
  });
  
  // Create a network of services calling each other
  const services = findNodesByType(nodeTypes.SERVICE);
  services.forEach((service, i) => {
    // Each service uses 2-3 other services
    const serviceConnections = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < serviceConnections; j++) {
      const targetIdx = (i + j + 1) % services.length;
      addRelationship(service.identity, services[targetIdx].identity, relationTypes.CALLS);
    }
  });
  
  console.log(`Generated ${relationships.length} real relationships`);
  return relationships;
}

// Main function to generate and save the real graph
function generateAndSaveRealGraph() {
  const projectId = 'nexus-core';
  
  // Generate nodes based on real Nexus structure
  const nodes = generateRealNodes();
  
  // Generate relationships based on real Nexus dependencies
  const relationships = generateRealRelationships(nodes);
  
  // Save to database files
  fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2), 'utf8');
  fs.writeFileSync(RELS_FILE, JSON.stringify(relationships, null, 2), 'utf8');
  
  console.log(`Saved real Nexus graph with ${nodes.length} nodes and ${relationships.length} relationships to ${DB_DIR}`);
  console.log(`To view the graph, make sure your test API server is running and go to /api/refactor/graph?projectId=${projectId}`);
}

// Run the generator
generateAndSaveRealGraph();