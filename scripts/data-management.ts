import { BackupService } from '../lib/services/backup'
import { DataRetentionService } from '../lib/services/data-retention'
import { DatabaseMaintenanceService } from '../lib/services/database-maintenance'
import { logger } from '../lib/logging/logger'
import { scheduleJob } from 'node-schedule'

// Initialize services with configuration
const backupService = new BackupService({
  backupDir: './backups',
  retentionDays: 30,
  compressionLevel: 6,
  excludedTables: ['audit_logs'] // Optional: exclude certain tables from backup
})

const dataRetentionService = new DataRetentionService({
  rules: [
    {
      table: 'users',
      field: 'last_login',
      retention: 365, // 1 year
      gdprSensitive: true
    },
    {
      table: 'sessions',
      field: 'created_at',
      retention: 30, // 30 days
      deleteStrategy: 'hard'
    },
    {
      table: 'audit_logs',
      field: 'timestamp',
      retention: 730, // 2 years
      deleteStrategy: 'soft'
    },
    {
      table: 'personal_data',
      field: 'updated_at',
      retention: 365,
      anonymize: true,
      gdprSensitive: true
    }
  ],
  defaultRetention: 365,
  defaultStrategy: 'soft'
})

const databaseMaintenanceService = new DatabaseMaintenanceService({
  analyzeFrequency: 7, // Weekly
  vacuumFrequency: 7, // Weekly
  reindexFrequency: 30, // Monthly
  maxTableBloat: 20,
  maxIndexBloat: 30
})

// Schedule daily backup at 1 AM
scheduleJob('0 1 * * *', async () => {
  try {
    logger.info('Starting daily backup')
    await backupService.createBackup()
    await backupService.enforceRetentionPolicy()
    logger.info('Daily backup completed')
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error during backup')
    logger.error('Daily backup failed', { error: err })
  }
})

// Schedule weekly data retention check on Sunday at 2 AM
scheduleJob('0 2 * * 0', async () => {
  try {
    logger.info('Starting weekly data retention check')
    await dataRetentionService.enforceRetentionPolicies()
    logger.info('Weekly data retention check completed')
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error during data retention')
    logger.error('Weekly data retention check failed', { error: err })
  }
})

// Schedule database maintenance
// - Daily analyze at 3 AM
scheduleJob('0 3 * * *', async () => {
  try {
    logger.info('Starting daily database analysis')
    await databaseMaintenanceService.performMaintenance()
    logger.info('Daily database analysis completed')
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error during database maintenance')
    logger.error('Daily database analysis failed', { error: err })
  }
})

// Handle GDPR requests
export async function handleGDPRRequest(userId: string, requestType: 'export' | 'delete'): Promise<Record<string, any> | void> {
  try {
    logger.info('Processing GDPR request', { userId, requestType })
    const result = await dataRetentionService.handleGDPRRequest(userId, requestType)
    logger.info('GDPR request completed', { userId, requestType })
    return result
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error during GDPR request')
    logger.error('GDPR request failed', { error: err, userId, requestType })
    throw err
  }
}

// Manual trigger functions for one-off operations
export async function performFullMaintenance(): Promise<void> {
  try {
    logger.info('Starting full maintenance')

    // Create backup first
    await backupService.createBackup()

    // Enforce data retention policies
    await dataRetentionService.enforceRetentionPolicies()

    // Perform database maintenance
    await databaseMaintenanceService.performMaintenance()

    // Clean up old backups
    await backupService.enforceRetentionPolicy()

    logger.info('Full maintenance completed')
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error during full maintenance')
    logger.error('Full maintenance failed', { error: err })
    throw err
  }
}

// Start the scheduled jobs
logger.info('Data management jobs scheduled', {
  backup: '0 1 * * *', // Daily at 1 AM
  retention: '0 2 * * 0', // Weekly on Sunday at 2 AM
  maintenance: '0 3 * * *' // Daily at 3 AM
})
