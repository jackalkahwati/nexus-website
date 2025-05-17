"use client"

import React, { useState } from 'react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const reportOptions = [
  { value: 'daily', label: 'Daily Report' },
  { value: 'weekly', label: 'Weekly Report' },
  { value: 'monthly', label: 'Monthly Report' },
  { value: 'quarterly', label: 'Quarterly Report' },
  { value: 'annual', label: 'Annual Report' },
]

const reportTypes = [
  { value: 'fleet-utilization', label: 'Fleet Utilization' },
  { value: 'vehicle-status', label: 'Vehicle Status Distribution' },
  { value: 'maintenance', label: 'Maintenance Records' },
  { value: 'location-history', label: 'Location History' },
  { value: 'battery-health', label: 'Battery Health Metrics' },
  { value: 'usage-patterns', label: 'Usage Patterns' },
  { value: 'incident-reports', label: 'Incident Reports' },
]

export function DownloadReports() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState('daily')
  const [dataType, setDataType] = useState('fleet-utilization')
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      // In a real implementation, this would call your API endpoint
      const response = await fetch(`/api/fleet/reports/download?type=${reportType}&data=${dataType}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fleet-${dataType}-${reportType}-report.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Fleet report downloaded successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download fleet report",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Download Fleet Reports</h3>
        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={dataType} onValueChange={setDataType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {reportOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleDownload} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          {isLoading ? 'Downloading...' : 'Download Report'}
        </Button>
      </div>
    </div>
  )
} 