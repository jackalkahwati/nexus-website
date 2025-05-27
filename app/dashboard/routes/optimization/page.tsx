"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouteOptimization } from "@/contexts/RouteOptimizationContext"
import { OptimizedRouteMap } from "@/components/maps/OptimizedRouteMap"
import { DatePicker } from "@/components/ui/date-picker"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash } from "lucide-react"
import { Vehicle, Stop, OptimizationConstraint } from "@/types/route-optimization"

export default function RouteOptimizationPage() {
  const {
    createOptimizationRequest,
    currentResult,
    isOptimizing,
    clearCurrentResult
  } = useRouteOptimization()

  const [name, setName] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [constraints, setConstraints] = useState<OptimizationConstraint>({
    maxStops: 20,
    requireReturn: true,
    avoidTolls: false,
    avoidHighways: false
  })

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: `v_${vehicles.length + 1}`,
      name: `Vehicle ${vehicles.length + 1}`,
      startLocation: {
        address: "",
        lat: 0,
        lng: 0
      }
    }
    setVehicles([...vehicles, newVehicle])
  }

  const handleAddStop = () => {
    const newStop: Stop = {
      id: `s_${stops.length + 1}`,
      address: "",
      lat: 0,
      lng: 0,
      duration: 15,
      type: "delivery"
    }
    setStops([...stops, newStop])
  }

  const handleUpdateVehicle = (index: number, updates: Partial<Vehicle>) => {
    const updatedVehicles = [...vehicles]
    updatedVehicles[index] = { ...updatedVehicles[index], ...updates }
    setVehicles(updatedVehicles)
  }

  const handleUpdateStop = (index: number, updates: Partial<Stop>) => {
    const updatedStops = [...stops]
    updatedStops[index] = { ...updatedStops[index], ...updates }
    setStops(updatedStops)
  }

  const handleRemoveVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
  }

  const handleOptimize = async () => {
    try {
      await createOptimizationRequest(
        name,
        date.toISOString(),
        vehicles,
        stops,
        constraints
      )
    } catch (error) {
      console.error('Failed to create optimization request:', error)
    }
  }

  const handleReset = () => {
    setName("")
    setDate(new Date())
    setVehicles([])
    setStops([])
    clearCurrentResult()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Route Optimization</h2>
          <p className="text-muted-foreground">
            Optimize your delivery routes for maximum efficiency
          </p>
        </div>
        {currentResult && (
          <Button variant="outline" onClick={handleReset}>
            New Optimization
          </Button>
        )}
      </div>

      {currentResult ? (
        <OptimizedRouteMap result={currentResult} />
      ) : (
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="stops">Stops</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>
                  Add the vehicles available for deliveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={vehicle.name}
                            onChange={(e) =>
                              handleUpdateVehicle(index, { name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Location</Label>
                          <Input
                            value={vehicle.startLocation.address}
                            onChange={(e) =>
                              handleUpdateVehicle(index, {
                                startLocation: {
                                  ...vehicle.startLocation,
                                  address: e.target.value
                                }
                              })
                            }
                            placeholder="Enter start address"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Max Stops</Label>
                          <Input
                            type="number"
                            value={vehicle.maxStops || ""}
                            onChange={(e) =>
                              handleUpdateVehicle(index, {
                                maxStops: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Distance (km)</Label>
                          <Input
                            type="number"
                            value={vehicle.maxDistance || ""}
                            onChange={(e) =>
                              handleUpdateVehicle(index, {
                                maxDistance: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Capacity</Label>
                          <Input
                            type="number"
                            value={vehicle.capacity || ""}
                            onChange={(e) =>
                              handleUpdateVehicle(index, {
                                capacity: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVehicle(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddVehicle}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stops</CardTitle>
                <CardDescription>
                  Add pickup and delivery locations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            value={stop.address}
                            onChange={(e) =>
                              handleUpdateStop(index, { address: e.target.value })
                            }
                            placeholder="Enter address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={stop.type}
                            onChange={(e) =>
                              handleUpdateStop(index, {
                                type: e.target.value as "pickup" | "delivery"
                              })
                            }
                          >
                            <option value="pickup">Pickup</option>
                            <option value="delivery">Delivery</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Duration (min)</Label>
                          <Input
                            type="number"
                            value={stop.duration}
                            onChange={(e) =>
                              handleUpdateStop(index, {
                                duration: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={stop.priority || "medium"}
                            onChange={(e) =>
                              handleUpdateStop(index, {
                                priority: e.target.value as "high" | "medium" | "low"
                              })
                            }
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Load</Label>
                          <Input
                            type="number"
                            value={stop.load || ""}
                            onChange={(e) =>
                              handleUpdateStop(index, {
                                load: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStop(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddStop}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stop
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Constraints</CardTitle>
                <CardDescription>
                  Set constraints for route optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Optimization Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name for this optimization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <DatePicker date={date} setDate={setDate} />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Max Stops per Vehicle</Label>
                    <Input
                      type="number"
                      value={constraints.maxStops || ""}
                      onChange={(e) =>
                        setConstraints({
                          ...constraints,
                          maxStops: parseInt(e.target.value)
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Distance (km)</Label>
                    <Input
                      type="number"
                      value={constraints.maxDistance || ""}
                      onChange={(e) =>
                        setConstraints({
                          ...constraints,
                          maxDistance: parseInt(e.target.value)
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={constraints.requireReturn}
                      onCheckedChange={(checked) =>
                        setConstraints({ ...constraints, requireReturn: checked })
                      }
                    />
                    <Label>Require return to start location</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={constraints.avoidTolls}
                      onCheckedChange={(checked) =>
                        setConstraints({ ...constraints, avoidTolls: checked })
                      }
                    />
                    <Label>Avoid toll roads</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={constraints.avoidHighways}
                      onCheckedChange={(checked) =>
                        setConstraints({ ...constraints, avoidHighways: checked })
                      }
                    />
                    <Label>Avoid highways</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing || !vehicles.length || !stops.length}
              >
                {isOptimizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isOptimizing ? "Optimizing..." : "Optimize Routes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 