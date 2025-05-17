"use client"

import * as React from 'react'
import type { Vehicle } from '@prisma/client'
import { VehicleStatus } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Activity } from 'lucide-react'
import { useFleet } from '@/contexts/FleetContext'
import { useToast } from '@/components/ui/use-toast'

interface VehicleDetailsDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function VehicleDetailsDialog({
  vehicle,
  open,
  onOpenChange,
}: VehicleDetailsDialogProps) {
  const { updateVehicleStatus } = useFleet()
  const { toast } = useToast()

  const handleStatusChange = async (status: VehicleStatus) => {
    try {
      await updateVehicleStatus(vehicle.id, status)
      toast({
        title: 'Status Updated',
        description: `Vehicle status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle status',
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-green-500/20 text-green-700 dark:text-green-400'
      case VehicleStatus.MAINTENANCE:
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case VehicleStatus.IN_USE:
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
      case VehicleStatus.OUT_OF_SERVICE:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{vehicle.name}</DialogTitle>
              <DialogDescription>
                {vehicle.type} • ID: {vehicle.id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={vehicle.status}
                onValueChange={(value) => handleStatusChange(value as VehicleStatus)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VehicleStatus.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={VehicleStatus.MAINTENANCE}>Maintenance</SelectItem>
                  <SelectItem value={VehicleStatus.IN_USE}>In Use</SelectItem>
                  <SelectItem value={VehicleStatus.OUT_OF_SERVICE}>Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <span className="text-xl font-bold">
                      {vehicle.status}
                    </span>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Mileage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      {vehicle.mileage} miles
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Last Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xl font-bold">
                      {vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  {vehicle.lastMaintenanceMileage && (
                    <p className="text-sm text-muted-foreground">
                      At {vehicle.lastMaintenanceMileage} miles
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Next Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xl font-bold">
                      {vehicle.nextMaintenanceDue ? new Date(vehicle.nextMaintenanceDue).toLocaleDateString() : 'Not scheduled'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 