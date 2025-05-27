"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { BikeDetailsModal } from "@/components/modals/BikeDetailsModal"
import { AddBikeModal } from "@/components/modals/AddBikeModal"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Battery,
  MoreVertical,
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  X
} from "lucide-react"
import { cn } from "@/lib/cn"
import { exportToCSV } from "@/lib/client-utils"
import type { Bike } from "@/types"

const mockBikes: Bike[] = [
  {
    id: 1,
    name: "Bike 001",
    status: "active",
    lastUser: "John Doe",
    battery: 85,
    location: { lat: 37.7749, lng: -122.4194 },
    model: "City Cruiser",
    rideType: "electric",
    serviceDates: ["2024-01-15"],
    vehicleName: "SF-001",
    qrCode: "BIKE001",
    equipment: ["Lock", "GPS", "Light"],
    health: "Good",
    description: "Downtown commuter bike",
    dateAdded: "2023-12-01",
    lastServiceDate: "2024-01-15",
    nextServiceDue: "2024-04-15",
    totalKilometerage: 1250
  },
  // Add more mock bikes here...
]

// Add more mock data
for (let i = 2; i <= 25; i++) {
  mockBikes.push({
    ...mockBikes[0],
    id: i,
    name: `Bike ${i.toString().padStart(3, '0')}`,
    vehicleName: `SF-${i.toString().padStart(3, '0')}`,
    battery: Math.floor(Math.random() * 100),
    status: ['active', 'parked', 'maintenance'][Math.floor(Math.random() * 3)] as Bike['status'],
    lastUser: ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown'][Math.floor(Math.random() * 4)],
    totalKilometerage: Math.floor(Math.random() * 5000)
  })
}

type FilterState = {
  status: Bike['status'][]
  batteryLevel: 'all' | 'high' | 'medium' | 'low'
  serviceDue: boolean
}

export default function FleetPage() {
  const searchParams = useSearchParams()
  const [bikes, setBikes] = React.useState<Bike[]>(mockBikes)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Bike | null,
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(10)
  const [selectedBike, setSelectedBike] = React.useState<Bike | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false)
  const [addModalOpen, setAddModalOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    batteryLevel: 'all',
    serviceDue: false
  })

  // Open add modal if add=true in URL
  React.useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setAddModalOpen(true)
    }
  }, [searchParams])

  const filteredBikes = React.useMemo(() => {
    return bikes.filter(bike => {
      // Text search
      const matchesSearch = 
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.lastUser.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(bike.status)

      // Battery level filter
      const matchesBattery = 
        filters.batteryLevel === 'all' ||
        (filters.batteryLevel === 'high' && bike.battery > 70) ||
        (filters.batteryLevel === 'medium' && bike.battery > 30 && bike.battery <= 70) ||
        (filters.batteryLevel === 'low' && bike.battery <= 30)

      // Service due filter
      const matchesService = !filters.serviceDue || (
        new Date(bike.nextServiceDue) <= new Date(new Date().setDate(new Date().getDate() + 7))
      )

      return matchesSearch && matchesStatus && matchesBattery && matchesService
    })
  }, [bikes, searchQuery, filters])

  const sortedBikes = React.useMemo(() => {
    if (!sortConfig.key) return filteredBikes

    return [...filteredBikes].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredBikes, sortConfig])

  // Calculate pagination
  const totalPages = Math.ceil(sortedBikes.length / itemsPerPage)
  const paginatedBikes = sortedBikes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: keyof Bike) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-500"
    if (level > 30) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusBadgeColor = (status: Bike['status']) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800"
      case 'parked':
        return "bg-blue-100 text-blue-800"
      case 'maintenance':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetails = (bike: Bike) => {
    setSelectedBike(bike)
    setDetailsModalOpen(true)
  }

  const toggleStatusFilter = (status: Bike['status']) => {
    setFilters(current => ({
      ...current,
      status: current.status.includes(status)
        ? current.status.filter(s => s !== status)
        : [...current.status, status]
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      batteryLevel: 'all',
      serviceDue: false
    })
  }

  const activeFiltersCount = 
    filters.status.length +
    (filters.batteryLevel !== 'all' ? 1 : 0) +
    (filters.serviceDue ? 1 : 0)

  const handleExport = () => {
    const exportData = sortedBikes.map(bike => ({
      vehicleName: bike.vehicleName,
      name: bike.name,
      status: bike.status,
      lastUser: bike.lastUser,
      battery: `${bike.battery}%`,
      model: bike.model,
      rideType: bike.rideType,
      health: bike.health,
      lastServiceDate: bike.lastServiceDate,
      nextServiceDue: bike.nextServiceDue,
      totalKilometerage: `${bike.totalKilometerage} km`,
      description: bike.description
    }))

    exportToCSV(exportData, 'fleet-status')
  }

  const handleAddBike = (data: Omit<Bike, 'id'>) => {
    const newBike = {
      ...data,
      id: Math.max(...bikes.map(b => b.id)) + 1
    }
    setBikes(current => [...current, newBike])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Bike
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bikes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={clearFilters} className="justify-between">
              Clear Filters
              {activeFiltersCount > 0 && <X className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {/* Status Filters */}
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Status</p>
              <div className="space-y-1">
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes('active')}
                  onCheckedChange={() => toggleStatusFilter('active')}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes('parked')}
                  onCheckedChange={() => toggleStatusFilter('parked')}
                >
                  Parked
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes('maintenance')}
                  onCheckedChange={() => toggleStatusFilter('maintenance')}
                >
                  Maintenance
                </DropdownMenuCheckboxItem>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Battery Level Filter */}
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Battery Level</p>
              <div className="space-y-1">
                <DropdownMenuCheckboxItem
                  checked={filters.batteryLevel === 'all'}
                  onCheckedChange={() => setFilters(f => ({ ...f, batteryLevel: 'all' }))}
                >
                  All Levels
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.batteryLevel === 'high'}
                  onCheckedChange={() => setFilters(f => ({ ...f, batteryLevel: 'high' }))}
                >
                  High (&gt;70%)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.batteryLevel === 'medium'}
                  onCheckedChange={() => setFilters(f => ({ ...f, batteryLevel: 'medium' }))}
                >
                  Medium (30-70%)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.batteryLevel === 'low'}
                  onCheckedChange={() => setFilters(f => ({ ...f, batteryLevel: 'low' }))}
                >
                  Low (&lt;30%)
                </DropdownMenuCheckboxItem>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Service Due Filter */}
            <div className="p-2">
              <DropdownMenuCheckboxItem
                checked={filters.serviceDue}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, serviceDue: checked }))}
              >
                Service Due Soon
              </DropdownMenuCheckboxItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1"
                >
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Last User</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead>Total KM</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBikes.map((bike) => (
              <TableRow key={bike.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(bike)}>
                <TableCell className="font-medium">{bike.vehicleName}</TableCell>
                <TableCell>
                  <Badge className={cn("capitalize", getStatusBadgeColor(bike.status))}>
                    {bike.status}
                  </Badge>
                </TableCell>
                <TableCell>{bike.lastUser}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Battery className={cn("h-4 w-4", getBatteryColor(bike.battery))} />
                    {bike.battery}%
                  </div>
                </TableCell>
                <TableCell>{bike.lastServiceDate}</TableCell>
                <TableCell>{bike.totalKilometerage} km</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(bike)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Service History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="border-t p-4">
          <Pagination
            page={currentPage}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Bike Details Modal */}
      <BikeDetailsModal
        bike={selectedBike}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      {/* Add Bike Modal */}
      <AddBikeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddBike}
      />
    </div>
  )
} 