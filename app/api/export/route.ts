import { NextRequest, NextResponse } from 'next/server'
import { ExportImportService } from '@/lib/services/export-import'
import { StorageService } from '@/lib/services/storage'
import { z } from 'zod'

const exportRequestSchema = z.object({
  model: z.string(),
  format: z.enum(['json', 'csv']).default('json'),
  filters: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, format, filters } = exportRequestSchema.parse(body)

    const storage = new StorageService()
    const service = new ExportImportService(storage)
    const { jobId } = await service.startExport(model, format, filters)

    return NextResponse.json({ jobId })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId')
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const storage = new StorageService()
    const service = new ExportImportService(storage)
    const status = await service.getExportStatus(jobId)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Export status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get export status' },
      { status: 400 }
    )
  }
} 