import { promisify } from 'util'
import { gzip, brotliCompress } from 'zlib'

const gzipAsync = promisify(gzip)
const brotliCompressAsync = promisify(brotliCompress)

type CompressionType = 'gzip' | 'br'

/**
 * Compresses data using either Brotli or Gzip compression
 * @param data The data to compress
 * @param type The compression type ('br' for Brotli or 'gzip' for Gzip)
 * @returns Promise<Buffer> The compressed data
 */
export async function compress(
  data: string | Buffer,
  type: CompressionType
): Promise<Buffer> {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)

  try {
    switch (type) {
      case 'br':
        return await brotliCompressAsync(buffer)
      case 'gzip':
        return await gzipAsync(buffer)
      default:
        throw new Error(`Unsupported compression type: ${type}`)
    }
  } catch (error) {
    console.error(`Compression error (${type}):`, error)
    throw error
  }
}

/**
 * Estimates the compression ratio for a given input
 * @param input The input data
 * @returns Promise<{ gzip: number; brotli: number }> Compression ratios
 */
export async function getCompressionRatio(
  input: string | Buffer
): Promise<{ gzip: number; brotli: number }> {
  const originalSize = Buffer.byteLength(input)
  
  const [gzipped, brotlied] = await Promise.all([
    compress(input, 'gzip'),
    compress(input, 'br')
  ])

  return {
    gzip: gzipped.length / originalSize,
    brotli: brotlied.length / originalSize
  }
}

/**
 * Determines the best compression method based on content type and size
 * @param contentType The content type of the data
 * @param sizeInBytes The size of the data in bytes
 * @returns The recommended compression type or null if compression is not recommended
 */
export function getOptimalCompression(
  contentType: string,
  sizeInBytes: number
): CompressionType | null {
  // Don't compress small files
  if (sizeInBytes < 1024) {
    return null
  }

  // Don't compress already compressed formats
  const compressedFormats = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'audio/mp3',
    'video/mp4',
    'application/zip',
    'application/gzip',
    'application/x-gzip',
    'application/x-compressed',
    'application/x-zip-compressed',
  ]

  if (compressedFormats.includes(contentType)) {
    return null
  }

  // Prefer Brotli for text-based content
  const textBasedContent = [
    'text/',
    'application/javascript',
    'application/json',
    'application/xml',
    'application/x-www-form-urlencoded',
    'application/graphql',
  ]

  if (textBasedContent.some(type => contentType.includes(type))) {
    return 'br'
  }

  // Use gzip for everything else that's not excluded
  return 'gzip'
}

/**
 * Checks if the client supports a specific compression type
 * @param acceptEncoding The Accept-Encoding header value
 * @param type The compression type to check
 * @returns boolean indicating if the compression type is supported
 */
export function supportsCompression(
  acceptEncoding: string,
  type: CompressionType
): boolean {
  if (!acceptEncoding) {
    return false
  }

  const encodings = acceptEncoding.split(',').map(e => e.trim().toLowerCase())
  
  switch (type) {
    case 'br':
      return encodings.includes('br')
    case 'gzip':
      return encodings.includes('gzip')
    default:
      return false
  }
} 