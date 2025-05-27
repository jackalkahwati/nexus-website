export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  name: string
  type: string
  data: Record<string, any>
  status: TaskStatus
  priority: TaskPriority
  attempts: number
  maxAttempts: number
  createdAt: string
  updatedAt: string
  startedAt?: string
  completedAt?: string
  error?: string
  result?: any
  queueId: string
  workerId?: string
  retryDelay?: number
  dependencies?: string[]
}

export interface Queue {
  id: string
  name: string
  type: string
  concurrency: number
  maxRetries: number
  retryDelay: number
  status: 'active' | 'paused'
  createdAt: string
  updatedAt: string
  tasks: Task[]
}

export interface Worker {
  id: string
  type: string
  status: 'idle' | 'busy' | 'offline'
  currentTaskId?: string
  lastHeartbeat: string
  processedTasks: number
  failedTasks: number
  createdAt: string
  updatedAt: string
}

export interface TaskResult {
  taskId: string
  success: boolean
  data?: any
  error?: string
  duration: number
  timestamp: string
}

export interface QueueMetrics {
  totalTasks: number
  pendingTasks: number
  processingTasks: number
  completedTasks: number
  failedTasks: number
  averageProcessingTime: number
  successRate: number
} 