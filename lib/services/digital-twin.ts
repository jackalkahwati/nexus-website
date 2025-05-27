import { EventEmitter } from 'events';
import { DigitalTwinState, AutonomousVehicle } from 'types/autonomy';
import logger from 'lib/logger';

interface SimulationConfig {
  updateInterval: number; // milliseconds
  simulationSpeed: number; // multiplier for real-time
  weatherConditions: string[];
  trafficPatterns: Record<string, number>;
}

export class DigitalTwinService extends EventEmitter {
  private vehicles: Map<string, DigitalTwinState>;
  private simulationInterval: NodeJS.Timeout | null;
  private config: SimulationConfig;
  private isRunning: boolean;

  constructor(config: Partial<SimulationConfig> = {}) {
    super();
    this.vehicles = new Map();
    this.simulationInterval = null;
    this.isRunning = false;
    this.config = {
      updateInterval: 1000,
      simulationSpeed: 1,
      weatherConditions: ['clear', 'rain', 'snow', 'fog'],
      trafficPatterns: {
        low: 0.2,
        medium: 0.5,
        high: 0.8,
      },
      ...config
    };
  }

  public addVehicle(vehicle: AutonomousVehicle): void {
    const initialState: DigitalTwinState = {
      id: `twin_${vehicle.id}`,
      vehicleId: vehicle.id,
      timestamp: new Date().toISOString(),
      position: {
        latitude: 0,
        longitude: 0,
        altitude: 0
      },
      motion: {
        speed: 0,
        acceleration: 0,
        heading: 0
      },
      systemStatus: {
        batteryLevel: 100,
        autonomyLevel: vehicle.capabilities.level,
        safetyStatus: 'normal',
        currentMode: vehicle.currentMode
      },
      environment: {
        weather: 'clear',
        trafficDensity: 0,
        roadConditions: 'dry',
        visibility: 1
      }
    };

    this.vehicles.set(vehicle.id, initialState);
    this.emit('vehicleAdded', initialState);
    logger.info('Vehicle added to digital twin simulation', { vehicleId: vehicle.id });
  }

  public removeVehicle(vehicleId: string): void {
    this.vehicles.delete(vehicleId);
    this.emit('vehicleRemoved', vehicleId);
    logger.info('Vehicle removed from digital twin simulation', { vehicleId });
  }

  public startSimulation(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.simulationInterval = setInterval(() => {
      this.updateSimulation();
    }, this.config.updateInterval);

    logger.info('Digital twin simulation started', {
      vehicleCount: this.vehicles.size,
      updateInterval: this.config.updateInterval
    });
  }

  public stopSimulation(): void {
    if (!this.isRunning) return;

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isRunning = false;
    logger.info('Digital twin simulation stopped');
  }

  public getVehicleState(vehicleId: string): DigitalTwinState | undefined {
    return this.vehicles.get(vehicleId);
  }

  public getAllVehicleStates(): DigitalTwinState[] {
    return Array.from(this.vehicles.values());
  }

  private updateSimulation(): void {
    const timestamp = new Date().toISOString();

    for (const [vehicleId, state] of this.vehicles.entries()) {
      // Update vehicle state based on simulation rules
      const updatedState = this.calculateNextState(state);
      this.vehicles.set(vehicleId, updatedState);
      this.emit('stateUpdated', updatedState);
    }
  }

  private calculateNextState(currentState: DigitalTwinState): DigitalTwinState {
    // Simulate basic physics and environmental changes
    const deltaTime = (this.config.updateInterval * this.config.simulationSpeed) / 1000;

    // Update position based on motion
    const newPosition = {
      latitude: currentState.position.latitude + (Math.random() - 0.5) * 0.0001,
      longitude: currentState.position.longitude + (Math.random() - 0.5) * 0.0001,
      altitude: currentState.position.altitude
    };

    // Simulate realistic motion changes
    const newMotion = {
      speed: Math.max(0, currentState.motion.speed + (Math.random() - 0.5) * 5),
      acceleration: (Math.random() - 0.5) * 2,
      heading: (currentState.motion.heading + Math.random() * 5) % 360
    };

    // Simulate battery drain
    const newBatteryLevel = Math.max(0, currentState.systemStatus.batteryLevel - 0.01);

    // Randomly update environmental conditions
    const weather = Math.random() < 0.01 
      ? this.config.weatherConditions[Math.floor(Math.random() * this.config.weatherConditions.length)]
      : currentState.environment.weather;

    const newVisibility = Math.min(1, Math.max(0.1, currentState.environment.visibility + (Math.random() - 0.5) * 0.1));
    const newTrafficDensity = Math.random();

    return {
      ...currentState,
      timestamp: new Date().toISOString(),
      position: newPosition,
      motion: newMotion,
      systemStatus: {
        ...currentState.systemStatus,
        batteryLevel: newBatteryLevel,
        safetyStatus: this.calculateSafetyStatus(newMotion, newBatteryLevel, weather, newVisibility, newTrafficDensity)
      },
      environment: {
        ...currentState.environment,
        weather,
        trafficDensity: newTrafficDensity,
        visibility: newVisibility
      }
    };
  }

  private calculateSafetyStatus(
    motion: DigitalTwinState['motion'],
    batteryLevel: number,
    weather: string,
    visibility: number,
    trafficDensity: number
  ): DigitalTwinState['systemStatus']['safetyStatus'] {
    // Calculate risk score based on multiple factors with weighted importance
    let riskScore = 0;

    // Battery level risk (0-3 points)
    if (batteryLevel < 5) riskScore += 3;
    else if (batteryLevel < 15) riskScore += 2;
    else if (batteryLevel < 25) riskScore += 1;

    // Speed risk (0-4 points)
    if (motion.speed > 130) riskScore += 4;
    else if (motion.speed > 110) riskScore += 3;
    else if (motion.speed > 90) riskScore += 2;
    else if (motion.speed > 70) riskScore += 1;

    // Acceleration risk (0-2 points)
    if (Math.abs(motion.acceleration) > 3) riskScore += 2;
    else if (Math.abs(motion.acceleration) > 2) riskScore += 1;

    // Weather risk (0-3 points)
    const weatherRisk = {
      'snow': 3,
      'heavy_rain': 3,
      'rain': 2,
      'fog': 2,
      'wind': 1,
      'cloudy': 0,
      'clear': 0
    };
    riskScore += weatherRisk[weather as keyof typeof weatherRisk] || 0;

    // Visibility risk (0-3 points)
    if (visibility < 0.2) riskScore += 3;
    else if (visibility < 0.4) riskScore += 2;
    else if (visibility < 0.6) riskScore += 1;

    // Traffic density risk (0-3 points)
    if (trafficDensity > 0.9) riskScore += 3;
    else if (trafficDensity > 0.7) riskScore += 2;
    else if (trafficDensity > 0.5) riskScore += 1;

    // Combined risk factors (0-2 points)
    if (motion.speed > 100 && visibility < 0.5) riskScore += 1;
    if (batteryLevel < 20 && trafficDensity > 0.7) riskScore += 1;

    // Dynamic thresholds based on conditions
    const criticalThreshold = weather === 'snow' || weather === 'heavy_rain' ? 5 : 7;
    const warningThreshold = weather === 'snow' || weather === 'heavy_rain' ? 3 : 4;

    // Determine status based on total risk score and conditions
    if (riskScore >= criticalThreshold) return 'critical';
    if (riskScore >= warningThreshold) return 'warning';
    return 'normal';
  }
}
