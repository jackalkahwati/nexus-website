"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Battery, 
  Radio, 
  MapPin, 
  AlertTriangle, 
  Search,
  Filter,
  Plus,
  Settings
} from "lucide-react"
import { Map } from "@/components/map"
import { cn } from "@/lib/cn"

interface Vehicle {
  id: string
  name: string
  status: "active" | "idle" | "maintenance" | "offline"
  location: string
  lastUpdate: string
  battery: number
  speed: number
  driver: string
}

const vehicles: Vehicle[] = [
  {
    id: "V001",
    name: "Truck 001",
    status: "active",
    location: "Melbourne CBD",
    lastUpdate: "Just now",
    battery: 85,
    speed: 45,
    driver: "John Smith"
  },
  {
    id: "V002",
    name: "Truck 002",
    status: "idle",
    location: "South Bank",
    lastUpdate: "5 min ago",
    battery: 92,
    speed: 0,
    driver: "Sarah Johnson"
  },
  {
    id: "V003",
    name: "Truck 003",
    status: "maintenance",
    location: "Service Center",
    lastUpdate: "2 hours ago",
    battery: 20,
    speed: 0,
    driver: "Mike Brown"
  },
  {
    id: "V004",
    name: "Truck 004",
    status: "offline",
    location: "Unknown",
    lastUpdate: "1 day ago",
    battery: 0,
    speed: 0,
    driver: "Unassigned"
  }
]

const getStatusColor = (status: Vehicle["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
    case "idle":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
    case "maintenance":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
    case "offline":
      return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  }
}

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null)

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Tracking</h2>
          <p className="text-muted-foreground">
            Monitor and manage your fleet in real-time
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Sidebar */}
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vehicles</CardTitle>
              <Badge variant="secondary">{vehicles.length}</Badge>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-colors",
                    selectedVehicle?.id === vehicle.id 
                      ? "bg-muted/50 border-primary"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Radio className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                      </div>
                    </div>
                    <Badge className={cn("capitalize", getStatusColor(vehicle.status))}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {vehicle.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Battery className="h-4 w-4 mr-2" />
                      {vehicle.battery}%
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last update: {vehicle.lastUpdate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map and Details */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Location</CardTitle>
              <CardDescription>Real-time vehicle positions and geofencing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] rounded-lg border">
                <Map className="w-full h-full rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {selectedVehicle && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>Detailed information and telemetry</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList>
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Driver</p>
                        <p className="text-lg font-semibold">{selectedVehicle.driver}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-lg font-semibold">{selectedVehicle.location}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Speed</p>
                        <p className="text-lg font-semibold">{selectedVehicle.speed} km/h</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Battery</p>
                        <p className="text-lg font-semibold">{selectedVehicle.battery}%</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
