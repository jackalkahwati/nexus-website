import { jest } from '@jest/globals'
import type { Stats } from 'fs'

// Define types for the mock functions
type Callback<T> = (error: NodeJS.ErrnoException | null, result?: T) => void
type WriteCallback = (error: NodeJS.ErrnoException | null) => void

interface MockWriteStream {
  write: jest.Mock
  end: jest.Mock
  on: jest.Mock
  cork: jest.Mock
  uncork: jest.Mock
  destroy: jest.Mock
}

interface MockReadStream {
  pipe: jest.Mock
  on: jest.Mock
  destroy: jest.Mock
}

// Create mock Stats object
const mockStats: Stats = {
  isFile: () => true,
  isDirectory: () => false,
  isBlockDevice: () => false,
  isCharacterDevice: () => false,
  isSymbolicLink: () => false,
  isFIFO: () => false,
  isSocket: () => false,
  dev: 0,
  ino: 0,
  mode: 0,
  nlink: 0,
  uid: 0,
  gid: 0,
  rdev: 0,
  size: 1024,
  blksize: 4096,
  blocks: 8,
  atimeMs: Date.now(),
  mtimeMs: Date.now(),
  ctimeMs: Date.now(),
  birthtimeMs: Date.now(),
  atime: new Date(),
  mtime: new Date(),
  ctime: new Date(),
  birthtime: new Date()
}

// Create mock filesystem functions
const mockFs = {
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    stat: jest.fn().mockResolvedValue(mockStats),
    readdir: jest.fn().mockResolvedValue(['test.log']),
    rename: jest.fn().mockResolvedValue(undefined),
    unlink: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('test log content'),
    access: jest.fn().mockResolvedValue(undefined)
  },

  mkdir: jest.fn().mockImplementation((path: string, options: any, callback?: Callback<void>) => {
    if (typeof options === 'function') {
      callback = options
    }
    if (callback) {
      callback(null)
    }
    return Promise.resolve()
  }),

  stat: jest.fn().mockImplementation((path: string, callback?: Callback<Stats>) => {
    if (callback) {
      callback(null, mockStats)
    }
    return Promise.resolve(mockStats)
  }),

  readdir: jest.fn().mockImplementation((path: string, callback?: Callback<string[]>) => {
    if (callback) {
      callback(null, ['test.log'])
    }
    return Promise.resolve(['test.log'])
  }),

  rename: jest.fn().mockImplementation((oldPath: string, newPath: string, callback?: WriteCallback) => {
    if (callback) {
      callback(null)
    }
    return Promise.resolve()
  }),

  unlink: jest.fn().mockImplementation((path: string, callback?: WriteCallback) => {
    if (callback) {
      callback(null)
    }
    return Promise.resolve()
  }),

  writeFile: jest.fn().mockImplementation((path: string, data: string | Buffer, callback?: WriteCallback) => {
    if (callback) {
      callback(null)
    }
    return Promise.resolve()
  }),

  readFile: jest.fn().mockImplementation((path: string, callback?: Callback<string>) => {
    if (callback) {
      callback(null, 'test log content')
    }
    return Promise.resolve('test log content')
  }),

  access: jest.fn().mockImplementation((path: string, callback?: WriteCallback) => {
    if (callback) {
      callback(null)
    }
    return Promise.resolve()
  }),

  existsSync: jest.fn().mockReturnValue(true),

  mkdirSync: jest.fn(),

  createWriteStream: jest.fn().mockReturnValue({
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    cork: jest.fn(),
    uncork: jest.fn(),
    destroy: jest.fn()
  } as MockWriteStream),

  createReadStream: jest.fn().mockReturnValue({
    pipe: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn()
  } as MockReadStream)
}

export default mockFs 