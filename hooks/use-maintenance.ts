import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface MaintenanceTask {
  id: string
  title: string
  description?: string
  type: string
  priority: string
  status: string
  dueDate?: Date
  completedAt?: Date
  vehicleId: string
  technicianId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  vehicle: {
    id: string
    name: string
    type: string
    status: string
  }
  technician?: {
    id: string
    name: string
    email: string
    specialties: string[]
    availability: string
  }
}

export interface MaintenanceMetrics {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  completionRate: number
  averageCompletionTime: number
  tasksByPriority: Record<string, number>
  tasksByType: Record<string, number>
  monthlyCompletion: {
    completed: number
    total: number
    rate: number
  }
}

interface MaintenanceFilters {
  vehicleId?: string
  technicianId?: string
  status?: string
  priority?: string
  type?: string
}

export function useMaintenance(initialFilters?: MaintenanceFilters) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [metrics, setMetrics] = useState<MaintenanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<MaintenanceFilters>(initialFilters || {})

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.set(key, value)
        }
      })

      const response = await fetch(`/api/maintenance/tasks?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance tasks')
      }
      const data = await response.json()
      setTasks(data.tasks)
      setMetrics(data.metrics)
      setError(null)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load maintenance tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt' | 'vehicle' | 'technician'>) => {
    try {
      const response = await fetch('/api/maintenance/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) {
        throw new Error('Failed to create maintenance task')
      }
      const newTask = await response.json()
      setTasks(prev => [...prev, newTask])
      toast.success('Maintenance task created successfully')
      return newTask
    } catch (err) {
      toast.error('Failed to create maintenance task')
      throw err
    }
  }

  const assignTask = async (taskId: string, technicianId: string) => {
    try {
      const response = await fetch(`/api/maintenance/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technicianId }),
      })
      if (!response.ok) {
        throw new Error('Failed to assign maintenance task')
      }
      const updatedTask = await response.json()
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      )
      toast.success('Task assigned successfully')
      return updatedTask
    } catch (err) {
      toast.error('Failed to assign task')
      throw err
    }
  }

  const completeTask = async (taskId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/maintenance/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })
      if (!response.ok) {
        throw new Error('Failed to complete maintenance task')
      }
      const updatedTask = await response.json()
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      )
      toast.success('Task completed successfully')
      return updatedTask
    } catch (err) {
      toast.error('Failed to complete task')
      throw err
    }
  }

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt' | 'vehicle' | 'technician'>>
  ) => {
    try {
      const response = await fetch(`/api/maintenance/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update maintenance task')
      }
      const updatedTask = await response.json()
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updatedTask : task
        )
      )
      toast.success('Task updated successfully')
      return updatedTask
    } catch (err) {
      toast.error('Failed to update task')
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/maintenance/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete maintenance task')
      }
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [JSON.stringify(filters)])

  return {
    tasks,
    metrics,
    isLoading,
    error,
    filters,
    setFilters,
    createTask,
    assignTask,
    completeTask,
    updateTask,
    deleteTask,
    fetchTasks,
  }
} 