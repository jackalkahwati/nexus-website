"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type {
  MaintenanceTask,
  MaintenancePart,
  ServiceHistory,
  MaintenanceSchedule,
  RecurringMaintenanceTask,
  MaintenanceStatus,
  MaintenanceType,
  ServicePriority
} from '@/types/maintenance'

interface MaintenanceContextType {
  tasks: MaintenanceTask[]
  schedules: MaintenanceSchedule[]
  serviceHistory: ServiceHistory[]
  parts: MaintenancePart[]
  isLoading: boolean
  error: string | null
  createTask: (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<MaintenanceTask>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  createSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => Promise<void>
  updateSchedule: (id: string, updates: Partial<MaintenanceSchedule>) => Promise<void>
  addServiceRecord: (record: Omit<ServiceHistory, 'id'>) => Promise<void>
  manageParts: (part: MaintenancePart) => Promise<void>
  getVehicleMaintenanceHistory: (vehicleId: string) => ServiceHistory[]
  getUpcomingMaintenance: (vehicleId: string) => MaintenanceTask[]
  getOverdueMaintenance: (vehicleId: string) => MaintenanceTask[]
  calculateNextServiceDate: (vehicleId: string) => string
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined)

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([])
  const [parts, setParts] = useState<MaintenancePart[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/maintenance')
        if (!response.ok) {
          // If API fails, use demo data
          const demoTasks: MaintenanceTask[] = [
            {
              id: '1',
              vehicleId: 'v1',
              type: 'preventive',
              status: 'scheduled',
              priority: 'medium',
              title: 'Routine Vehicle Inspection',
              description: 'Complete vehicle inspection including brakes, suspension, and steering',
              scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
              estimatedDuration: 120,
              cost: 250,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              vehicleId: 'v1',
              type: 'charging',
              status: 'scheduled',
              priority: 'high',
              title: 'Charging System Maintenance',
              description: 'Inspect and test charging components, clean connections',
              scheduledDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
              estimatedDuration: 90,
              cost: 180,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '3',
              vehicleId: 'v2',
              type: 'battery',
              status: 'scheduled',
              priority: 'high',
              title: 'Battery Health Check',
              description: 'Full battery diagnostic and cell balancing',
              scheduledDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
              estimatedDuration: 150,
              cost: 350,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '4',
              vehicleId: 'v2',
              type: 'preventive',
              status: 'in_progress',
              priority: 'medium',
              title: 'Tire Rotation',
              description: 'Rotate tires and check pressure',
              scheduledDate: new Date().toISOString(),
              estimatedDuration: 60,
              cost: 120,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '5',
              vehicleId: 'v3',
              type: 'charging',
              status: 'completed',
              priority: 'critical',
              title: 'Charging Port Repair',
              description: 'Replace damaged charging port and test functionality',
              scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              completedDate: new Date().toISOString(),
              estimatedDuration: 180,
              cost: 450,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '6',
              vehicleId: 'v3',
              type: 'battery',
              status: 'overdue',
              priority: 'critical',
              title: 'Battery Replacement',
              description: 'Replace degraded battery pack',
              scheduledDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              estimatedDuration: 240,
              cost: 2800,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          
          const demoServiceHistory: ServiceHistory[] = [
            {
              id: 'sh1',
              vehicleId: 'v1',
              maintenanceId: '1',
              type: 'preventive',
              description: 'Annual vehicle inspection completed. All systems functioning normally.',
              performedBy: 'John Smith',
              performedAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
              cost: 350,
              mileage: 15000,
              parts: [],
              notes: ['Brake pads at 70% life', 'Suspension in good condition', 'Tire pressure adjusted']
            },
            {
              id: 'sh2',
              vehicleId: 'v1',
              maintenanceId: '2',
              type: 'charging',
              description: 'Charging system maintenance and diagnostics performed.',
              performedBy: 'Sarah Johnson',
              performedAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
              cost: 180,
              mileage: 18000,
              parts: [
                {
                  id: 'p2',
                  name: 'Charging Cable',
                  partNumber: 'CC-2023-A',
                  quantity: 1,
                  cost: 85,
                  status: 'installed',
                  supplier: 'EV Parts Co'
                }
              ],
              notes: ['Charging efficiency: 95%', 'All connections cleaned and tested', 'Replaced worn charging cable']
            },
            {
              id: 'sh3',
              vehicleId: 'v2',
              maintenanceId: '3',
              type: 'battery',
              description: 'Battery health check and cell balancing completed.',
              performedBy: 'Mike Chen',
              performedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
              cost: 250,
              mileage: 22000,
              parts: [],
              notes: ['Battery health: 92%', 'All cells balanced within spec', 'Thermal management system checked']
            },
            {
              id: 'sh4',
              vehicleId: 'v3',
              maintenanceId: '5',
              type: 'charging',
              description: 'Emergency charging port repair after damage.',
              performedBy: 'Alex Turner',
              performedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
              cost: 450,
              mileage: 25000,
              parts: [
                {
                  id: 'p1',
                  name: 'Charging Port Assembly',
                  partNumber: 'CP-2023-X',
                  quantity: 1,
                  cost: 300,
                  status: 'installed',
                  supplier: 'EV Parts Co'
                }
              ],
              notes: ['Port replaced and tested', 'Charging functionality restored', 'Impact damage assessment completed']
            },
            {
              id: 'sh5',
              vehicleId: 'v2',
              maintenanceId: '6',
              type: 'emergency',
              description: 'Emergency brake system repair.',
              performedBy: 'David Wilson',
              performedAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
              cost: 850,
              mileage: 23500,
              parts: [
                {
                  id: 'p3',
                  name: 'Brake Caliper',
                  partNumber: 'BC-2023-R',
                  quantity: 1,
                  cost: 400,
                  status: 'installed',
                  supplier: 'Auto Parts Plus'
                },
                {
                  id: 'p4',
                  name: 'Brake Pads',
                  partNumber: 'BP-2023-H',
                  quantity: 2,
                  cost: 150,
                  status: 'installed',
                  supplier: 'Auto Parts Plus'
                }
              ],
              notes: ['Emergency brake repair completed', 'New caliper and pads installed', 'Brake fluid flushed and replaced']
            },
            {
              id: 'sh6',
              vehicleId: 'v1',
              maintenanceId: '7',
              type: 'preventive',
              description: 'Preventive maintenance based on sensor data.',
              performedBy: 'Emily Chen',
              performedAt: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
              cost: 320,
              mileage: 19500,
              parts: [
                {
                  id: 'p5',
                  name: 'Wheel Bearing',
                  partNumber: 'WB-2023-F',
                  quantity: 1,
                  cost: 180,
                  status: 'installed',
                  supplier: 'Premium Auto Parts'
                }
              ],
              notes: ['Bearing replacement based on vibration analysis', 'Alignment checked and adjusted', 'Updated sensor calibration']
            },
            {
              id: 'sh7',
              vehicleId: 'v3',
              maintenanceId: '8',
              type: 'corrective',
              description: 'AC system repair and refrigerant recharge.',
              performedBy: 'James Martinez',
              performedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
              cost: 580,
              mileage: 24800,
              parts: [
                {
                  id: 'p6',
                  name: 'AC Compressor',
                  partNumber: 'AC-2023-C',
                  quantity: 1,
                  cost: 420,
                  status: 'installed',
                  supplier: 'Climate Control Systems'
                }
              ],
              notes: ['AC compressor replaced', 'System leak tested', 'Refrigerant recharged to spec']
            },
            {
              id: 'sh8',
              vehicleId: 'v2',
              maintenanceId: '9',
              type: 'preventive',
              description: 'Quarterly preventive maintenance service.',
              performedBy: 'Sarah Johnson',
              performedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              cost: 290,
              mileage: 23800,
              parts: [],
              notes: ['All fluids checked and topped off', 'Software systems updated', 'Tire rotation performed']
            }
          ];
          
          setTasks(demoTasks);
          setServiceHistory(demoServiceHistory);
          setIsLoading(false);
          return;
        }
        const data = await response.json()
        setTasks(data.records || []) // Extract the records array from the response
        
        // Add demo service history in success case too
        const demoServiceHistory: ServiceHistory[] = [
          {
            id: 'sh1',
            vehicleId: 'v1',
            maintenanceId: '1',
            type: 'preventive',
            description: 'Annual vehicle inspection completed. All systems functioning normally.',
            performedBy: 'John Smith',
            performedAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
            cost: 350,
            mileage: 15000,
            parts: [],
            notes: ['Brake pads at 70% life', 'Suspension in good condition', 'Tire pressure adjusted']
          },
          {
            id: 'sh2',
            vehicleId: 'v1',
            maintenanceId: '2',
            type: 'charging',
            description: 'Charging system maintenance and diagnostics performed.',
            performedBy: 'Sarah Johnson',
            performedAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
            cost: 180,
            mileage: 18000,
            parts: [
              {
                id: 'p2',
                name: 'Charging Cable',
                partNumber: 'CC-2023-A',
                quantity: 1,
                cost: 85,
                status: 'installed',
                supplier: 'EV Parts Co'
              }
            ],
            notes: ['Charging efficiency: 95%', 'All connections cleaned and tested', 'Replaced worn charging cable']
          },
          {
            id: 'sh3',
            vehicleId: 'v2',
            maintenanceId: '3',
            type: 'battery',
            description: 'Battery health check and cell balancing completed.',
            performedBy: 'Mike Chen',
            performedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
            cost: 250,
            mileage: 22000,
            parts: [],
            notes: ['Battery health: 92%', 'All cells balanced within spec', 'Thermal management system checked']
          },
          {
            id: 'sh4',
            vehicleId: 'v3',
            maintenanceId: '5',
            type: 'charging',
            description: 'Emergency charging port repair after damage.',
            performedBy: 'Alex Turner',
            performedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            cost: 450,
            mileage: 25000,
            parts: [
              {
                id: 'p1',
                name: 'Charging Port Assembly',
                partNumber: 'CP-2023-X',
                quantity: 1,
                cost: 300,
                status: 'installed',
                supplier: 'EV Parts Co'
              }
            ],
            notes: ['Port replaced and tested', 'Charging functionality restored', 'Impact damage assessment completed']
          }
        ];
        setServiceHistory(demoServiceHistory);
      } catch (err) {
        // If error occurs, use the same demo data
        const demoTasks: MaintenanceTask[] = [
          {
            id: '1',
            vehicleId: 'v1',
            type: 'preventive',
            status: 'scheduled',
            priority: 'medium',
            title: 'Routine Vehicle Inspection',
            description: 'Complete vehicle inspection including brakes, suspension, and steering',
            scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            estimatedDuration: 120,
            cost: 250,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            vehicleId: 'v1',
            type: 'charging',
            status: 'scheduled',
            priority: 'high',
            title: 'Charging System Maintenance',
            description: 'Inspect and test charging components, clean connections',
            scheduledDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            estimatedDuration: 90,
            cost: 180,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            vehicleId: 'v2',
            type: 'battery',
            status: 'scheduled',
            priority: 'high',
            title: 'Battery Health Check',
            description: 'Full battery diagnostic and cell balancing',
            scheduledDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
            estimatedDuration: 150,
            cost: 350,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            vehicleId: 'v2',
            type: 'preventive',
            status: 'in_progress',
            priority: 'medium',
            title: 'Tire Rotation',
            description: 'Rotate tires and check pressure',
            scheduledDate: new Date().toISOString(),
            estimatedDuration: 60,
            cost: 120,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            vehicleId: 'v3',
            type: 'charging',
            status: 'completed',
            priority: 'critical',
            title: 'Charging Port Repair',
            description: 'Replace damaged charging port and test functionality',
            scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            completedDate: new Date().toISOString(),
            estimatedDuration: 180,
            cost: 450,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '6',
            vehicleId: 'v3',
            type: 'battery',
            status: 'overdue',
            priority: 'critical',
            title: 'Battery Replacement',
            description: 'Replace degraded battery pack',
            scheduledDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            estimatedDuration: 240,
            cost: 2800,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const demoServiceHistory: ServiceHistory[] = [
          {
            id: 'sh1',
            vehicleId: 'v1',
            maintenanceId: '1',
            type: 'preventive',
            description: 'Annual vehicle inspection completed. All systems functioning normally.',
            performedBy: 'John Smith',
            performedAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
            cost: 350,
            mileage: 15000,
            parts: [],
            notes: ['Brake pads at 70% life', 'Suspension in good condition', 'Tire pressure adjusted']
          },
          {
            id: 'sh2',
            vehicleId: 'v1',
            maintenanceId: '2',
            type: 'charging',
            description: 'Charging system maintenance and diagnostics performed.',
            performedBy: 'Sarah Johnson',
            performedAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
            cost: 180,
            mileage: 18000,
            parts: [
              {
                id: 'p2',
                name: 'Charging Cable',
                partNumber: 'CC-2023-A',
                quantity: 1,
                cost: 85,
                status: 'installed',
                supplier: 'EV Parts Co'
              }
            ],
            notes: ['Charging efficiency: 95%', 'All connections cleaned and tested', 'Replaced worn charging cable']
          },
          {
            id: 'sh3',
            vehicleId: 'v2',
            maintenanceId: '3',
            type: 'battery',
            description: 'Battery health check and cell balancing completed.',
            performedBy: 'Mike Chen',
            performedAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
            cost: 250,
            mileage: 22000,
            parts: [],
            notes: ['Battery health: 92%', 'All cells balanced within spec', 'Thermal management system checked']
          },
          {
            id: 'sh4',
            vehicleId: 'v3',
            maintenanceId: '5',
            type: 'charging',
            description: 'Emergency charging port repair after damage.',
            performedBy: 'Alex Turner',
            performedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            cost: 450,
            mileage: 25000,
            parts: [
              {
                id: 'p1',
                name: 'Charging Port Assembly',
                partNumber: 'CP-2023-X',
                quantity: 1,
                cost: 300,
                status: 'installed',
                supplier: 'EV Parts Co'
              }
            ],
            notes: ['Port replaced and tested', 'Charging functionality restored', 'Impact damage assessment completed']
          }
        ];
        
        setTasks(demoTasks);
        setServiceHistory(demoServiceHistory);
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const createTask = useCallback(async (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      setTasks(prev => [...prev, newTask])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<MaintenanceTask>) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSchedule = useCallback(async (schedule: Omit<MaintenanceSchedule, 'id'>) => {
    try {
      setIsLoading(true)
      // TODO: API call to create schedule
      const newSchedule: MaintenanceSchedule = {
        ...schedule,
        id: Math.random().toString(36).substr(2, 9)
      }
      setSchedules(prev => [...prev, newSchedule])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create schedule')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSchedule = useCallback(async (id: string, updates: Partial<MaintenanceSchedule>) => {
    try {
      setIsLoading(true)
      // TODO: API call to update schedule
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, ...updates }
          : schedule
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update schedule')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addServiceRecord = useCallback(async (record: Omit<ServiceHistory, 'id'>) => {
    try {
      setIsLoading(true)
      // TODO: API call to add service record
      const newRecord: ServiceHistory = {
        ...record,
        id: Math.random().toString(36).substr(2, 9)
      }
      setServiceHistory(prev => [...prev, newRecord])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service record')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const manageParts = useCallback(async (part: MaintenancePart) => {
    try {
      setIsLoading(true)
      // TODO: API call to manage parts
      setParts(prev => {
        const index = prev.findIndex(p => p.id === part.id)
        if (index >= 0) {
          return [...prev.slice(0, index), part, ...prev.slice(index + 1)]
        }
        return [...prev, part]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to manage parts')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getVehicleMaintenanceHistory = useCallback((vehicleId: string) => {
    return serviceHistory.filter(record => record.vehicleId === vehicleId)
  }, [serviceHistory])

  const getUpcomingMaintenance = useCallback((vehicleId: string) => {
    const now = new Date()
    return tasks.filter(task => 
      task.vehicleId === vehicleId && 
      task.status === 'scheduled' &&
      new Date(task.scheduledDate) > now
    )
  }, [tasks])

  const getOverdueMaintenance = useCallback((vehicleId: string) => {
    const now = new Date()
    return tasks.filter(task => 
      task.vehicleId === vehicleId && 
      task.status === 'scheduled' &&
      new Date(task.scheduledDate) < now
    )
  }, [tasks])

  const calculateNextServiceDate = useCallback((vehicleId: string) => {
    const schedule = schedules.find(s => s.vehicleId === vehicleId)
    if (!schedule) return new Date().toISOString()
    
    // Find the earliest upcoming task
    const upcomingTasks = getUpcomingMaintenance(vehicleId)
    if (upcomingTasks.length === 0) return schedule.nextServiceDate
    
    return upcomingTasks.reduce((earliest, task) => 
      new Date(task.scheduledDate) < new Date(earliest) 
        ? task.scheduledDate 
        : earliest
    , upcomingTasks[0].scheduledDate)
  }, [schedules, getUpcomingMaintenance])

  const value = {
    tasks,
    schedules,
    serviceHistory,
    parts,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    createSchedule,
    updateSchedule,
    addServiceRecord,
    manageParts,
    getVehicleMaintenanceHistory,
    getUpcomingMaintenance,
    getOverdueMaintenance,
    calculateNextServiceDate
  }

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  )
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext)
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider')
  }
  return context
} 