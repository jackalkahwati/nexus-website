import { RotationConfig, FileStats } from './types'
import { RotationManager } from './rotation'
import { RotationScheduler } from './scheduler'

/**
 * Main log rotation class that coordinates rotation and scheduling
 */
export class LogRotator {
  private config: RotationConfig
  private manager: RotationManager
  private scheduler: RotationScheduler
  private isCleanedUp: boolean = false

  constructor(config?: Partial<RotationConfig>) {
    // Set default configuration
    this.config = {
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      compress: true,
      logDir: process.cwd(),
      filePattern: /^.*\.log$/,
      ...config
    }

    this.manager = new RotationManager(this.config)
    this.scheduler = new RotationScheduler(() => this.checkAndRotate())
  }

  /**
   * Schedule periodic log rotation checks
   */
  scheduleRotation(intervalMs: number = 3600000): NodeJS.Timeout {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    return this.scheduler.scheduleRotation(intervalMs)
  }

  /**
   * Stop scheduled rotation
   */
  stopRotation(): void {
    this.scheduler.stopRotation()
  }

  /**
   * Check if rotation is currently scheduled
   */
  isScheduled(): boolean {
    return this.scheduler.isScheduled()
  }

  /**
   * Get current rotation interval in milliseconds
   */
  getInterval(): number | undefined {
    return this.scheduler.getInterval()
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RotationConfig>): void {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    this.config = { ...this.config, ...config }
    this.manager = new RotationManager(this.config)
  }

  /**
   * Get current configuration
   */
  getConfig(): RotationConfig {
    return { ...this.config }
  }

  /**
   * Check and rotate logs if needed
   */
  async checkAndRotate(): Promise<void> {
    if (this.isCleanedUp) return
    await this.manager.checkAndRotate()
  }

  /**
   * Run rotation check immediately
   */
  async runNow(): Promise<void> {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    await this.checkAndRotate()
  }

  /**
   * Check if log directory is empty
   */
  async isEmpty(): Promise<boolean> {
    const stats = await this.getStats()
    return stats.fileCount === 0
  }

  /**
   * Get statistics about log files
   */
  async getStats(): Promise<{ fileCount: number; totalSize: number; files: FileStats[] }> {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    const files = await this.manager.getStats()
    return {
      fileCount: files.length,
      totalSize: files.reduce((total: number, file: FileStats) => total + file.size, 0),
      files
    }
  }

  /**
   * Get list of files exceeding size limit
   */
  async getFilesExceedingSize(): Promise<string[]> {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    const stats = await this.getStats()
    return stats.files
      .filter(file => file.size >= this.config.maxSize)
      .map(file => file.name)
  }

  /**
   * Get list of files older than specified date
   */
  async getFilesOlderThan(date: Date): Promise<string[]> {
    if (this.isCleanedUp) {
      throw new Error('LogRotator has been cleaned up')
    }
    const stats = await this.getStats()
    return stats.files
      .filter(file => file.modified < date)
      .map(file => file.name)
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.isCleanedUp) return

    this.isCleanedUp = true
    this.scheduler.cleanup()
    this.manager.cleanup()
  }
}

// Re-export types
export type { RotationConfig, FileStats } from './types'
