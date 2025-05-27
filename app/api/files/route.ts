import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { StorageService } from '@/lib/services/storage'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'

const storage = new StorageService()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const directory = formData.get('directory') as string
    const generateThumbnail = formData.get('generateThumbnail') === 'true'

    if (!file) {
      return new NextResponse('No file provided', { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create temporary file
    const tempPath = join(tmpdir(), randomUUID())
    await writeFile(tempPath, buffer)

    const fileMetadata = await storage.uploadFile(
      {
        buffer,
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
      },
      session.user.id,
      {
        directory,
        generateThumbnail,
      }
    )

    return NextResponse.json(fileMetadata)
  } catch (error) {
    console.error('Error uploading file:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || undefined
    const directory = searchParams.get('directory') || undefined

    const files = await storage.listFiles(session.user.id, {
      page,
      limit,
      type,
      directory,
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error listing files:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return new NextResponse('No file ID provided', { status: 400 })
    }

    await storage.deleteFile(fileId)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting file:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
} 