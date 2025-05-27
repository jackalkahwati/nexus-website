// Mark this file as server-only
import 'server-only'

import fs from 'fs'
import path from 'path'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { FileStats, FileStatsWithPath } from './types'

/**
 * Create a timestamp string for file naming
 */
export function createTimestamp(): string {
  const now = new Date()
  return now.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '-')
    .replace('Z', '')
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.stat(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Ensure a directory exists
 */
export async function ensureDirectoryExists(dir: string): Promise<void> {
  try {
    await fs.promises.mkdir(dir, { recursive: true })
  } catch (error) {
    // Ignore error if directory already exists
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * Get stats for a file
 */
export async function getFileStats(filePath: string): Promise<FileStatsWithPath> {
  const stat = await fs.promises.stat(filePath)
  return {
    name: path.basename(filePath),
    size: stat.size,
    modified: stat.mtime,
    path: filePath
  }
}

/**
 * Get all log files in a directory
 */
export async function getLogFiles(dir: string, pattern: RegExp): Promise<string[]> {
  const files = await fs.promises.readdir(dir)
  return files.filter(file => pattern.test(file))
}

/**
 * Check if a file needs rotation
 */
export async function needsRotation(filePath: string, maxSize: number): Promise<boolean> {
  try {
    const stat = await fs.promises.stat(filePath)
    return stat.size > maxSize
  } catch {
    return false
  }
}

/**
 * Create an empty file
 */
export async function createEmptyFile(filePath: string): Promise<void> {
  await fs.promises.writeFile(filePath, '')
}

/**
 * Safely delete a file
 */
export async function safeDelete(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath)
  } catch (error) {
    // Ignore error if file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

/**
 * Rename a file
 */
export async function rename(oldPath: string, newPath: string): Promise<void> {
  await fs.promises.rename(oldPath, newPath)
}

/**
 * Compress a file using gzip
 */
export async function compressFile(sourcePath: string, destPath: string): Promise<void> {
  const source = fs.createReadStream(sourcePath)
  const destination = fs.createWriteStream(destPath)
  const gzip = createGzip()

  await pipeline(source, gzip, destination)
}

/**
 * Sort files by modification time
 */
export function sortFilesByTime<T extends FileStats>(files: T[]): T[] {
  return [...files].sort((a, b) => b.modified.getTime() - a.modified.getTime())
}
