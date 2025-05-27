"use client"

import React, { useEffect } from 'react'
import { useExportImport } from '@/contexts/ExportImportContext'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ValidationError {
  row: number
  errors: string[]
}

interface BaseJob {
  id: string
  status: string
  progress: number
  totalRecords: number
  createdAt: string
  error?: string
  format: string
}

interface ExportJob extends BaseJob {
  url: string
}

interface ImportJob extends BaseJob {
  validationErrors?: ValidationError[]
}

type Job = ExportJob | ImportJob

export function JobHistory() {
  const { exportJobs, importJobs, refreshJobs } = useExportImport()

  useEffect(() => {
    refreshJobs()
    const interval = setInterval(refreshJobs, 5000)
    return () => clearInterval(interval)
  }, [refreshJobs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      case 'processing':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {[...exportJobs, ...importJobs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((job: Job) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {'url' in job ? (
                      <Download className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {'url' in job ? 'Export' : 'Import'}
                    </span>
                    <Badge variant="outline">{job.format}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(job.status)}
                    <Badge
                      variant="secondary"
                      className={getStatusColor(job.status)}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>

                <Progress
                  value={job.progress}
                  className="h-2 mb-2"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {job.progress}% ({job.totalRecords} records)
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true
                    })}
                  </span>
                </div>

                {job.error && (
                  <div className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{job.error}</span>
                  </div>
                )}

                {'validationErrors' in job && job.validationErrors && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-500 mb-1">
                      Validation Errors:
                    </p>
                    <ul className="text-sm text-red-500 list-disc list-inside">
                      {job.validationErrors.map((error: ValidationError, index: number) => (
                        <li key={index}>
                          Row {error.row}: {error.errors.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {'url' in job && job.url && job.status === 'completed' && (
                  <a
                    href={job.url}
                    download
                    className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download File
                  </a>
                )}
              </Card>
            ))}

          {exportJobs.length === 0 && importJobs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No jobs found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
} 