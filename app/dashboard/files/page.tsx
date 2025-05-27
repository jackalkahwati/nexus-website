'use client'

import * as React from 'react'
import { FileUpload } from '@/components/files/FileUpload'
import { FileBrowser } from '@/components/files/FileBrowser'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Grid2X2, List, Upload } from 'lucide-react'

export default function FilesPage() {
  const [currentDirectory, setCurrentDirectory] = React.useState('')
  const [viewType, setViewType] = React.useState<'grid' | 'list'>('list')
  const [selectedFile, setSelectedFile] = React.useState<any>(null)

  const handleUploadComplete = () => {
    // Refresh file list
    setSelectedFile(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your files
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={viewType}
            onValueChange={(value: 'grid' | 'list') => setViewType(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                <div className="flex items-center">
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  Grid
                </div>
              </SelectItem>
              <SelectItem value="list">
                <div className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  List
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                {currentDirectory
                  ? `Directory: ${currentDirectory}`
                  : 'All files'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileBrowser
                directory={currentDirectory}
                onDirectoryChange={setCurrentDirectory}
                onFileSelect={setSelectedFile}
                viewType={viewType}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop files or click to upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                directory={currentDirectory}
                onUploadComplete={handleUploadComplete}
                generateThumbnail={true}
              />
            </CardContent>
          </Card>

          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle>File Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFile.mimeType.startsWith('image/') && (
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile.originalName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile.mimeType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedFile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => window.open(selectedFile.url, '_blank')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 