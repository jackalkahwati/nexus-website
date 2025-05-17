import path from 'path'
import { LogStats, RotationConfig } from './types'
import * as utils from './utils'

/**
 * Handles log file statistics
 */
export class StatsManager {
  constructor(private config: RotationConfig) {}

  /**
   * Get current log file statistics
   */
  async getStats(): Promise<LogStats> {
    try {
      const files = await utils.getLogFiles(this.config.logDir, this.config.filePattern)
      const stats = await Promise.all(
        files.map(file => utils.getFileStats(path.join(this.config.logDir, file)))
      )

      const sortedStats = utils.sortFilesByTime(stats)

      return {
        totalSize: sortedStats.reduce((sum, file) => sum + file.size, 0),
        fileCount: sortedStats.length,
        files: sortedStats
      }
    } catch (error) {
      console.error('Failed to get log stats:', error)
      return {
        totalSize: 0,
        fileCount: 0,
        files: []
      }
    }
  }

  /**
   * Get size of a specific log file
   */
  async getFileSize(fileName: string): Promise<number> {
    try {
      const filePath = path.join(this.config.logDir, fileName)
      const stats = await utils.getFileStats(filePath)
      return stats.size
    } catch (error) {
      console.error(`Failed to get size for file ${fileName}:`, error)
      return 0
    }
  }

  /**
   * Get total size of all log files
   */
  async getTotalSize(): Promise<number> {
    const stats = await this.getStats()
    return stats.totalSize
  }

  /**
   * Get number of log files
   */
  async getFileCount(): Promise<number> {
    const stats = await this.getStats()
    return stats.fileCount
  }

  /**
   * Get oldest log file
   */
  async getOldestFile(): Promise<string | null> {
    const stats = await this.getStats()
    if (stats.files.length === 0) return null
    return stats.files[stats.files.length - 1].name
  }

  /**
   * Get newest log file
   */
  async getNewestFile(): Promise<string | null> {
    const stats = await this.getStats()
    if (stats.files.length === 0) return null
    return stats.files[0].name
  }

  /**
   * Check if directory is empty
   */
  async isEmpty(): Promise<boolean> {
    const stats = await this.getStats()
    return stats.fileCount === 0
  }

  /**
   * Get files that exceed max size
   */
  async getFilesExceedingSize(): Promise<string[]> {
    const stats = await this.getStats()
    return stats.files
      .filter(file => file.size > this.config.maxSize)
      .map(file => file.name)
  }

  /**
   * Get files older than specified date
   */
  async getFilesOlderThan(date: Date): Promise<string[]> {
    const stats = await this.getStats()
    return stats.files
      .filter(file => file.modified < date)
      .map(file => file.name)
  }

  /**
   * Get directory usage percentage
   */
  async getUsagePercentage(maxDirSize: number): Promise<number> {
    const totalSize = await this.getTotalSize()
    return (totalSize / maxDirSize) * 100
  }
}
