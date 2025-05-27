"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Battery, MapPin, Wrench, QrCode, Calendar } from "lucide-react"
import { cn } from "@/lib/cn"
import type { Bike } from "@/types"

interface BikeDetailsModalProps {
  bike: Bike | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BikeDetailsModal({ bike, open, onOpenChange }: BikeDetailsModalProps) {
  if (!bike) return null

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{bike.name}</DialogTitle>
          <DialogDescription>
            Vehicle ID: {bike.vehicleName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex items-center justify-between">
              <Badge className={cn("capitalize", getStatusBadgeColor(bike.status))}>
                {bike.status}
              </Badge>
              <div className="flex items-center gap-2">
                <Battery className={cn("h-4 w-4", getBatteryColor(bike.battery))} />
                <span>{bike.battery}% Battery</span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Model:</span> {bike.model}</p>
                  <p><span className="text-muted-foreground">Type:</span> {bike.rideType}</p>
                  <p><span className="text-muted-foreground">Health:</span> {bike.health}</p>
                  <p><span className="text-muted-foreground">Last User:</span> {bike.lastUser}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Location</h3>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    <p>Latitude: {bike.location.lat}</p>
                    <p>Longitude: {bike.location.lng}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment & Service */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {bike.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Service Information</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <p>Last Service: {bike.lastServiceDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <p>Next Due: {bike.nextServiceDue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code & Additional Info */}
            <div className="space-y-2">
              <h3 className="font-semibold">Additional Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <p>QR Code: {bike.qrCode}</p>
                  </div>
                  <p>Total Distance: {bike.totalKilometerage} km</p>
                  <p>Added on: {bike.dateAdded}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">{bike.description}</p>
                </div>
              </div>
            </div>

            {/* Service History */}
            <div className="space-y-2">
              <h3 className="font-semibold">Service History</h3>
              <div className="space-y-2">
                {bike.serviceDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4" />
                    <p>{date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 