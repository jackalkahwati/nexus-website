'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Upload, X, FileIcon, ImageIcon, FileText } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete?: (file: any) => void
  directory?: string
  generateThumbnail?: boolean
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
}

export function FileUpload({
  onUploadComplete,
  directory = '',
  generateThumbnail = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/*', 'application/pdf'],
  multiple = false,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const { toast } = useToast()

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      // Filter out files that exceed maxSize
      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize)
      const invalidFiles = acceptedFiles.filter((file) => file.size > maxSize)

      if (invalidFiles.length > 0) {
        toast({
          title: 'Files too large',
          description: `${invalidFiles.length} files exceed the ${
            maxSize / 1024 / 1024
          }MB limit`,
          variant: 'destructive',
        })
      }

      setFiles((prev) => [...prev, ...validFiles])
    },
    [maxSize, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
  })

  const uploadFiles = async () => {
    setUploading(true)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('directory', directory)
        formData.append('generateThumbnail', String(generateThumbnail))

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const data = await response.json()
        onUploadComplete?.(data)

        // Update progress
        setProgress(((i + 1) / files.length) * 100)
      }

      toast({
        title: 'Upload complete',
        description: `Successfully uploaded ${files.length} files`,
      })

      setFiles([])
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6" />
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-6 w-6" />
    }
    return <FileIcon className="h-6 w-6" />
  }

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed ${
          isDragActive ? 'border-primary' : 'border-muted'
        } hover:border-primary transition-colors cursor-pointer`}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-muted-foreground">Drop the files here</p>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Maximum file size: {maxSize / 1024 / 1024}MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {uploading ? (
            <Progress value={progress} className="w-full" />
          ) : (
            <Button onClick={uploadFiles} className="w-full">
              Upload {files.length} file{files.length === 1 ? '' : 's'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 