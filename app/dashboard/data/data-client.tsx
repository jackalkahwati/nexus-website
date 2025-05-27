"use client"

import { Suspense, lazy } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportImportProvider } from '@/contexts/ExportImportContext'

// Lazy load components
const ExportImportDialog = lazy(() => import('@/components/data/ExportImportDialog').then(mod => ({ default: mod.ExportImportDialog })))
const JobHistory = lazy(() => import('@/components/data/JobHistory').then(mod => ({ default: mod.JobHistory })))

const EXPORTABLE_MODELS = [
  { id: 'user', name: 'Users' },
  { id: 'fleet', name: 'Fleet' },
  { id: 'trip', name: 'Trips' },
  { id: 'route', name: 'Routes' },
  { id: 'maintenance', name: 'Maintenance Records' },
  { id: 'payment', name: 'Payments' },
  { id: 'booking', name: 'Bookings' }
]

function LoadingSpinner() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export function DataManagementClient() {
  return (
    <ExportImportProvider>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
            <p className="text-muted-foreground">
              Export and import your data in various formats
            </p>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Models</h2>
              <div className="grid gap-4">
                {EXPORTABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{model.name}</h3>
                      <Suspense fallback={null}>
                        <ExportImportDialog
                          open={false}
                          onClose={() => {}}
                        />
                      </Suspense>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Suspense fallback={<LoadingSpinner />}>
              <JobHistory />
            </Suspense>
          </div>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management Guide</h2>
            <Tabs defaultValue="export">
              <TabsList>
                <TabsTrigger value="export">Export Guide</TabsTrigger>
                <TabsTrigger value="import">Import Guide</TabsTrigger>
              </TabsList>
              <TabsContent value="export">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>How to Export Data</h3>
                  <ol>
                    <li>Select the model you want to export from the list</li>
                    <li>Choose your preferred export format (JSON, CSV, or Excel)</li>
                    <li>
                      Decide whether to include related data (this may increase
                      export time)
                    </li>
                    <li>Click the Export button and wait for the process to complete</li>
                    <li>
                      Once completed, click the download link in the job history
                    </li>
                  </ol>
                  <p>
                    <strong>Note:</strong> Large exports are processed in the
                    background and may take some time to complete.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="import">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>How to Import Data</h3>
                  <ol>
                    <li>Select the model you want to import data into</li>
                    <li>
                      Prepare your import file in one of the supported formats
                    </li>
                    <li>
                      Choose whether to validate the data before importing
                      (recommended)
                    </li>
                    <li>
                      Decide if you want to skip duplicate records or replace them
                    </li>
                    <li>Upload your file and start the import process</li>
                    <li>
                      Monitor the progress and check for any validation errors
                    </li>
                  </ol>
                  <p>
                    <strong>Important:</strong> Always validate your import data
                    first to avoid potential issues with your database.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </ExportImportProvider>
  )
} 