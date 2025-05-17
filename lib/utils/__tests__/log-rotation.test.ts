import { jest } from '@jest/globals'
import { LogRotator } from '../log-rotation'
import * as fs from 'fs'

jest.mock('fs', () => ({
  stat: jest.fn(),
  rename: jest.fn(),
  unlink: jest.fn(),
  readdir: jest.fn(),
  mkdir: jest.fn()
}))

const mockedFs = fs as jest.Mocked<typeof fs>

describe('LogRotator', () => {
  let logRotator: LogRotator

  beforeEach(() => {
    jest.clearAllMocks()
    logRotator = new LogRotator({
      maxSize: 1024,
      maxFiles: 5,
      logDir: '/test/logs',
      logFile: 'app.log'
    })
  })

  describe('Log File Management', () => {
    it('should create log directory if missing', async () => {
      mockedFs.stat.mockRejectedValueOnce(new Error('ENOENT'))
      mockedFs.mkdir.mockResolvedValueOnce(undefined)

      await logRotator.setup()

      expect(mockedFs.mkdir).toHaveBeenCalledWith('/test/logs', { recursive: true })
    })

    it('should handle empty directory', async () => {
      mockedFs.stat.mockResolvedValueOnce({ size: 0 } as fs.Stats)
      mockedFs.readdir.mockResolvedValueOnce([])

      await logRotator.checkAndRotate()

      expect(mockedFs.readdir).toHaveBeenCalledWith('/test/logs')
      expect(mockedFs.rename).not.toHaveBeenCalled()
    })
  })

  describe('Log Rotation', () => {
    it('should rotate log file when size exceeds limit', async () => {
      mockedFs.stat.mockResolvedValueOnce({ size: 2048 } as fs.Stats)
      mockedFs.rename.mockResolvedValueOnce(undefined)

      await logRotator.checkAndRotate()

      expect(mockedFs.rename).toHaveBeenCalled()
    })

    it('should maintain maxFiles limit', async () => {
      mockedFs.stat.mockResolvedValueOnce({ size: 2048 } as fs.Stats)
      mockedFs.readdir.mockResolvedValueOnce([
        'app.log',
        'app.log.1',
        'app.log.2',
        'app.log.3',
        'app.log.4',
        'app.log.5'
      ])
      mockedFs.unlink.mockResolvedValueOnce(undefined)

      await logRotator.checkAndRotate()

      expect(mockedFs.unlink).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})
