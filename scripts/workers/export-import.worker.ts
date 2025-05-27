import { ExportImportService } from '@/lib/services/export-import'
import { StorageService } from '@/lib/services/storage'
import { logger } from '@/lib/services/logging'

const storage = new StorageService()
const service = new ExportImportService(storage)

export async function processExportJob(jobId: string, model: string, options: any) {
  try {
    await service.processExport(jobId, model, options)
  } catch (error) {
    logger.error('Export job failed', { jobId, error })
    throw error
  }
}

export async function processImportJob(
  jobId: string,
  model: string,
  fileUrl: string,
  options: any
) {
  try {
    await service.processImport(jobId, model, fileUrl, options)
  } catch (error) {
    logger.error('Import job failed', { jobId, error })
    throw error
  }
}

// Process pending export jobs
export async function processPendingExportJobs() {
  const pendingJobs = await prisma.exportJob.findMany({
    where: {
      status: 'pending'
    },
    take: 10 // Process 10 jobs at a time
  })

  for (const job of pendingJobs) {
    try {
      const taskData = await prisma.taskQueue.findFirst({
        where: {
          type: 'export',
          data: {
            path: ['jobId'],
            equals: job.id
          }
        }
      })

      if (taskData) {
        const { model, options } = taskData.data
        await processExportJob(job.id, model, options)
      }
    } catch (error) {
      logger.error('Failed to process export job', {
        jobId: job.id,
        error
      })
    }
  }
}

// Process pending import jobs
export async function processPendingImportJobs() {
  const pendingJobs = await prisma.importJob.findMany({
    where: {
      status: 'pending'
    },
    take: 5 // Process 5 jobs at a time (imports are more resource-intensive)
  })

  for (const job of pendingJobs) {
    try {
      const taskData = await prisma.taskQueue.findFirst({
        where: {
          type: 'import',
          data: {
            path: ['jobId'],
            equals: job.id
          }
        }
      })

      if (taskData) {
        const { model, fileUrl, options } = taskData.data
        await processImportJob(job.id, model, fileUrl, options)
      }
    } catch (error) {
      logger.error('Failed to process import job', {
        jobId: job.id,
        error
      })
    }
  }
}

// Main worker loop
export async function startWorker() {
  logger.info('Starting export/import worker')

  while (true) {
    try {
      await processPendingExportJobs()
      await processPendingImportJobs()
    } catch (error) {
      logger.error('Worker error', { error })
    }

    // Wait before next iteration
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

// Start the worker if this file is run directly
if (require.main === module) {
  startWorker().catch(error => {
    logger.error('Worker failed to start', { error })
    process.exit(1)
  })
} 