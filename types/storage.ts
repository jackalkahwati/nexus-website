export interface FileMetadata {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface UploadOptions {
  allowedTypes?: string[]
  maxSize?: number // in bytes
  generateThumbnail?: boolean
  thumbnailOptions?: {
    width: number
    height: number
    fit?: 'cover' | 'contain' | 'fill'
  }
  directory?: string
}

export interface IStorageService {
  uploadFile(
    file: {
      buffer: Buffer
      originalname: string
      mimetype: string
      size: number
    },
    userId: string,
    options?: UploadOptions
  ): Promise<FileMetadata>

  deleteFile(fileId: string): Promise<void>

  getFileMetadata(fileId: string): Promise<FileMetadata | null>

  listFiles(
    userId: string,
    options?: {
      page?: number
      limit?: number
      type?: string
      directory?: string
    }
  ): Promise<{
    files: FileMetadata[]
    total: number
    page: number
    totalPages: number
  }>

  moveFile(fileId: string, newDirectory: string): Promise<FileMetadata>
}
