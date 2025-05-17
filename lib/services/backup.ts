import { PrismaClient } from '@prisma/client'
import { createGzip } from 'zlib'
import { createReadStream, createWriteStream } from 'fs'
import { join } from 'path'
import { mkdir, readdir, unlink } from 'fs/promises'
import { logger } from '../logging/logger'
import { auditLogger, AuditActions, ResourceTypes } from '../audit-logger'

const prisma = new PrismaClient()

export interface BackupConfig {
  backupDir: string
  retentionDays: number
  compressionLevel: number
  excludedTables?: string[]
}

export class BackupService {
  private config: BackupConfig

  constructor(config: BackupConfig) {
    this.config = {
      backupDir: config.backupDir,
      retentionDays: config.retentionDays || 30,
      compressionLevel: config.compressionLevel || 6,
      excludedTables: config.excludedTables || []
    }
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = join(this.config.backupDir, `backup-${timestamp}.sql.gz`)

    try {
      // Ensure backup directory exists
      await mkdir(this.config.backupDir, { recursive: true })

      // Get database schema
      const schema = await prisma.$queryRaw`SELECT current_database()`

      // Create backup stream with compression
      const gzip = createGzip({ level: this.config.compressionLevel })
      const writeStream = createWriteStream(backupPath)
      
      // Dump database
      const tables = await this.getTables()
      for (const table of tables) {
        if (this.config.excludedTables?.includes(table)) continue
        
        const data = await prisma.$queryRaw`SELECT * FROM "${table}"`
        gzip.write(`-- Table: ${table}\n`)
        gzip.write(`INSERT INTO "${table}" VALUES\n`)
        gzip.write(JSON.stringify(data))
        gzip.write(';\n\n')
      }

      gzip.pipe(writeStream)
      gzip.end()

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      await auditLogger.log({
        action: AuditActions['backup.create'],
        userId: 'system',
        resourceType: ResourceTypes.BACKUP,
        resourceId: backupPath,
        details: { path: backupPath }
      })

      logger.info('Backup created successfully', { path: backupPath })
      return backupPath
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during backup')
      logger.error('Failed to create backup', { error: err })
      throw err
    }
  }

  async enforceRetentionPolicy(): Promise<void> {
    try {
      const files = await readdir(this.config.backupDir)
      const now = new Date()

      for (const file of files) {
        if (!file.startsWith('backup-') || !file.endsWith('.sql.gz')) continue

        const filePath = join(this.config.backupDir, file)
        const timestamp = this.extractTimestamp(file)
        
        if (!timestamp) continue

        const ageInDays = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
        
        if (ageInDays > this.config.retentionDays) {
          await unlink(filePath)
          await auditLogger.log({
            action: AuditActions['backup.delete'],
            userId: 'system',
            resourceType: ResourceTypes.BACKUP,
            resourceId: filePath,
            details: { path: filePath, reason: 'retention_policy' }
          })
          logger.info('Deleted old backup file', { path: filePath })
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during retention policy enforcement')
      logger.error('Failed to enforce retention policy', { error: err })
      throw err
    }
  }

  private extractTimestamp(filename: string): Date | null {
    const match = filename.match(/backup-(.+)\.sql\.gz/)
    if (!match) return null
    
    const timestamp = match[1].replace(/-/g, ':')
    return new Date(timestamp)
  }

  private async getTables(): Promise<string[]> {
    const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `
    return result.map((t: { tablename: string }) => t.tablename)
  }
}
