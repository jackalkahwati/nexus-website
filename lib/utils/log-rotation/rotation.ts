import path from 'path'
import fs from 'fs'
import { RotationConfig, FileStats, FileStatsWithPath } from './types'
import * as utils from './utils'

export class RotationManager {
  private isCleanedUp: boolean = false

  constructor(private config: RotationConfig) {}

  private async rotateFile(filePath: string): Promise<void> {
    if (this.isCleanedUp) return

    try {
      if (!await utils.fileExists(filePath)) return

      const dir = path.dirname(filePath)
      const ext = path.extname(filePath)
      const base = path.basename(filePath, ext)
      const timestamp = utils.createTimestamp()
      const rotatedPath = path.join(dir, `${base}-${timestamp}${ext}`)

      await utils.rename(filePath, rotatedPath)

      if (this.config.compress) {
        const gzipPath = `${rotatedPath}.gz`
        await utils.compressFile(rotatedPath, gzipPath)
        await utils.safeDelete(rotatedPath)
      }

      await utils.createEmptyFile(filePath)
    } catch (error) {
      console.warn(`Failed to rotate log file ${filePath}:`, error)
    }
  }

  private async cleanupOldLogs(): Promise<void> {
    if (this.isCleanedUp) return

    try {
      const files = await utils.getLogFiles(this.config.logDir, /^.*\.(log|gz)$/)
      
      if (files.length <= this.config.maxFiles) return

      const stats = await Promise.all(
        files.map(async file => {
          const filePath = path.join(this.config.logDir, file)
          try {
            const stat = await utils.getFileStats(filePath)
            return { ...stat, path: filePath } as FileStatsWithPath
          } catch (error) {
            console.warn(`Failed to get stats for ${filePath}:`, error)
            return null
          }
        })
      )
      
      const validStats = stats.filter((stat): stat is FileStatsWithPath => stat !== null)
      const sortedStats = utils.sortFilesByTime(validStats)
      const filesToRemove = sortedStats.slice(this.config.maxFiles)

      // Delete old files
      await Promise.all(
        filesToRemove.map(async file => {
          try {
            await utils.safeDelete(file.path)
          } catch (error) {
            console.warn(`Failed to delete ${file.path}:`, error)
          }
        })
      )
    } catch (error) {
      console.error('Error during log rotation:', error)
    }
  }

  async checkAndRotate(): Promise<void> {
    if (this.isCleanedUp) return

    try {
      await utils.ensureDirectoryExists(this.config.logDir)
      const files = await utils.getLogFiles(this.config.logDir, /^.*\.log$/)
      
      for (const file of files) {
        const filePath = path.join(this.config.logDir, file)
        try {
          const needsRotation = await utils.needsRotation(filePath, this.config.maxSize)
          if (needsRotation) await this.rotateFile(filePath)
        } catch (error) {
          console.warn(`Failed to check/rotate ${filePath}:`, error)
        }
      }

      await this.cleanupOldLogs()
    } catch (error) {
      console.error('Error during log rotation:', error)
    }
  }

  async getStats(): Promise<FileStats[]> {
    if (this.isCleanedUp) throw new Error('RotationManager has been cleaned up')

    try {
      await utils.ensureDirectoryExists(this.config.logDir)
      const files = await utils.getLogFiles(this.config.logDir, /^.*\.(log|gz)$/)
      
      const stats = await Promise.all(
        files.map(async file => {
          const filePath = path.join(this.config.logDir, file)
          try {
            const stat = await utils.getFileStats(filePath)
            return { ...stat, path: filePath } as FileStatsWithPath
          } catch (error) {
            console.warn(`Failed to get stats for ${filePath}:`, error)
            return null
          }
        })
      )

      return stats.filter((stat): stat is FileStatsWithPath => stat !== null)
        .map(({ name, size, modified }) => ({ name, size, modified }))
    } catch (error) {
      console.error('Failed to get log file stats:', error)
      return []
    }
  }

  cleanup(): void {
    this.isCleanedUp = true
  }
}
