import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import type { Task, Queue, Worker, TaskResult, TaskStatus, TaskPriority } from '@/types/task-queue'
import { EventEmitter } from 'events'

class TaskQueueService {
  private eventEmitter: EventEmitter
  private workers: Map<string, Worker>
  private queues: Map<string, Queue>
  private processingTasks: Map<string, Task>
  private taskResults: Map<string, TaskResult>

  constructor() {
    this.eventEmitter = new EventEmitter()
    this.workers = new Map()
    this.queues = new Map()
    this.processingTasks = new Map()
    this.taskResults = new Map()
    this.initialize()
  }

  private async initialize() {
    try {
      // Load queues and tasks from database
      const queues = await prisma.queue.findMany({
        include: { tasks: true }
      })
      queues.forEach((queue: Queue) => this.queues.set(queue.id, queue))

      // Start processing pending tasks
      this.processNextTasks()
    } catch (error) {
      console.error('Failed to initialize task queue:', error)
    }
  }

  async createQueue(name: string, type: string, options: Partial<Queue> = {}): Promise<Queue> {
    const queue: Queue = {
      id: uuidv4(),
      name,
      type,
      concurrency: options.concurrency || 5,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 5000,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: []
    }

    await prisma.queue.create({
      data: queue
    })

    this.queues.set(queue.id, queue)
    return queue
  }

  async addTask(
    queueId: string,
    name: string,
    type: string,
    data: Record<string, any>,
    options: Partial<Task> = {}
  ): Promise<Task> {
    const queue = this.queues.get(queueId)
    if (!queue) throw new Error('Queue not found')

    const task: Task = {
      id: uuidv4(),
      name,
      type,
      data,
      status: 'pending',
      priority: options.priority || 'medium',
      attempts: 0,
      maxAttempts: options.maxAttempts || queue.maxRetries,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      queueId,
      retryDelay: options.retryDelay || queue.retryDelay,
      dependencies: options.dependencies || []
    }

    await prisma.task.create({
      data: task
    })

    queue.tasks.push(task)
    this.eventEmitter.emit('taskAdded', task)
    this.processNextTasks()

    return task
  }

  async processTask(taskId: string, workerId: string): Promise<void> {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task || task.status !== 'pending') return

    const worker = this.workers.get(workerId)
    if (!worker || worker.status !== 'idle') return

    try {
      // Update task status
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: 'processing',
          workerId,
          startedAt: new Date().toISOString(),
          attempts: { increment: 1 }
        }
      })

      // Update worker status
      worker.status = 'busy'
      worker.currentTaskId = taskId
      await prisma.worker.update({
        where: { id: workerId },
        data: {
          status: 'busy',
          currentTaskId: taskId
        }
      })

      this.processingTasks.set(taskId, task)
      this.eventEmitter.emit('taskStarted', task)

    } catch (error) {
      console.error(`Failed to process task ${taskId}:`, error)
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async completeTask(taskId: string, result?: any): Promise<void> {
    const task = this.processingTasks.get(taskId)
    if (!task) return

    try {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: 'completed',
          completedAt: new Date().toISOString(),
          result
        }
      })

      if (task.workerId) {
        const worker = this.workers.get(task.workerId)
        if (worker) {
          worker.status = 'idle'
          worker.currentTaskId = undefined
          worker.processedTasks++
          await prisma.worker.update({
            where: { id: task.workerId },
            data: {
              status: 'idle',
              currentTaskId: null,
              processedTasks: { increment: 1 }
            }
          })
        }
      }

      this.processingTasks.delete(taskId)
      this.eventEmitter.emit('taskCompleted', task)
      this.processNextTasks()

    } catch (error) {
      console.error(`Failed to complete task ${taskId}:`, error)
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async failTask(taskId: string, error: string): Promise<void> {
    const task = this.processingTasks.get(taskId)
    if (!task) return

    try {
      const shouldRetry = task.attempts < task.maxAttempts

      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: shouldRetry ? 'retrying' : 'failed',
          error,
          updatedAt: new Date().toISOString()
        }
      })

      if (task.workerId) {
        const worker = this.workers.get(task.workerId)
        if (worker) {
          worker.status = 'idle'
          worker.currentTaskId = undefined
          worker.failedTasks++
          await prisma.worker.update({
            where: { id: task.workerId },
            data: {
              status: 'idle',
              currentTaskId: null,
              failedTasks: { increment: 1 }
            }
          })
        }
      }

      this.processingTasks.delete(taskId)
      this.eventEmitter.emit('taskFailed', task)

      if (shouldRetry) {
        setTimeout(() => {
          this.processNextTasks()
        }, task.retryDelay || 5000)
      }

    } catch (error) {
      console.error(`Failed to mark task ${taskId} as failed:`, error)
    }
  }

  async registerWorker(type: string): Promise<Worker> {
    const worker: Worker = {
      id: uuidv4(),
      type,
      status: 'idle',
      lastHeartbeat: new Date().toISOString(),
      processedTasks: 0,
      failedTasks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await prisma.worker.create({
      data: worker
    })

    this.workers.set(worker.id, worker)
    this.eventEmitter.emit('workerRegistered', worker)
    return worker
  }

  async updateWorkerHeartbeat(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId)
    if (!worker) return

    worker.lastHeartbeat = new Date().toISOString()
    await prisma.worker.update({
      where: { id: workerId },
      data: { lastHeartbeat: worker.lastHeartbeat }
    })
  }

  private async processNextTasks(): Promise<void> {
    for (const [queueId, queue] of this.queues.entries()) {
      if (queue.status === 'paused') continue

      const pendingTasks = queue.tasks.filter(
        task => task.status === 'pending' && 
        !this.processingTasks.has(task.id) &&
        this.areDependenciesMet(task)
      )

      const availableWorkers = Array.from(this.workers.values()).filter(
        worker => worker.status === 'idle' && worker.type === queue.type
      )

      const tasksToProcess = pendingTasks
        .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
        .slice(0, Math.min(queue.concurrency, availableWorkers.length))

      for (let i = 0; i < tasksToProcess.length; i++) {
        const task = tasksToProcess[i]
        const worker = availableWorkers[i]
        await this.processTask(task.id, worker.id)
      }
    }
  }

  private getPriorityWeight(priority: TaskPriority): number {
    switch (priority) {
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 0
    }
  }

  private areDependenciesMet(task: Task): boolean {
    if (!task.dependencies?.length) return true
    return task.dependencies.every(depId => {
      const depTask = this.queues.get(task.queueId)?.tasks.find(t => t.id === depId)
      return depTask?.status === 'completed'
    })
  }

  on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener)
  }

  off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener)
  }
}

export const taskQueueService = new TaskQueueService() 