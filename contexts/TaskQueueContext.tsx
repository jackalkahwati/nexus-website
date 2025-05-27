"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Task, Queue, Worker, TaskResult, QueueMetrics } from '@/types/task-queue'

interface TaskQueueContextType {
  queues: Queue[]
  tasks: Task[]
  workers: Worker[]
  metrics: QueueMetrics
  isLoading: boolean
  error: string | null
  createQueue: (name: string, type: string, options?: Partial<Queue>) => Promise<Queue>
  updateQueue: (id: string, updates: Partial<Queue>) => Promise<Queue>
  deleteQueue: (id: string) => Promise<void>
  addTask: (queueId: string, name: string, type: string, data: any, options?: Partial<Task>) => Promise<Task>
  cancelTask: (taskId: string) => Promise<void>
  retryTask: (taskId: string) => Promise<void>
  registerWorker: (type: string) => Promise<Worker>
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<Worker>
  removeWorker: (id: string) => Promise<void>
  refreshQueues: () => Promise<void>
  refreshTasks: () => Promise<void>
  refreshWorkers: () => Promise<void>
}

const TaskQueueContext = createContext<TaskQueueContextType | undefined>(undefined)

interface TaskWithTiming extends Task {
  startedAt?: string
  completedAt?: string
}

export function TaskQueueProvider({ children }: { children: React.ReactNode }) {
  const [queues, setQueues] = useState<Queue[]>([])
  const [tasks, setTasks] = useState<TaskWithTiming[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [metrics, setMetrics] = useState<QueueMetrics>({
    totalTasks: 0,
    pendingTasks: 0,
    processingTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageProcessingTime: 0,
    successRate: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshQueues = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/queues')
      if (!response.ok) throw new Error('Failed to fetch queues')
      const data = await response.json()
      setQueues(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queues')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data: TaskWithTiming[] = await response.json()
      setTasks(data)

      // Update metrics
      const totalTasks = data.length
      const pendingTasks = data.filter((t: TaskWithTiming) => t.status === 'pending').length
      const processingTasks = data.filter((t: TaskWithTiming) => t.status === 'processing').length
      const completedTasks = data.filter((t: TaskWithTiming) => t.status === 'completed').length
      const failedTasks = data.filter((t: TaskWithTiming) => t.status === 'failed').length

      const completedTasksWithTime = data.filter((t: TaskWithTiming) => 
        t.status === 'completed' && t.startedAt && t.completedAt
      )
      
      const totalProcessingTime = completedTasksWithTime.reduce((sum: number, task: TaskWithTiming) => {
        const start = new Date(task.startedAt!).getTime()
        const end = new Date(task.completedAt!).getTime()
        return sum + (end - start)
      }, 0)

      setMetrics({
        totalTasks,
        pendingTasks,
        processingTasks,
        completedTasks,
        failedTasks,
        averageProcessingTime: completedTasksWithTime.length ? totalProcessingTime / completedTasksWithTime.length : 0,
        successRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshWorkers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/workers')
      if (!response.ok) throw new Error('Failed to fetch workers')
      const data = await response.json()
      setWorkers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workers')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createQueue = useCallback(async (name: string, type: string, options?: Partial<Queue>): Promise<Queue> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, ...options })
      })
      if (!response.ok) throw new Error('Failed to create queue')
      const queue = await response.json()
      setQueues(prev => [...prev, queue])
      return queue
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create queue')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateQueue = useCallback(async (id: string, updates: Partial<Queue>): Promise<Queue> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/queues?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update queue')
      const updatedQueue = await response.json()
      setQueues(prev => prev.map(q => q.id === id ? updatedQueue : q))
      return updatedQueue
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update queue')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteQueue = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/queues?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete queue')
      setQueues(prev => prev.filter(q => q.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete queue')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTask = useCallback(async (
    queueId: string,
    name: string,
    type: string,
    data: any,
    options?: Partial<Task>
  ): Promise<Task> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, name, type, data, ...options })
      })
      if (!response.ok) throw new Error('Failed to add task')
      const task = await response.json()
      setTasks(prev => [...prev, task])
      return task
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelTask = useCallback(async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tasks/${taskId}/cancel`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to cancel task')
      await refreshTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [refreshTasks])

  const retryTask = useCallback(async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tasks/${taskId}/retry`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to retry task')
      await refreshTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [refreshTasks])

  const registerWorker = useCallback(async (type: string): Promise<Worker> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      if (!response.ok) throw new Error('Failed to register worker')
      const worker = await response.json()
      setWorkers(prev => [...prev, worker])
      return worker
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register worker')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateWorker = useCallback(async (id: string, updates: Partial<Worker>): Promise<Worker> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/workers?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update worker')
      const updatedWorker = await response.json()
      setWorkers(prev => prev.map(w => w.id === id ? updatedWorker : w))
      return updatedWorker
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update worker')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeWorker = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/workers?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to remove worker')
      setWorkers(prev => prev.filter(w => w.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove worker')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshQueues()
    refreshTasks()
    refreshWorkers()
  }, [refreshQueues, refreshTasks, refreshWorkers])

  const value = {
    queues,
    tasks,
    workers,
    metrics,
    isLoading,
    error,
    createQueue,
    updateQueue,
    deleteQueue,
    addTask,
    cancelTask,
    retryTask,
    registerWorker,
    updateWorker,
    removeWorker,
    refreshQueues,
    refreshTasks,
    refreshWorkers,
  }

  return (
    <TaskQueueContext.Provider value={value}>
      {children}
    </TaskQueueContext.Provider>
  )
}

export function useTaskQueue() {
  const context = useContext(TaskQueueContext)
  if (context === undefined) {
    throw new Error('useTaskQueue must be used within a TaskQueueProvider')
  }
  return context
} 