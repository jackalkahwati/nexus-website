import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

class TaskWorker {
  private id: string
  private type: string
  private heartbeatInterval: NodeJS.Timeout | null
  private pollInterval: NodeJS.Timeout | null
  private isProcessing: boolean

  constructor(type: string) {
    this.id = uuidv4()
    this.type = type
    this.heartbeatInterval = null
    this.pollInterval = null
    this.isProcessing = false
  }

  async start() {
    try {
      // Register worker
      await this.register()

      // Start heartbeat
      this.heartbeatInterval = setInterval(() => {
        this.updateHeartbeat().catch(console.error)
      }, 30000) // Every 30 seconds

      // Start polling for tasks
      this.pollInterval = setInterval(() => {
        if (!this.isProcessing) {
          this.processNextTask().catch(console.error)
        }
      }, 1000) // Every second

      console.log(`Worker ${this.id} started`)
    } catch (error) {
      console.error('Failed to start worker:', error)
      this.stop()
    }
  }

  async stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }

    try {
      await prisma.worker.update({
        where: { id: this.id },
        data: { status: 'offline' }
      })
    } catch (error) {
      console.error('Failed to update worker status:', error)
    }

    console.log(`Worker ${this.id} stopped`)
  }

  private async register() {
    const worker = await prisma.worker.create({
      data: {
        id: this.id,
        name: `${this.type}-worker-${this.id.slice(0, 8)}`,
        type: this.type,
        status: 'idle',
        lastHeartbeat: new Date(),
      }
    })

    return worker
  }

  private async updateHeartbeat() {
    await prisma.worker.update({
      where: { id: this.id },
      data: { lastHeartbeat: new Date() }
    })
  }

  private async processNextTask() {
    try {
      this.isProcessing = true

      // Find next task to process
      const task = await prisma.task.findFirst({
        where: {
          status: 'pending',
          type: this.type,
          workerId: null
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ]
      })

      if (!task) {
        this.isProcessing = false
        return
      }

      // Update task status and assign to worker
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: 'processing',
          startedAt: new Date(),
          attempts: { increment: 1 },
          workerId: this.id
        }
      })

      // Update worker status
      await prisma.worker.update({
        where: { id: this.id },
        data: {
          status: 'busy',
          currentTask: { connect: { id: task.id } }
        }
      })

      try {
        // Process the task
        const result = await this.executeTask(task)

        // Mark task as completed
        await prisma.task.update({
          where: { id: task.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            result,
            workerId: null
          }
        })

        // Update worker status
        await prisma.worker.update({
          where: { id: this.id },
          data: {
            status: 'idle',
            currentTask: { disconnect: true }
          }
        })

      } catch (error) {
        const shouldRetry = task.attempts < task.maxAttempts

        // Update task status
        await prisma.task.update({
          where: { id: task.id },
          data: {
            status: shouldRetry ? 'retrying' : 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            workerId: null
          }
        })

        // Update worker status
        await prisma.worker.update({
          where: { id: this.id },
          data: {
            status: 'idle',
            currentTask: { disconnect: true },
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })

        console.error(`Failed to process task ${task.id}:`, error)
      }
    } catch (error) {
      console.error('Error in processNextTask:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async executeTask(task: any): Promise<any> {
    switch (task.type) {
      case 'demand-forecast':
        return this.processDemandForecastTask(task)
      case 'rebalancing':
        return this.processRebalancingTask(task)
      case 'maintenance':
        return this.processMaintenanceTask(task)
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }
  }

  private async processDemandForecastTask(task: any): Promise<any> {
    console.log('Processing demand forecast task:', task.data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { completed: true, timestamp: new Date() }
  }

  private async processRebalancingTask(task: any): Promise<any> {
    console.log('Processing rebalancing task:', task.data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { completed: true, timestamp: new Date() }
  }

  private async processMaintenanceTask(task: any): Promise<any> {
    console.log('Processing maintenance task:', task.data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { completed: true, timestamp: new Date() }
  }
}

// Start workers for different task types
async function startWorkers() {
  const workers = [
    new TaskWorker('demand-forecast'),
    new TaskWorker('rebalancing'),
    new TaskWorker('maintenance')
  ]

  for (const worker of workers) {
    await worker.start()
  }

  // Handle shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down workers...')
    for (const worker of workers) {
      await worker.stop()
    }
    process.exit(0)
  })
}

startWorkers().catch(console.error) 