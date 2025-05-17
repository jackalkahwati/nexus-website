import { jest } from '@jest/globals'
import * as path from 'path'

interface LogRotatorUtils {
  safeDelete: jest.Mock<Promise<void>, [string]>
  compressFile: jest.Mock<Promise<void>, [string, string]>
  getFileSize: jest.Mock<Promise<number>, [string]>
  listLogFiles: jest.Mock<Promise<string[]>, [string]>
  createDirectory: jest.Mock<Promise<void>, [string]>
}

interface LogRotatorConfig {
  maxSize?: number
  maxFiles?: number
}

class LogRotator {
  private logPath: string
  private maxSize: number
  private maxFiles: number
  private files: string[]

  constructor(logPath: string, config?: LogRotatorConfig) {
    this.logPath = logPath
    this.maxSize = config?.maxSize ?? 10 * 1024 * 1024 // 10MB default
    this.maxFiles = config?.maxFiles ?? 5
    this.files = []
  }

  async rotate(): Promise<void> {
    const currentSize = await utils.getFileSize(this.logPath)
    if (currentSize >= this.maxSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const rotatedPath = `${this.logPath}.${timestamp}.gz`
      await utils.compressFile(this.logPath, rotatedPath)
      this.files.push(rotatedPath)
      await utils.safeDelete(this.logPath)

      while (this.files.length > this.maxFiles) {
        const oldestFile = this.files.shift()
        if (oldestFile) {
          await utils.safeDelete(oldestFile)
        }
      }
    }
  }

  async cleanup(): Promise<void> {
    await Promise.all(this.files.map(file => utils.safeDelete(file)))
    this.files = []
  }

  getFiles(): string[] {
    return [...this.files]
  }
}

const utils: LogRotatorUtils = {
  safeDelete: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
  compressFile: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(undefined),
  getFileSize: jest.fn<Promise<number>, [string]>().mockResolvedValue(1024),
  listLogFiles: jest.fn<Promise<string[]>, [string]>().mockResolvedValue(['test1.log', 'test2.log']),
  createDirectory: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined)
}

export { LogRotator, utils, LogRotatorUtils, LogRotatorConfig } 