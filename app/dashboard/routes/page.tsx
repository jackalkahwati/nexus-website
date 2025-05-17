"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useRouteOptimization } from "@/contexts/RouteOptimizationContext"
import { RouteMap } from "@/components/maps/RouteMap"
import { NewRouteModal } from "@/components/modals/NewRouteModal"
import { Clock, MoreVertical, Route } from "lucide-react"
import { cn } from "@/lib/cn"

interface Stop {
  id: string
  address: string
  time: string
  status: "pending" | "completed" | "delayed"
  type: "pickup" | "delivery"
  coordinates: {
    lat: number
    lng: number
  }
}

interface Route {
  id: string
  name: string
  driver: string
  vehicle: string
  status: "active" | "scheduled" | "completed"
  startTime: string
  endTime: string
  distance: string
  duration: string
  stops: Stop[]
}

const routes: Route[] = [
  {
    id: "R001",
    name: "Morning Delivery Route",
    driver: "John Smith",
    vehicle: "Truck 001",
    status: "active",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    distance: "120 km",
    duration: "8 hours",
    stops: [
      {
        id: "S1",
        address: "123 Main St, Melbourne",
        time: "09:00 AM",
        status: "completed",
        type: "pickup",
        coordinates: {
          lat: -37.8136,
          lng: 144.9631
        }
      },
      {
        id: "S2",
        address: "456 High St, Richmond",
        time: "10:30 AM",
        status: "completed",
        type: "delivery",
        coordinates: {
          lat: -37.8183,
          lng: 144.9671
        }
      },
      {
        id: "S3",
        address: "789 Chapel St, South Yarra",
        time: "11:45 AM",
        status: "pending",
        type: "delivery",
        coordinates: {
          lat: -37.8373,
          lng: 144.9931
        }
      }
    ]
  },
  {
    id: "R002",
    name: "Afternoon Route",
    driver: "Sarah Johnson",
    vehicle: "Truck 002",
    status: "scheduled",
    startTime: "02:00 PM",
    endTime: "10:00 PM",
    distance: "85 km",
    duration: "6 hours",
    stops: [
      {
        id: "S4",
        address: "321 Bridge Rd, Richmond",
        time: "02:30 PM",
        status: "pending",
        type: "pickup",
        coordinates: {
          lat: -37.8182,
          lng: 144.9891
        }
      },
      {
        id: "S5",
        address: "654 Swan St, Burnley",
        time: "03:45 PM",
        status: "pending",
        type: "delivery",
        coordinates: {
          lat: -37.8282,
          lng: 144.9931
        }
      }
    ]
  }
]

function RouteCard({ route }: { route: Route }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{route.name}</CardTitle>
            <CardDescription>{route.driver} - {route.vehicle}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Route</DropdownMenuItem>
              <DropdownMenuItem>Delete Route</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {route.startTime} - {route.endTime}
          </div>
          <div className="flex items-center">
            <Route className="h-4 w-4 mr-1" />
            {route.distance}
          </div>
          <Badge
            variant={route.status === "active" ? "default" : "secondary"}
            className="capitalize"
          >
            {route.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {route.stops.map((stop, index) => (
            <div key={stop.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  stop.status === "completed" 
                    ? "border-green-500 text-green-500"
                    : "border-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                {index < route.stops.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div>
                  <p className="text-sm font-medium">{stop.address}</p>
                  <Badge variant="outline" className="capitalize">
                    {stop.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stop.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRoute, setSelectedRoute] = React.useState<Route | null>(null)
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = React.useState(false)
  const { toast } = useToast()
  const {
    createOptimizationRequest,
    currentResult,
    isOptimizing,
    clearCurrentResult
  } = useRouteOptimization()

  // Select first active route on page load
  React.useEffect(() => {
    const firstActiveRoute = routes.find(route => route.status === "active")
    if (firstActiveRoute && !selectedRoute) {
      setSelectedRoute(firstActiveRoute)
    }
  }, [selectedRoute])

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOptimizeRoutes = async () => {
    try {
      await createOptimizationRequest(
        "All Routes Optimization",
        new Date().toISOString(),
        routes.map(route => ({
          id: route.id,
          name: route.vehicle,
          startLocation: {
            address: route.stops[0].address,
            lat: route.stops[0].coordinates.lat,
            lng: route.stops[0].coordinates.lng,
          }
        })),
        routes.flatMap(route => 
          route.stops.map(stop => ({
            id: stop.id,
            address: stop.address,
            lat: stop.coordinates.lat,
            lng: stop.coordinates.lng,
            duration: 15,
            type: stop.type
          }))
        ),
        {
          maxStops: 20,
          requireReturn: true,
          avoidTolls: false,
          avoidHighways: false
        }
      )
    } catch (error) {
      console.error("Failed to optimize routes:", error)
      toast({
        title: "Optimization Failed",
        description: "Failed to start route optimization",
        variant: "destructive"
      })
    }
  }

  const handleNewRoute = (data: any) => {
    toast({
      title: "Route Created",
      description: "New route has been created successfully.",
      duration: 2000
    })
    setIsNewRouteModalOpen(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Routes</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsNewRouteModalOpen(true)}>
            New Route
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleOptimizeRoutes}
            disabled={isOptimizing}
          >
            {isOptimizing ? "Optimizing..." : "Optimize Routes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Map */}
        <div className="md:col-span-8 lg:col-span-9">
          {selectedRoute ? (
            <RouteMap 
              stops={selectedRoute.stops}
              selectedRouteId={selectedRoute.id}
            />
          ) : (
            <div className="h-[600px] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Select a route to view on map</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="scheduled" className="flex-1">Scheduled</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredRoutes.filter(route => route.status === "active").map(route => (
                  <div key={route.id} className="mb-4" onClick={() => setSelectedRoute(route)}>
                    <RouteCard route={route} />
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="scheduled" className="space-y-4 mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredRoutes.filter(route => route.status === "scheduled").map(route => (
                  <div key={route.id} className="mb-4" onClick={() => setSelectedRoute(route)}>
                    <RouteCard route={route} />
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredRoutes.filter(route => route.status === "completed").map(route => (
                  <div key={route.id} className="mb-4" onClick={() => setSelectedRoute(route)}>
                    <RouteCard route={route} />
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NewRouteModal
        open={isNewRouteModalOpen}
        onOpenChange={setIsNewRouteModalOpen}
        onSubmit={handleNewRoute}
      />
    </div>
  )
}
