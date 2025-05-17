"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Truck, User, MapPin, Plus, X } from "lucide-react"
import { cn } from "@/lib/cn"

interface NewRouteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function NewRouteModal({
  open,
  onOpenChange,
  onSubmit
}: NewRouteModalProps) {
  const [date, setDate] = React.useState<Date>()
  const [stops, setStops] = React.useState<{ address: string; type: "pickup" | "delivery" }[]>([])

  const addStop = () => {
    setStops([...stops, { address: "", type: "pickup" }])
  }

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, field: "address" | "type", value: string) => {
    const newStops = [...stops]
    newStops[index] = {
      ...newStops[index],
      [field]: value
    }
    setStops(newStops)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get("name"),
      driver: formData.get("driver"),
      vehicle: formData.get("vehicle"),
      date: date,
      startTime: formData.get("startTime"),
      stops: stops
    }
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Route</DialogTitle>
          <DialogDescription>
            Plan a new delivery route with multiple stops
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Route Name</Label>
              <Input id="name" name="name" placeholder="Enter route name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Driver</Label>
              <Select name="driver" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="mike">Mike Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select name="vehicle" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck1">Truck 001</SelectItem>
                  <SelectItem value="truck2">Truck 002</SelectItem>
                  <SelectItem value="truck3">Truck 003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Stops</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStop}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stop
              </Button>
            </div>
            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Enter address"
                      value={stop.address}
                      onChange={(e) => updateStop(index, "address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Select
                      value={stop.type}
                      onValueChange={(value) => updateStop(index, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStop(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Route</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 