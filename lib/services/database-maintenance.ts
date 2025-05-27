import { PrismaClient } from '@prisma/client'
import { logger } from '../logging/logger'
import { auditLogger, AuditActions, ResourceTypes } from '../audit-logger'

const prisma = new PrismaClient()

export interface MaintenanceConfig {
  vacuumTables?: string[]
  reindexTables?: string[]
  analyzeFrequency: number // in days
  vacuumFrequency: number // in days
  reindexFrequency: number // in days
  maxTableBloat?: number // percentage
  maxIndexBloat?: number // percentage
}

interface TableBloatResult {
  tablename: string
  bloat_ratio: number
}

interface IndexStats {
  schemaname: string
  tablename: string
  indexrelname: string
  idx_scan: number
  idx_tup_read: number
  idx_tup_fetch: number
}

export class DatabaseMaintenanceService {
  private config: MaintenanceConfig

  constructor(config: MaintenanceConfig) {
    this.config = {
      vacuumTables: config.vacuumTables || [],
      reindexTables: config.reindexTables || [],
      analyzeFrequency: config.analyzeFrequency || 7,
      vacuumFrequency: config.vacuumFrequency || 7,
      reindexFrequency: config.reindexFrequency || 30,
      maxTableBloat: config.maxTableBloat || 20,
      maxIndexBloat: config.maxIndexBloat || 30
    }
  }

  async performMaintenance(): Promise<void> {
    try {
      // Check table and index bloat
      const bloatedTables = await this.checkBloat()

      // Analyze database statistics
      await this.analyzeDatabase()

      // Vacuum to reclaim space and update statistics
      await this.vacuumDatabase(bloatedTables)

      // Reindex to optimize query performance
      await this.reindexDatabase()

      await auditLogger.log({
        action: AuditActions.UPDATE,
        userId: 'system',
        resourceType: ResourceTypes.SETTINGS,
        resourceId: 'database-maintenance',
        details: { type: 'maintenance_complete' }
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during database maintenance')
      logger.error('Failed to perform database maintenance', { error: err })
      throw err
    }
  }

  private async checkBloat(): Promise<string[]> {
    const bloatedTables: string[] = []

    try {
      // Query to check table bloat
      const tableBloat = await prisma.$queryRaw<TableBloatResult[]>`
        SELECT schemaname, tablename,
          ROUND(CASE WHEN avg_width = 0 THEN 0.0
                ELSE bloat_size/NULLIF(raw_size,0)::numeric END,1) AS bloat_ratio
        FROM (
          SELECT *, (raw_total_size - avg_row_total_size * reltuples) AS bloat_size
          FROM (
            SELECT
              schemaname, tablename, reltuples,
              block_size * relpages AS raw_total_size,
              block_size * relpadding AS raw_padding_size,
              AVG(LENGTH(datahex)) AS avg_width,
              AVG(LENGTH(datahex) + 24) * reltuples AS avg_row_total_size
            FROM pg_class c
            JOIN pg_namespace n ON (c.relnamespace = n.oid)
            JOIN pg_stat_user_tables s ON (c.relname = s.relname)
            WHERE schemaname = 'public'
            GROUP BY 1, 2, 3, 4, 5
          ) AS raw
        ) AS stats
        WHERE raw_total_size > 0
      `

      for (const table of tableBloat) {
        if (table.bloat_ratio > (this.config.maxTableBloat || 20)) {
          bloatedTables.push(table.tablename)
          logger.warn('Table bloat detected', { 
            table: table.tablename, 
            bloatRatio: table.bloat_ratio 
          })
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to check database bloat')
      logger.error('Failed to check database bloat', { error: err })
    }

    return bloatedTables
  }

  private async analyzeDatabase(): Promise<void> {
    try {
      const tables = await this.getTables()
      
      for (const table of tables) {
        await prisma.$executeRawUnsafe(`ANALYZE VERBOSE "${table}"`)
        logger.info(`Analyzed table: ${table}`)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to analyze database')
      logger.error('Failed to analyze database', { error: err })
      throw err
    }
  }

  private async vacuumDatabase(bloatedTables: string[]): Promise<void> {
    try {
      const tables = this.config.vacuumTables?.length ? 
        this.config.vacuumTables : 
        [...new Set([...bloatedTables, ...(await this.getTables())])]

      for (const table of tables) {
        const isHighPriority = bloatedTables.includes(table)
        const vacuumCommand = isHighPriority ? 
          `VACUUM FULL ANALYZE "${table}"` : 
          `VACUUM ANALYZE "${table}"`

        await prisma.$executeRawUnsafe(vacuumCommand)
        logger.info(`Vacuumed table: ${table}`, { fullVacuum: isHighPriority })
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to vacuum database')
      logger.error('Failed to vacuum database', { error: err })
      throw err
    }
  }

  private async reindexDatabase(): Promise<void> {
    try {
      const tables = this.config.reindexTables?.length ?
        this.config.reindexTables :
        await this.getTables()

      for (const table of tables) {
        await prisma.$executeRawUnsafe(`REINDEX TABLE "${table}"`)
        logger.info(`Reindexed table: ${table}`)

        // Check index health after reindexing
        const indexHealth = await this.checkIndexHealth(table)
        logger.info(`Index health for ${table}:`, { indexHealth })
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to reindex database')
      logger.error('Failed to reindex database', { error: err })
      throw err
    }
  }

  private async checkIndexHealth(table: string): Promise<IndexStats[]> {
    const indexStats = await prisma.$queryRaw<IndexStats[]>`
      SELECT
        schemaname,
        tablename,
        indexrelname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes
      WHERE tablename = ${table}
    `
    return indexStats
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
