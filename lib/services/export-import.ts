import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { logger } from './logging'
import { taskQueueService } from './task-queue'
import { StorageService } from './storage'

export interface ExportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalRecords: number
  createdAt: string
  error?: string
  format: 'json' | 'csv'
  url?: string
}

export interface ImportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalRecords: number
  createdAt: string
  error?: string
  format: 'json' | 'csv'
  validationErrors?: Array<{
    row: number
    errors: string[]
  }>
}

export interface ExportOptions {
  format?: 'json' | 'csv'
  filters?: Record<string, any>
  includeFields?: string[]
  excludeFields?: string[]
}

export interface ImportOptions {
  validateOnly?: boolean
  updateExisting?: boolean
  batchSize?: number
  skipErrors?: boolean
  mapping?: Record<string, string>
}

const exportSchema = z.object({
  model: z.string(),
  format: z.enum(['json', 'csv']).default('json'),
  filters: z.record(z.any()).optional(),
})

const importSchema = z.object({
  model: z.string(),
  fileUrl: z.string().url(),
  options: z.record(z.any()).optional(),
})

export class ExportImportService {
  private storage: StorageService

  constructor(storage: StorageService) {
    this.storage = storage
  }

  async startExport(model: string, format: 'json' | 'csv' = 'json', filters = {}): Promise<{ jobId: string }> {
    const validatedData = exportSchema.parse({ model, format, filters })

    const jobId = await taskQueueService.addTask(
      'export',
      'export',
      'data-export',
      {
        model: validatedData.model,
        format: validatedData.format,
        filters: validatedData.filters,
      }
    )

    return { jobId }
  }

  async startImport(model: string, fileUrl: string, options: ImportOptions = {}): Promise<{ jobId: string }> {
    const validatedData = importSchema.parse({ model, fileUrl, options })

    const jobId = await taskQueueService.addTask(
      'import',
      'import',
      'data-import',
      {
        model: validatedData.model,
        fileUrl: validatedData.fileUrl,
        options: validatedData.options,
      }
    )

    return { jobId }
  }

  async getExportStatus(jobId: string): Promise<ExportJob> {
    const task = await taskQueueService.getTask(jobId)
    if (!task) {
      throw new Error('Export job not found')
    }

    return {
      id: task.id,
      status: task.status as ExportJob['status'],
      progress: task.progress,
      totalRecords: task.totalRecords || 0,
      createdAt: task.createdAt,
      error: task.error,
      format: task.data?.format || 'json',
      url: task.result?.fileName ? await this.storage.generateSignedUrl(task.result.fileName) : undefined,
    }
  }

  async getImportStatus(jobId: string): Promise<ImportJob> {
    const task = await taskQueueService.getTask(jobId)
    if (!task) {
      throw new Error('Import job not found')
    }

    return {
      id: task.id,
      status: task.status as ImportJob['status'],
      progress: task.progress,
      totalRecords: task.totalRecords || 0,
      createdAt: task.createdAt,
      error: task.error,
      format: task.data?.format || 'json',
      validationErrors: task.result?.validationErrors,
    }
  }

  async processExport(jobId: string, model: string, options: ExportOptions) {
    try {
      logger.info('Starting export process', { jobId, model })

      // Get data from database
      const data = await this.getModelData(model, options.filters)

      // Store data in temporary file
      const fileName = `export-${jobId}.json`
      await this.storage.upload(fileName, Buffer.from(JSON.stringify(data)))

      // Update task status
      await taskQueueService.completeTask(jobId, { fileName })

      logger.info('Export completed successfully', { jobId })
    } catch (error) {
      logger.error('Export failed', { jobId, error })
      await taskQueueService.failTask(jobId, error instanceof Error ? error.message : 'Export failed')
      throw error
    }
  }

  async processImport(jobId: string, model: string, fileUrl: string, options: ImportOptions) {
    try {
      logger.info('Starting import process', { jobId, model })

      // Download file from URL
      const data = await this.storage.download(fileUrl)

      // Parse and validate data
      const importData = JSON.parse(data.toString())

      // Import data into database
      await this.importModelData(model, importData, options)

      // Update task status
      await taskQueueService.completeTask(jobId)

      logger.info('Import completed successfully', { jobId })
    } catch (error) {
      logger.error('Import failed', { jobId, error })
      await taskQueueService.failTask(jobId, error instanceof Error ? error.message : 'Export failed')
      throw error
    }
  }

  private async getModelData(model: string, filters = {}) {
    return prisma[model].findMany({
      where: filters,
    })
  }

  private async importModelData(model: string, data: any[], options: ImportOptions = {}) {
    const { batchSize = 100, skipErrors = false } = options

    // Implement transaction and batch processing for large imports
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      await prisma.$transaction(async (tx: any) => {
        for (const item of batch) {
          try {
            await tx[model].create({
              data: item,
            })
          } catch (error) {
            if (!skipErrors) throw error
            logger.warn('Failed to import item', { model, item, error })
          }
        }
      })
    }
  }
} 