'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileIcon,
  ImageIcon,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  FolderOpen,
} from 'lucide-react'
import { format } from 'date-fns'

interface FileData {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  createdAt: string
}

interface FileBrowserProps {
  directory?: string
  onDirectoryChange?: (directory: string) => void
  onFileSelect?: (file: FileData) => void
  viewType?: 'grid' | 'list'
}

export function FileBrowser({
  directory = '',
  onDirectoryChange,
  onFileSelect,
  viewType = 'list',
}: FileBrowserProps) {
  const [files, setFiles] = React.useState<FileData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const { toast } = useToast()

  const fetchFiles = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/files?directory=${directory}&type=${searchQuery}`
      )
      if (!response.ok) throw new Error('Failed to fetch files')
      const data = await response.json()
      setFiles(data.files)
    } catch (error) {
      console.error('Error fetching files:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch files',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [directory, searchQuery, toast])

  React.useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files?fileId=${fileId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete file')
      
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      })
      
      fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      })
    }
  }

  const getFileIcon = (file: FileData) => {
    if (file.mimeType.startsWith('image/')) {
      return file.thumbnailUrl ? (
        <img
          src={file.thumbnailUrl}
          alt={file.originalName}
          className="h-10 w-10 object-cover rounded"
        />
      ) : (
        <ImageIcon className="h-6 w-6" />
      )
    }
    if (file.mimeType === 'application/pdf') {
      return <FileText className="h-6 w-6" />
    }
    return <FileIcon className="h-6 w-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {directory && (
          <Button
            variant="outline"
            onClick={() => onDirectoryChange?.('')}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Back to root
          </Button>
        )}
      </div>

      {viewType === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file)}
                      <span>{file.originalName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{file.mimeType}</TableCell>
                  <TableCell>
                    {format(new Date(file.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteFile(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No files found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card
              key={file.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onFileSelect?.(file)}
            >
              <div className="flex flex-col items-center space-y-2">
                {getFileIcon(file)}
                <div className="text-center">
                  <p className="font-medium truncate w-full">
                    {file.originalName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, '_blank')
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(file.id)
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
          {files.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No files found
            </div>
          )}
        </div>
      )}
    </div>
  )
} 