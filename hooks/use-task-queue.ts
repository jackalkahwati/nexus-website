import { useCallback } from 'react'
import { useTaskQueue } from '@/contexts/TaskQueueContext'
import type { Task, Queue } from '@/types/task-queue'

interface UseTaskQueueOptions {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useTaskQueueMutation(options: UseTaskQueueOptions = {}) {
  const { addTask, createQueue } = useTaskQueue()

  const enqueueTask = useCallback(async (
    queueId: string,
    name: string,
    type: string,
    data: any,
    taskOptions: Partial<Task> = {}
  ) => {
    try {
      const task = await addTask(queueId, name, type, data, taskOptions)
      options.onSuccess?.(task)
      return task
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error('Failed to enqueue task'))
      throw error
    }
  }, [addTask, options])

  const createNewQueue = useCallback(async (
    name: string,
    type: string,
    queueOptions: Partial<Queue> = {}
  ) => {
    try {
      const queue = await createQueue(name, type, queueOptions)
      options.onSuccess?.(queue)
      return queue
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error('Failed to create queue'))
      throw error
    }
  }, [createQueue, options])

  return {
    enqueueTask,
    createNewQueue
  }
}

interface UseTaskQueueQueryOptions {
  queueId?: string
  type?: string
  status?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useTaskQueueQuery(options: UseTaskQueueQueryOptions = {}) {
  const { queues, tasks, workers, metrics, isLoading, error, refreshQueues, refreshTasks, refreshWorkers } = useTaskQueue()

  const filteredTasks = tasks.filter(task => {
    if (options.queueId && task.queueId !== options.queueId) return false
    if (options.type && task.type !== options.type) return false
    if (options.status && task.status !== options.status) return false
    return true
  })

  const filteredQueues = queues.filter(queue => {
    if (options.type && queue.type !== options.type) return false
    return true
  })

  const refresh = useCallback(async () => {
    try {
      await Promise.all([
        refreshQueues(),
        refreshTasks(),
        refreshWorkers()
      ])
      options.onSuccess?.({ queues, tasks, workers, metrics })
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error('Failed to refresh data'))
    }
  }, [refreshQueues, refreshTasks, refreshWorkers, queues, tasks, workers, metrics, options])

  return {
    queues: filteredQueues,
    tasks: filteredTasks,
    workers,
    metrics,
    isLoading,
    error,
    refresh
  }
}

export function useTaskQueueSubscription(queueId?: string) {
  const { tasks, workers } = useTaskQueue()

  const queueTasks = queueId
    ? tasks.filter(task => task.queueId === queueId)
    : tasks

  const queueWorkers = queueId
    ? workers.filter(worker => worker.currentTaskId && queueTasks.some(t => t.id === worker.currentTaskId))
    : workers

  const stats = {
    totalTasks: queueTasks.length,
    pendingTasks: queueTasks.filter(t => t.status === 'pending').length,
    processingTasks: queueTasks.filter(t => t.status === 'processing').length,
    completedTasks: queueTasks.filter(t => t.status === 'completed').length,
    failedTasks: queueTasks.filter(t => t.status === 'failed').length,
    activeWorkers: queueWorkers.filter(w => w.status === 'busy').length,
    totalWorkers: queueWorkers.length
  }

  return {
    tasks: queueTasks,
    workers: queueWorkers,
    stats
  }
} 