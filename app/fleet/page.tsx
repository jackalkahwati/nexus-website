"use client"

import * as React from 'react'
import { useFleet } from '@/contexts/FleetContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AlertCircle, Battery, Calendar, Car, MapPin, Plus, Truck } from 'lucide-react'
import { cn } from '@/lib/cn'
import dynamic from 'next/dynamic'
import VehicleDetailsDialog from '@/components/fleet/VehicleDetailsDialog'

const FleetMap = dynamic(() => import('@/components/fleet/FleetMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-secondary/20 animate-pulse rounded-lg" />
  ),
})

export default function FleetPage() {
  const {
    vehicles,
    stats,
    alerts,
    isLoading,
    error,
    selectedVehicle,
    setSelectedVehicle,
  } = useFleet()

  const [filter, setFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(filter.toLowerCase())
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [vehicles, filter, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case 'Offline':
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
      case 'Maintenance':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case 'Charging':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      case 'Reserved':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-400'
      case 'Parked':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  const handleVehicleSelect = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle)
    setDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-8">
      {/* Fleet Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active • {stats.inactive} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilization}%</div>
            <Progress value={stats.utilization} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.alerts.high + stats.alerts.medium + stats.alerts.low}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive">{stats.alerts.high} High</Badge>
              <Badge variant="default">{stats.alerts.medium} Med</Badge>
              <Badge variant="secondary">{stats.alerts.low} Low</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.performance.onTime}%</div>
            <p className="text-xs text-muted-foreground">
              On-time performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Management Interface */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Vehicle List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fleet Vehicles</CardTitle>
                <CardDescription>
                  Manage and monitor your fleet vehicles
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Search vehicles..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="charging">Charging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className={cn(
                        'cursor-pointer',
                        selectedVehicle?.id === vehicle.id && 'bg-muted/50'
                      )}
                      onClick={() => handleVehicleSelect(vehicle)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.type}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4" />
                          {vehicle.batteryLevel}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {vehicle.location.lat.toFixed(4)},
                            {vehicle.location.lng.toFixed(4)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column - Map View */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Fleet Map</CardTitle>
            <CardDescription>
              Real-time location tracking of all vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg overflow-hidden">
              <FleetMap
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={handleVehicleSelect}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  )
}
