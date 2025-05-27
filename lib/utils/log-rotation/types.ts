export interface RotationConfig {
  maxSize: number
  maxFiles: number
  compress: boolean
  logDir: string
  filePattern: RegExp
}

export interface FileStats {
  name: string
  size: number
  modified: Date
}

export interface FileStatsWithPath extends FileStats {
  path: string
}
