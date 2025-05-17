import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { createGzip } from 'zlib'
import { pipeline } from 'stream'

const stat = promisify(fs.stat)
const rename = promisify(fs.rename)
const unlink = promisify(fs.unlink)
const readdir = promisify(fs.readdir)
const pipelineAsync = promisify(pipeline)

interface RotationConfig {
  maxSize: number        // Maximum size in bytes before rotation
  maxFiles: number       // Maximum number of archived log files to keep
  compress: boolean      // Whether to compress rotated logs
  logDir: string        // Directory containing log files
  filePattern: RegExp   // Pattern to match log files
}

export class LogRotator {
  private config: RotationConfig

  constructor(config: Partial<RotationConfig> = {}) {
    this.config = {
      maxSize: 5 * 1024 * 1024,  // 5MB
      maxFiles: 5,
      compress: true,
      logDir: 'logs',
      filePattern: /^.*\.log$/,
      ...config
    }
  }

  /**
   * Check if a log file needs rotation
   */
  private async needsRotation(filePath: string): Promise<boolean> {
    try {
      const stats = await stat(filePath)
      return stats.size >= this.config.maxSize
    } catch (error) {
      return false // File doesn't exist yet
    }
  }

  /**
   * Rotate a single log file
   */
  private async rotateFile(filePath: string): Promise<void> {
    const dir = path.dirname(filePath)
    const ext = path.extname(filePath)
    const base = path.basename(filePath, ext)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const rotatedPath = path.join(dir, `${base}-${timestamp}${ext}`)

    // Rename current log file
    await rename(filePath, rotatedPath)

    // Compress if enabled
    if (this.config.compress) {
      const gzipPath = `${rotatedPath}.gz`
      const readStream = fs.createReadStream(rotatedPath)
      const writeStream = fs.createWriteStream(gzipPath)
      const gzip = createGzip()

      await pipelineAsync(readStream, gzip, writeStream)
      await unlink(rotatedPath) // Remove uncompressed file
    }

    // Create new empty log file
    fs.writeFileSync(filePath, '')
  }

  /**
   * Clean up old log files
   */
  private async cleanupOldLogs(): Promise<void> {
    try {
      // Check if directory exists
      if (!fs.existsSync(this.config.logDir)) {
        return // Nothing to clean up
      }

      const dir = this.config.logDir
      const files = await readdir(dir)
      
      // Get all rotated log files
      const logFiles = await Promise.all(
        files
          .filter(file => this.config.filePattern.test(file))
          .map(async file => {
            const filePath = path.join(dir, file)
            const stats = await stat(filePath)
            return {
              name: file,
              path: filePath,
              time: stats.mtime.getTime()
            }
          })
      )

      // Sort by modification time, newest first
      logFiles.sort((a, b) => b.time - a.time)

      // Remove excess files
      const filesToRemove = logFiles.slice(this.config.maxFiles)
      for (const file of filesToRemove) {
        try {
          await unlink(file.path)
        } catch (error) {
          console.error(`Failed to remove old log file ${file.path}:`, error)
        }
      }
    } catch (error) {
      console.error('Error during log cleanup:', error)
    }
  }

  /**
   * Check and rotate logs if needed
   */
  public async checkAndRotate(): Promise<void> {
    try {
      // Ensure log directory exists
      if (!fs.existsSync(this.config.logDir)) {
        fs.mkdirSync(this.config.logDir, { recursive: true })
      }

      const files = await readdir(this.config.logDir)
      const logFiles = files.filter(file => this.config.filePattern.test(file))

      for (const file of logFiles) {
        const filePath = path.join(this.config.logDir, file)
        if (await this.needsRotation(filePath)) {
          try {
            await this.rotateFile(filePath)
          } catch (error) {
            console.error(`Failed to rotate log file ${filePath}:`, error)
          }
        }
      }

      await this.cleanupOldLogs()
    } catch (error) {
      console.error('Error during log rotation:', error)
    }
  }

  /**
   * Schedule periodic log rotation checks
   */
  public scheduleRotation(intervalMs: number = 3600000): NodeJS.Timer {
    return setInterval(() => {
      this.checkAndRotate().catch(error => {
        console.error('Error during scheduled log rotation:', error)
      })
    }, intervalMs)
  }

  /**
   * Get current log file statistics
   */
  public async getStats(): Promise<{
    totalSize: number
    fileCount: number
    files: Array<{
      name: string
      size: number
      modified: Date
    }>
  }> {
    try {
      if (!fs.existsSync(this.config.logDir)) {
        return {
          totalSize: 0,
          fileCount: 0,
          files: []
        }
      }

      const files = await readdir(this.config.logDir)
      const logFiles = files.filter(file => this.config.filePattern.test(file))
      
      let totalSize = 0
      const fileStats = []

      for (const file of logFiles) {
        const filePath = path.join(this.config.logDir, file)
        const stats = await stat(filePath)
        totalSize += stats.size
        fileStats.push({
          name: file,
          size: stats.size,
          modified: stats.mtime
        })
      }

      return {
        totalSize,
        fileCount: logFiles.length,
        files: fileStats
      }
    } catch (error) {
      console.error('Error getting log stats:', error)
      return {
        totalSize: 0,
        fileCount: 0,
        files: []
      }
    }
  }
}

// Create default instance
export const logRotator = new LogRotator()

// Start rotation check every hour
logRotator.scheduleRotation()
