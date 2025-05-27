/**
 * Handles scheduling of log rotation tasks
 */
export class RotationScheduler {
  private rotationInterval?: NodeJS.Timeout
  private rotationTask: () => Promise<void>
  private currentIntervalMs?: number

  constructor(task: () => Promise<void>) {
    this.rotationTask = task
  }

  /**
   * Schedule periodic log rotation checks
   * Returns the interval ID that can be used with clearInterval
   */
  scheduleRotation(intervalMs: number = 3600000): number {
    this.stopRotation() // Clear any existing interval

    this.currentIntervalMs = intervalMs

    // Use setInterval with async task execution
    const interval = setInterval(async () => {
      try {
        await this.rotationTask()
      } catch (error) {
        console.error('Error during scheduled log rotation:', error)
      }
    }, intervalMs)

    // Try to unref the interval if the method exists
    if (typeof interval.unref === 'function') {
      interval.unref()
    }

    // Store the interval
    this.rotationInterval = interval

    // Execute immediately on schedule
    this.runNow().catch(error => {
      console.error('Error during initial log rotation:', error)
    })

    // Return the numeric interval ID
    return interval as unknown as number
  }

  /**
   * Stop scheduled rotation
   */
  stopRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
      this.rotationInterval = undefined
      this.currentIntervalMs = undefined
    }
  }

  /**
   * Check if rotation is currently scheduled
   */
  isScheduled(): boolean {
    return this.rotationInterval !== undefined
  }

  /**
   * Get current rotation interval in milliseconds
   */
  getInterval(): number | undefined {
    return this.currentIntervalMs
  }

  /**
   * Run rotation task immediately
   */
  async runNow(): Promise<void> {
    try {
      await this.rotationTask()
    } catch (error) {
      console.error('Error during manual log rotation:', error)
      throw error // Re-throw to allow error handling by caller
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopRotation()
  }
}
