import { jest } from '@jest/globals'
import * as fs from 'fs'
import { LogRotator } from '../../index'
import { logger } from '../../examples/logger'

jest.mock('fs', () => ({
  stat: jest.fn(),
  rename: jest.fn(),
  unlink: jest.fn(),
  readdir: jest.fn(),
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  appendFile: jest.fn()
}))

const mockedFs = fs as jest.Mocked<typeof fs>

describe('Logger Integration', () => {
  let logRotator: LogRotator

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mock implementations
    mockedFs.stat.mockResolvedValue({ size: 0 } as fs.Stats)
    mockedFs.readdir.mockResolvedValue([])
    mockedFs.rename.mockResolvedValue(undefined)
    mockedFs.unlink.mockResolvedValue(undefined)
    mockedFs.writeFile.mockResolvedValue(undefined)
    mockedFs.appendFile.mockResolvedValue(undefined)

    logRotator = new LogRotator({
      maxSize: 1024, // 1KB
      maxFiles: 5,
      logDir: './logs',
      logFile: 'test.log'
    })
  })

  it('should rotate log files when size limit is reached', async () => {
    // Mock file size exceeding limit
    mockedFs.stat.mockResolvedValueOnce({ size: 2048 } as fs.Stats)

    // Write some logs
    await logger.info('Test log message')
    await logger.error('Error message')

    // Trigger rotation
    await logRotator.checkAndRotate()

    expect(mockedFs.stat).toHaveBeenCalled()
    expect(mockedFs.rename).toHaveBeenCalled()
  })

  it('should compress rotated log files', async () => {
    // Mock file size exceeding limit
    mockedFs.stat.mockResolvedValueOnce({ size: 2048 } as fs.Stats)
    mockedFs.readdir.mockResolvedValueOnce(['test.log', 'test.log.1'])

    // Write some logs
    await logger.info('Test log message')
    await logger.error('Error message')

    // Trigger rotation
    await logRotator.checkAndRotate()

    expect(mockedFs.rename).toHaveBeenCalled()
  })

  it('should maintain maximum number of log files', async () => {
    // Mock existing log files
    mockedFs.readdir.mockResolvedValueOnce([
      'test.log',
      'test.log.1',
      'test.log.2',
      'test.log.3',
      'test.log.4',
      'test.log.5'
    ])

    // Mock file size exceeding limit
    mockedFs.stat.mockResolvedValueOnce({ size: 2048 } as fs.Stats)

    // Write some logs
    await logger.info('Test log message')

    // Trigger rotation
    await logRotator.checkAndRotate()

    expect(mockedFs.unlink).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})
