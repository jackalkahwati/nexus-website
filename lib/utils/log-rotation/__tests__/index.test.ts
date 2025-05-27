import { jest } from '@jest/globals'
import { LogRotator } from '../index'
import * as utils from '../utils'
import fs from 'fs/promises'
import path from 'path'

interface MockStats {
  size: number
  mtime: Date
  isFile: () => boolean
}

interface MockUtils {
  fileExists: jest.Mock<Promise<boolean>, [string]>
  getLogFiles: jest.Mock<Promise<string[]>, [string]>
  needsRotation: jest.Mock<Promise<boolean>, [string]>
  compressFile: jest.Mock<Promise<void>, [string, string]>
  rename: jest.Mock<Promise<void>, [string, string]>
  safeDelete: jest.Mock<Promise<void>, [string]>
  sortFilesByTime: jest.Mock<Array<{ path: string; modified: Date }>, [Array<{ path: string; modified: Date }>]>
}

jest.mock('../utils')
jest.mock('fs/promises')

describe('LogRotator', () => {
  let logRotator: LogRotator
  let testDir: string
  let mockUtils: MockUtils

  beforeEach(() => {
    jest.clearAllMocks()
    testDir = path.join('test-logs')
    
    // Mock fs operations
    const mockedFs = fs as jest.Mocked<typeof fs>
    mockedFs.mkdir = jest.fn().mockResolvedValue(undefined)
    mockedFs.readdir = jest.fn().mockResolvedValue([])
    mockedFs.stat = jest.fn().mockResolvedValue({
      size: 100,
      mtime: new Date(),
      isFile: () => true
    } satisfies MockStats)
    
    // Setup mock utils
    mockUtils = {
      fileExists: jest.fn<Promise<boolean>, [string]>().mockResolvedValue(true),
      getLogFiles: jest.fn<Promise<string[]>, [string]>().mockResolvedValue([]),
      needsRotation: jest.fn<Promise<boolean>, [string]>().mockResolvedValue(false),
      compressFile: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(undefined),
      rename: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(undefined),
      safeDelete: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
      sortFilesByTime: jest.fn<Array<{ path: string; modified: Date }>, [Array<{ path: string; modified: Date }>]>()
        .mockReturnValue([])
    }

    // Apply mock implementations
    Object.assign(utils, mockUtils)
    
    logRotator = new LogRotator({
      maxSize: 1024,
      maxFiles: 3,
      compress: true,
      logDir: testDir,
      filePattern: /^.*\.log$/
    })
  })

  describe('Log File Management', () => {
    it('should create log directory if missing', async () => {
      mockUtils.fileExists.mockResolvedValueOnce(false)
      
      await logRotator.checkAndRotate()
      await new Promise<void>(resolve => setImmediate(resolve))
      
      expect(fs.mkdir)
        .toHaveBeenCalledWith(testDir, { recursive: true })
    })

    it('should handle empty directory', async () => {
      mockUtils.getLogFiles.mockResolvedValueOnce([])
      
      await logRotator.checkAndRotate()
      await new Promise<void>(resolve => setImmediate(resolve))
      
      expect(utils.needsRotation).not.toHaveBeenCalled()
    })
  })

  describe('Log Rotation', () => {
    it('should rotate log file when size exceeds limit', async () => {
      const testFile = 'test.log'
      const timestamp = '20240101-000000'
      
      mockUtils.getLogFiles.mockResolvedValueOnce([testFile])
      mockUtils.needsRotation.mockResolvedValueOnce(true)
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z')
      
      await logRotator.checkAndRotate()
      await new Promise<void>(resolve => setImmediate(resolve))
      
      expect(utils.rename).toHaveBeenCalledWith(
        path.join(testDir, testFile),
        path.join(testDir, `test-${timestamp}.log`)
      )
      expect(utils.compressFile).toHaveBeenCalled()
    })

    it('should maintain maxFiles limit', async () => {
      const files = Array.from({ length: 5 }, (_, i) => `test${i}.log`)
      const sortedFiles = files.map(f => ({
        path: path.join(testDir, f),
        modified: new Date()
      }))
      
      mockUtils.getLogFiles.mockResolvedValueOnce(files)
      mockUtils.sortFilesByTime.mockReturnValueOnce(sortedFiles)
      
      await logRotator.checkAndRotate()
      await new Promise<void>(resolve => setImmediate(resolve))
      
      expect(utils.safeDelete).toHaveBeenCalled()
    })
  })
})
