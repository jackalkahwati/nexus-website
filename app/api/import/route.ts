import { NextRequest, NextResponse } from 'next/server'
import { ExportImportService } from '@/lib/services/export-import'
import { StorageService } from '@/lib/services/storage'
import { z } from 'zod'

const importRequestSchema = z.object({
  model: z.string(),
  fileUrl: z.string().url(),
  options: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, fileUrl, options } = importRequestSchema.parse(body)

    const storage = new StorageService()
    const service = new ExportImportService(storage)
    const { jobId } = await service.startImport(model, fileUrl, options)

    return NextResponse.json({ jobId })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
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
    const status = await service.getImportStatus(jobId)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Import status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get import status' },
      { status: 400 }
    )
  }
} 