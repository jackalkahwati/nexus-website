"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ExportJob, ImportJob, ExportOptions, ImportOptions } from '@/lib/services/export-import'
import { useToast } from '@/components/ui/use-toast'

interface ExportImportContextType {
  exportJobs: ExportJob[]
  importJobs: ImportJob[]
  loadingExport: boolean
  loadingImport: boolean
  startExport: (model: string, options: ExportOptions) => Promise<ExportJob>
  startImport: (model: string, file: File, options: ImportOptions) => Promise<ImportJob>
  getExportStatus: (jobId: string) => Promise<ExportJob>
  getImportStatus: (jobId: string) => Promise<ImportJob>
  refreshJobs: () => Promise<void>
}

const ExportImportContext = createContext<ExportImportContextType | undefined>(undefined)

export function ExportImportProvider({ children }: { children: React.ReactNode }) {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [importJobs, setImportJobs] = useState<ImportJob[]>([])
  const [loadingExport, setLoadingExport] = useState(false)
  const [loadingImport, setLoadingImport] = useState(false)
  const { toast } = useToast()

  const startExport = useCallback(async (
    model: string,
    options: ExportOptions
  ): Promise<ExportJob> => {
    try {
      setLoadingExport(true)
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start export')
      }

      const job = await response.json()
      setExportJobs(prev => [job, ...prev])
      return job
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to start export',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoadingExport(false)
    }
  }, [toast])

  const startImport = useCallback(async (
    model: string,
    file: File,
    options: ImportOptions
  ): Promise<ImportJob> => {
    try {
      setLoadingImport(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('model', model)
      formData.append('validateOnly', String(options.validateOnly))
      formData.append('updateExisting', String(options.updateExisting))
      formData.append('batchSize', String(options.batchSize))
      formData.append('skipErrors', String(options.skipErrors))
      if (options.mapping) {
        formData.append('mapping', JSON.stringify(options.mapping))
      }

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to start import')
      }

      const job = await response.json()
      setImportJobs(prev => [job, ...prev])
      return job
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to start import',
        variant: 'destructive'
      })
      throw error
    } finally {
      setLoadingImport(false)
    }
  }, [toast])

  const getExportStatus = useCallback(async (jobId: string): Promise<ExportJob> => {
    const response = await fetch(`/api/export?jobId=${jobId}`)
    if (!response.ok) {
      throw new Error('Failed to get export status')
    }
    const status = await response.json()
    setExportJobs(prev =>
      prev.map(job => (job.id === jobId ? status : job))
    )
    return status
  }, [])

  const getImportStatus = useCallback(async (jobId: string): Promise<ImportJob> => {
    const response = await fetch(`/api/import?jobId=${jobId}`)
    if (!response.ok) {
      throw new Error('Failed to get import status')
    }
    const status = await response.json()
    setImportJobs(prev =>
      prev.map(job => (job.id === jobId ? status : job))
    )
    return status
  }, [])

  const refreshJobs = useCallback(async () => {
    try {
      const [exportResponse, importResponse] = await Promise.all([
        fetch('/api/export/jobs'),
        fetch('/api/import/jobs')
      ])

      if (exportResponse.ok) {
        const exportData = await exportResponse.json()
        setExportJobs(exportData)
      }

      if (importResponse.ok) {
        const importData = await importResponse.json()
        setImportJobs(importData)
      }
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh job status',
        variant: 'destructive'
      })
    }
  }, [toast])

  return (
    <ExportImportContext.Provider
      value={{
        exportJobs,
        importJobs,
        loadingExport,
        loadingImport,
        startExport,
        startImport,
        getExportStatus,
        getImportStatus,
        refreshJobs
      }}
    >
      {children}
    </ExportImportContext.Provider>
  )
}

export function useExportImport() {
  const context = useContext(ExportImportContext)
  if (context === undefined) {
    throw new Error('useExportImport must be used within an ExportImportProvider')
  }
  return context
} 