"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wrench,
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Clock,
  Calendar,
  Download,
  FileText,
  DollarSign,
} from "lucide-react"
import { useMaintenance } from "@/contexts/MaintenanceContext"
import { ServiceHistory, MaintenanceType } from "@/types/maintenance"
import { ServiceHistoryDialog } from "@/components/maintenance/service-history-dialog"
import { cn } from "@/lib/cn"
import { format } from "date-fns"

type SortableFields = keyof Pick<ServiceHistory, "performedAt" | "cost" | "mileage">

export default function ServiceHistoryPage() {
  const { serviceHistory, isLoading } = useMaintenance()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRecord, setSelectedRecord] = React.useState<ServiceHistory | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [typeFilter, setTypeFilter] = React.useState<MaintenanceType | "all">("all")
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableFields | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })

  const filteredHistory = React.useMemo(() => {
    return serviceHistory.filter((record) => {
      const matchesSearch =
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.vehicleId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === "all" || record.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [serviceHistory, searchQuery, typeFilter])

  const sortedHistory = React.useMemo(() => {
    if (!sortConfig.key) return filteredHistory

    return [...filteredHistory].sort((a, b) => {
      if (!sortConfig.key) return 0
      
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredHistory, sortConfig])

  const handleSort = (key: SortableFields) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totalCost = React.useMemo(() => {
    return serviceHistory.reduce((sum, record) => sum + record.cost, 0)
  }, [serviceHistory])

  const getMaintenanceTypeColor = (type: MaintenanceType) => {
    switch (type) {
      case "preventive":
        return "bg-blue-100 text-blue-800"
      case "corrective":
        return "bg-red-100 text-red-800"
      case "charging":
        return "bg-purple-100 text-purple-800"
      case "battery":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Wrench className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Loading service history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Service History</h1>
          <p className="text-muted-foreground">
            View and manage vehicle service records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              All time service records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total maintenance expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Service</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceHistory.length > 0
                ? format(new Date(serviceHistory[0].performedAt), "MMM d, yyyy")
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent service date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${serviceHistory.length > 0
                ? (totalCost / serviceHistory.length).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average cost per service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Records</CardTitle>
              <CardDescription>Complete maintenance history</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: MaintenanceType | "all") => setTypeFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("performedAt")}
                    className="flex items-center gap-1"
                  >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("mileage")}
                    className="flex items-center gap-1"
                  >
                    Mileage
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("cost")}
                    className="flex items-center gap-1"
                  >
                    Cost
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.vehicleId}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {record.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(getMaintenanceTypeColor(record.type))}>
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.performedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{record.performedBy}</TableCell>
                  <TableCell>{record.mileage.toLocaleString()} mi</TableCell>
                  <TableCell>${record.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRecord(record)
                            setDialogOpen(true)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Service History Dialog */}
      <ServiceHistoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={selectedRecord}
      />
    </div>
  )
} 