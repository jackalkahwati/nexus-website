interface Logger {
  info(message: string, metadata?: Record<string, any>): Promise<void>
  error(message: string | Error, metadata?: Record<string, any>): Promise<void>
  warn(message: string, metadata?: Record<string, any>): Promise<void>
  debug(message: string, metadata?: Record<string, any>): Promise<void>
}

interface LogEntry {
  level: 'info' | 'error' | 'warn' | 'debug'
  message: string | Error
  metadata?: Record<string, any>
}

interface LogAggregatorOptions {
  logger: Logger
  flushInterval?: number
  maxQueueSize?: number
}

class LogAggregator {
  private logger: Logger
  private queue: LogEntry[]
  private context: Record<string, any>
  private closed: boolean
  private flushInterval: number
  private maxQueueSize: number
  private flushTimer: NodeJS.Timeout | null

  constructor(options: LogAggregatorOptions) {
    this.logger = options.logger
    this.queue = []
    this.context = {}
    this.closed = false
    this.flushInterval = options.flushInterval || 1000
    this.maxQueueSize = options.maxQueueSize || 100
    this.flushTimer = null
    this.startFlushTimer()
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flushTimer = setInterval(() => {
      void this.flush()
    }, this.flushInterval)
  }

  info(message: string, metadata?: Record<string, any>): void {
    if (this.closed) return
    this.queue.push({ level: 'info', message, metadata })
    this.checkQueueSize()
  }

  error(message: string | Error, metadata?: Record<string, any>): void {
    if (this.closed) return
    this.queue.push({ level: 'error', message, metadata })
    this.checkQueueSize()
  }

  warn(message: string, metadata?: Record<string, any>): void {
    if (this.closed) return
    this.queue.push({ level: 'warn', message, metadata })
    this.checkQueueSize()
  }

  debug(message: string, metadata?: Record<string, any>): void {
    if (this.closed) return
    this.queue.push({ level: 'debug', message, metadata })
    this.checkQueueSize()
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context }
  }

  clearContext(): void {
    this.context = {}
  }

  child(context: Record<string, any>): LogAggregator {
    const child = new LogAggregator({ logger: this.logger })
    child.setContext({ ...this.context, ...context })
    return child
  }

  async close(): Promise<void> {
    this.closed = true
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    await this.flush()
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const logs = [...this.queue]
    this.queue = []

    for (const log of logs) {
      const metadata = { ...this.context, ...log.metadata }
      await this.logger[log.level](log.message, metadata)
    }
  }

  private checkQueueSize(): void {
    if (this.queue.length >= this.maxQueueSize) {
      void this.flush()
    }
  }
}

const createLogAggregator = (options: LogAggregatorOptions): LogAggregator => {
  return new LogAggregator(options)
}

export { LogAggregator, createLogAggregator, LogAggregatorOptions, Logger, LogEntry } 