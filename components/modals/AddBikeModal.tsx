"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Bike } from "@/types"

interface AddBikeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Bike, 'id'>) => void
}

export function AddBikeModal({ open, onOpenChange, onSubmit }: AddBikeModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        vehicleName: formData.get('vehicleName') as string,
        model: formData.get('model') as string,
        rideType: formData.get('rideType') as 'electric' | 'manual',
        status: 'parked' as const,
        battery: 100,
        lastUser: '',
        location: {
          lat: 37.7749,
          lng: -122.4194
        },
        serviceDates: [],
        qrCode: formData.get('qrCode') as string,
        equipment: formData.get('equipment')?.toString().split(',').map(item => item.trim()) || [],
        health: 'Good',
        description: formData.get('description') as string,
        dateAdded: new Date().toISOString().split('T')[0],
        lastServiceDate: new Date().toISOString().split('T')[0],
        nextServiceDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        totalKilometerage: 0
      }

      onSubmit(data)
      onOpenChange(false)
      toast({
        title: "Success",
        description: "New bike has been added to the fleet.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new bike. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Bike</DialogTitle>
          <DialogDescription>
            Add a new bike to your fleet. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bike Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter bike name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleName">Vehicle ID</Label>
                <Input
                  id="vehicleName"
                  name="vehicleName"
                  placeholder="e.g., SF-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Enter bike model"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rideType">Type</Label>
                <Select name="rideType" defaultValue="electric">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qrCode">QR Code</Label>
                <Input
                  id="qrCode"
                  name="qrCode"
                  placeholder="Enter QR code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Input
                  id="equipment"
                  name="equipment"
                  placeholder="Lock, GPS, Light (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter bike description"
                  className="h-[104px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Bike"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 