"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'

interface ExportImportDialogProps {
  open: boolean
  onClose: () => void
}

type ExportFormat = 'json' | 'csv' | 'excel'
type ModelType = 'users' | 'orders' | 'products'

export function ExportImportDialog({ open, onClose }: ExportImportDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState<ModelType>('users')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json')
  const [importUrl, setImportUrl] = useState('')

  const getExportStatus = async (jobId: string) => {
    const response = await fetch(`/api/export/${jobId}/status`)
    if (!response.ok) throw new Error('Failed to get export status')
    return response.json()
  }

  const getImportStatus = async (jobId: string) => {
    const response = await fetch(`/api/import/${jobId}/status`)
    if (!response.ok) throw new Error('Failed to get import status')
    return response.json()
  }

  const handleExport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          format: exportFormat,
          filters: {},
        }),
      })

      if (!response.ok) throw new Error('Export failed')
      const job = await response.json()

      // Poll for status
      const interval = setInterval(async () => {
        const status = await getExportStatus(job.id)
        setProgress(status.progress)

        if (status.status === 'completed') {
          clearInterval(interval)
          setIsLoading(false)
          toast({
            title: 'Export completed',
            description: `Download your ${exportFormat} file`,
          })
          window.location.href = status.downloadUrl
        } else if (status.status === 'failed') {
          clearInterval(interval)
          setIsLoading(false)
          toast({
            title: 'Export failed',
            description: status.error,
            variant: 'destructive',
          })
        }
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  const handleImport = async () => {
    if (!importUrl) {
      toast({
        title: 'Import failed',
        description: 'Please provide an import URL',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          url: importUrl,
        }),
      })

      if (!response.ok) throw new Error('Import failed')
      const job = await response.json()

      // Poll for status
      const interval = setInterval(async () => {
        const status = await getImportStatus(job.id)
        setProgress(status.progress)

        if (status.status === 'completed') {
          clearInterval(interval)
          setIsLoading(false)
          toast({
            title: 'Import completed',
            description: `Successfully imported ${status.recordCount} records`,
          })
        } else if (status.status === 'failed') {
          clearInterval(interval)
          setIsLoading(false)
          toast({
            title: 'Import failed',
            description: status.error,
            variant: 'destructive',
          })
        }
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export/Import Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={selectedModel} onValueChange={(value: ModelType) => setSelectedModel(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="products">Products</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export</h3>
            <Select value={exportFormat} onValueChange={(value: ExportFormat) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} disabled={isLoading}>
              Export
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Import</h3>
            <Input
              placeholder="Import URL"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleImport} disabled={isLoading}>
              Import
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">{progress}%</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 