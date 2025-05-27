import { prisma } from '../prisma'
import { createHash } from 'crypto'
import { writeFile, mkdir, unlink, readFile, readdir } from 'fs/promises'
import { join, extname } from 'path'
import sharp from 'sharp'
import { IStorageService, FileMetadata, UploadOptions } from '../../types/storage'
import { logger } from '../logging/winston'

export class StorageService implements IStorageService {
  private uploadDir: string
  private baseUrl: string

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || 'public/uploads'
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }

  async uploadFile(
    file: {
      buffer: Buffer
      originalname: string
      mimetype: string
      size: number
    },
    userId: string,
    options: UploadOptions = {}
  ): Promise<FileMetadata> {
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      maxSize = 10 * 1024 * 1024, // 10MB default
      generateThumbnail = false,
      thumbnailOptions = { width: 200, height: 200, fit: 'cover' as const },
      directory = '',
    } = options

    // Validate file type
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('File type not allowed')
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error('File size exceeds limit')
    }

    // Create hash of file content for deduplication
    const hash = createHash('sha256')
      .update(file.buffer)
      .digest('hex')

    // Create unique filename
    const ext = extname(file.originalname)
    const filename = `${hash}${ext}`

    // Create upload directory if it doesn't exist
    const uploadPath = join(this.uploadDir, directory)
    await mkdir(uploadPath, { recursive: true })

    // Save file
    const filePath = join(uploadPath, filename)
    await writeFile(filePath, file.buffer)

    let thumbnailUrl: string | undefined

    // Generate thumbnail for images if requested
    if (
      generateThumbnail &&
      file.mimetype.startsWith('image/') &&
      file.mimetype !== 'image/gif'
    ) {
      const thumbnailFilename = `${hash}_thumb${ext}`
      const thumbnailPath = join(uploadPath, thumbnailFilename)

      await sharp(file.buffer)
        .resize(thumbnailOptions.width, thumbnailOptions.height, {
          fit: thumbnailOptions.fit,
        })
        .toFile(thumbnailPath)

      thumbnailUrl = `${this.baseUrl}/${join(
        'uploads',
        directory,
        thumbnailFilename
      ).replace(/\\/g, '/')}`
    }

    // Save file metadata to database
    const fileMetadata = await prisma.file.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url: `${this.baseUrl}/${join('uploads', directory, filename).replace(/\\/g, '/')}`,
        thumbnailUrl,
        uploadedBy: userId,
      },
    })

    return fileMetadata
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      throw new Error('File not found')
    }

    // Delete physical file
    await unlink(file.path)

    // Delete thumbnail if exists
    if (file.thumbnailUrl) {
      const thumbnailPath = join(
        this.uploadDir,
        file.thumbnailUrl.split('/uploads/')[1]
      )
      await unlink(thumbnailPath).catch(() => {})
    }

    // Delete database record
    await prisma.file.delete({
      where: { id: fileId },
    })
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    return prisma.file.findUnique({
      where: { id: fileId },
    })
  }

  async listFiles(
    userId: string,
    options: {
      page?: number
      limit?: number
      type?: string
      directory?: string
    } = {}
  ) {
    const { page = 1, limit = 10, type, directory } = options

    const where = {
      uploadedBy: userId,
      ...(type && { mimeType: { startsWith: type } }),
      ...(directory && { path: { contains: directory } }),
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.file.count({ where }),
    ])

    return {
      files,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async moveFile(fileId: string, newDirectory: string): Promise<FileMetadata> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      throw new Error('File not found')
    }

    const newPath = join(this.uploadDir, newDirectory, file.filename)
    const newUrl = `${this.baseUrl}/${join('uploads', newDirectory, file.filename).replace(/\\/g, '/')}`

    // Create new directory if it doesn't exist
    await mkdir(join(this.uploadDir, newDirectory), { recursive: true })

    // Move file to new location
    await writeFile(newPath, await readFile(file.path))
    await unlink(file.path)

    // Update database record
    return prisma.file.update({
      where: { id: fileId },
      data: {
        path: newPath,
        url: newUrl,
      },
    })
  }

  async uploadChunk(path: string, data: Buffer): Promise<void> {
    const fullPath = join(this.uploadDir, path)
    await mkdir(join(this.uploadDir, path, '..'), { recursive: true })
    await writeFile(fullPath, data)
    logger.debug(`Uploaded chunk to ${fullPath}`)
  }

  async combineChunks(directory: string, format: string): Promise<string> {
    const fullDir = join(this.uploadDir, directory)
    const files = await readdir(fullDir)
    const combinedPath = `${directory}/combined.${format}`
    const fullCombinedPath = join(this.uploadDir, combinedPath)
    
    // Combine all chunks in order
    const chunks = await Promise.all(
      files
        .filter(f => f.endsWith(format))
        .sort((a, b) => {
          const numA = parseInt(a.split('.')[0])
          const numB = parseInt(b.split('.')[0])
          return numA - numB
        })
        .map(async f => await readFile(join(fullDir, f)))
    )
    
    await writeFile(fullCombinedPath, Buffer.concat(chunks))
    
    // Clean up chunks
    await Promise.all(
      files
        .filter(f => f.endsWith(format))
        .map(f => unlink(join(fullDir, f)))
    )
    
    return `${this.baseUrl}/${combinedPath.replace(/\\/g, '/')}`
  }

  async downloadFile(url: string): Promise<Buffer> {
    if (url.startsWith(this.baseUrl)) {
      // Local file
      const path = url.replace(this.baseUrl, '').replace(/^\//, '')
      return readFile(join(this.uploadDir, path))
    } else {
      // Remote file
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }
      return Buffer.from(await response.arrayBuffer())
    }
  }
}

// Export the implementation
export const storageService = new StorageService()
