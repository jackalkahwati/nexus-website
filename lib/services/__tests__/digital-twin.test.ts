import { jest } from '@jest/globals'
import { DigitalTwinService } from '../digital-twin'
import type { AutonomousVehicle, DigitalTwinState } from '@/types/autonomy'

// Mock logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

describe('DigitalTwinService', () => {
  let digitalTwinService: DigitalTwinService
  let mockVehicle: AutonomousVehicle

  beforeEach(() => {
    jest.useFakeTimers()
    
    mockVehicle = {
      id: 'test-vehicle-1',
      name: 'Test Vehicle 1',
      status: 'active',
      location: 'Test Location',
      lastUpdate: new Date().toISOString(),
      battery: 100,
      speed: 0,
      driver: 'AI System',
      capabilities: {
        level: 4,
        features: {
          autonomousEmergencyBraking: true,
          laneKeeping: true,
          adaptiveCruiseControl: true,
          selfParking: true,
          fullAutonomy: true,
        },
        operationalDesignDomain: {
          weatherConditions: ['clear', 'rain'],
          timeOfDay: ['day', 'night'],
          roadTypes: ['highway', 'urban'],
          maxSpeed: 120,
          geofenceRegions: ['region-1'],
        },
      },
      currentMode: 'autonomous',
      operationalStatus: {
        autonomyEnabled: true,
        safetySystemsStatus: {
          emergencyBraking: true,
          laneKeeping: true,
        },
        sensorStatus: {
          lidar: 'active',
          camera: 'active',
          radar: 'active',
        },
      },
    }

    digitalTwinService = new DigitalTwinService({
      updateInterval: 100,
      simulationSpeed: 1,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    digitalTwinService.stopSimulation()
  })

  describe('Vehicle Management', () => {
    it('should add a vehicle to simulation', () => {
      const stateUpdateSpy = jest.fn()
      digitalTwinService.on('vehicleAdded', stateUpdateSpy)

      digitalTwinService.addVehicle(mockVehicle)

      expect(stateUpdateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId: mockVehicle.id,
          systemStatus: expect.objectContaining({
            autonomyLevel: mockVehicle.capabilities.level,
            currentMode: mockVehicle.currentMode,
          }),
        })
      )
    })

    it('should remove a vehicle from simulation', () => {
      const vehicleRemovedSpy = jest.fn()
      digitalTwinService.on('vehicleRemoved', vehicleRemovedSpy)

      digitalTwinService.addVehicle(mockVehicle)
      digitalTwinService.removeVehicle(mockVehicle.id)

      expect(vehicleRemovedSpy).toHaveBeenCalledWith(mockVehicle.id)
      expect(digitalTwinService.getVehicleState(mockVehicle.id)).toBeUndefined()
    })
  })

  describe('Simulation Control', () => {
    it('should start and stop simulation', () => {
      const stateUpdateSpy = jest.fn()
      digitalTwinService.on('stateUpdated', stateUpdateSpy)

      digitalTwinService.addVehicle(mockVehicle)
      digitalTwinService.startSimulation()

      // Fast-forward time
      jest.advanceTimersByTime(500)

      expect(stateUpdateSpy).toHaveBeenCalled()
      expect(stateUpdateSpy.mock.calls.length).toBeGreaterThan(1)

      digitalTwinService.stopSimulation()
      stateUpdateSpy.mockClear()

      // Fast-forward time again
      jest.advanceTimersByTime(500)

      expect(stateUpdateSpy).not.toHaveBeenCalled()
    })

    it('should not start simulation twice', () => {
      const startSpy = jest.spyOn(digitalTwinService as any, 'updateSimulation')

      digitalTwinService.startSimulation()
      digitalTwinService.startSimulation() // Second call should be ignored

      jest.advanceTimersByTime(200)

      // Should only be called twice (two update intervals)
      expect(startSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('State Updates', () => {
    it('should update vehicle state periodically', () => {
      digitalTwinService.addVehicle(mockVehicle)
      const initialState = digitalTwinService.getVehicleState(mockVehicle.id)
      
      digitalTwinService.startSimulation()
      jest.advanceTimersByTime(100)

      const updatedState = digitalTwinService.getVehicleState(mockVehicle.id)
      
      expect(updatedState).toBeDefined()
      expect(updatedState?.timestamp).not.toBe(initialState?.timestamp)
      expect(updatedState?.systemStatus.batteryLevel).toBeLessThan(initialState?.systemStatus.batteryLevel!)
    })

    it('should calculate safety status correctly', () => {
      digitalTwinService.addVehicle(mockVehicle)
      digitalTwinService.startSimulation()

      // Simulate until we get different safety statuses
      const states: DigitalTwinState[] = []
      const stateUpdateSpy = jest.fn((state: DigitalTwinState) => {
        states.push(state)
      })

      digitalTwinService.on('stateUpdated', stateUpdateSpy)

      // Advance time significantly to capture various states
      for (let i = 0; i < 1000; i++) {
        jest.advanceTimersByTime(100)
      }

      const safetyStatuses = new Set(states.map(s => s.systemStatus.safetyStatus))
      expect(safetyStatuses.size).toBeGreaterThan(1)
    })
  })

  describe('Environmental Simulation', () => {
    it('should simulate weather changes', () => {
      digitalTwinService.addVehicle(mockVehicle)
      digitalTwinService.startSimulation()

      const weatherConditions = new Set<string>()
      const stateUpdateSpy = jest.fn((state: DigitalTwinState) => {
        weatherConditions.add(state.environment.weather)
      })

      digitalTwinService.on('stateUpdated', stateUpdateSpy)

      // Advance time significantly to capture weather changes
      for (let i = 0; i < 1000; i++) {
        jest.advanceTimersByTime(100)
      }

      expect(weatherConditions.size).toBeGreaterThan(1)
    })

    it('should maintain realistic traffic density values', () => {
      digitalTwinService.addVehicle(mockVehicle)
      digitalTwinService.startSimulation()

      const trafficDensities: number[] = []
      const stateUpdateSpy = jest.fn((state: DigitalTwinState) => {
        trafficDensities.push(state.environment.trafficDensity)
      })

      digitalTwinService.on('stateUpdated', stateUpdateSpy)

      // Advance time to capture multiple traffic density updates
      for (let i = 0; i < 100; i++) {
        jest.advanceTimersByTime(100)
      }

      trafficDensities.forEach(density => {
        expect(density).toBeGreaterThanOrEqual(0)
        expect(density).toBeLessThanOrEqual(1)
      })
    })
  })
}) 