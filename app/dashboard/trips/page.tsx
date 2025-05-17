"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { env } from "@/config/env"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/cn"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  MapPin,
  Route,
  Timer,
  User,
  Bike,
  ArrowUpDown
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import type { Trip } from "@/types"

// Sample data - replace with real data from your backend
const sampleTrips: Trip[] = [
  {
    id: 1,
    user: "John Doe",
    scooter: "Bike 001",
    distance: "2.5 km",
    duration: "15 min",
    start: "Downtown SF",
    end: "Market Street",
    route: [
      [-122.4194, 37.7749],
      [-122.4184, 37.7746],
      [-122.4174, 37.7744],
      [-122.4164, 37.7742],
      [-122.4154, 37.7740]
    ]
  },
  {
    id: 2,
    user: "Alice Smith",
    scooter: "Bike 002",
    distance: "3.2 km",
    duration: "20 min",
    start: "Mission District",
    end: "SoMa",
    route: [
      [-122.4194, 37.7649],
      [-122.4184, 37.7646],
      [-122.4174, 37.7644],
      [-122.4164, 37.7642],
      [-122.4154, 37.7640]
    ]
  },
  // Add more sample trips as needed
]

export default function TripsPage() {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)
  const [date, setDate] = React.useState<Date>()
  const [selectedTrip, setSelectedTrip] = React.useState<Trip | null>(null)
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Trip,
    direction: 'asc' | 'desc'
  } | null>(null)
  const [trips, setTrips] = React.useState(sampleTrips)

  // Initialize map
  React.useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    if (!env.mapbox.token) {
      console.error("Mapbox token is missing")
      return
    }

    try {
      mapboxgl.accessToken = env.mapbox.token

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: env.mapbox.style,
        center: [-122.4194, 37.7749],
        zoom: 12,
      })

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.current = newMap

      return () => {
        newMap.remove()
        map.current = null
      }
    } catch (err) {
      console.error('Failed to initialize map:', err)
    }
  }, [])

  // Update map when a trip is selected
  React.useEffect(() => {
    const currentMap = map.current
    if (!currentMap || !selectedTrip) return

    try {
      // Clear existing layers
      if (currentMap.getLayer('route')) {
        currentMap.removeLayer('route')
      }
      if (currentMap.getLayer('points')) {
        currentMap.removeLayer('points')
      }
      if (currentMap.getSource('route')) {
        currentMap.removeSource('route')
      }
      if (currentMap.getSource('points')) {
        currentMap.removeSource('points')
      }

      // Add the route line
      currentMap.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: selectedTrip.route
          }
        }
      })

      currentMap.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3B82F6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      })

      // Add start and end points
      currentMap.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { point_type: 'start' },
              geometry: {
                type: 'Point',
                coordinates: selectedTrip.route[0]
              }
            },
            {
              type: 'Feature',
              properties: { point_type: 'end' },
              geometry: {
                type: 'Point',
                coordinates: selectedTrip.route[selectedTrip.route.length - 1]
              }
            }
          ]
        }
      })

      currentMap.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'point_type'],
            'start', '#10B981',
            'end', '#EF4444',
            '#000000'
          ]
        }
      })

      // Fit bounds to show the entire route
      const bounds = new mapboxgl.LngLatBounds()
      selectedTrip.route.forEach(coord => bounds.extend(coord as [number, number]))
      currentMap.fitBounds(bounds, { padding: 50 })

    } catch (err) {
      console.error('Failed to update map:', err)
    }
  }, [selectedTrip])

  const handleSort = (key: keyof Trip) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })

    const sortedTrips = [...trips].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setTrips(sortedTrips)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trip Explorer</h1>
          <p className="text-muted-foreground">
            View and analyze trip data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-15">0-15 minutes</SelectItem>
                      <SelectItem value="15-30">15-30 minutes</SelectItem>
                      <SelectItem value="30+">30+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 km</SelectItem>
                      <SelectItem value="2-5">2-5 km</SelectItem>
                      <SelectItem value="5+">5+ km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Map */}
        <Card className="md:row-span-2">
          <div 
            ref={mapContainer} 
            className="h-[600px] w-full rounded-md"
          />
        </Card>

        {/* Trip List */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('user')}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('duration')}
                    >
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-2" />
                        Duration
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('distance')}
                    >
                      <div className="flex items-center">
                        <Route className="h-4 w-4 mr-2" />
                        Distance
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr 
                      key={trip.id}
                      className={cn(
                        "border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedTrip?.id === trip.id && "bg-muted"
                      )}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <td className="px-4 py-2">{trip.user}</td>
                      <td className="px-4 py-2">{trip.duration}</td>
                      <td className="px-4 py-2">{trip.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Trip Details */}
        <Card className="p-4">
          {selectedTrip ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Trip Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="font-medium">{selectedTrip.user}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vehicle</Label>
                  <p className="font-medium">{selectedTrip.scooter}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Location</Label>
                  <p className="font-medium">{selectedTrip.start}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Location</Label>
                  <p className="font-medium">{selectedTrip.end}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Duration</Label>
                  <p className="font-medium">{selectedTrip.duration}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Distance</Label>
                  <p className="font-medium">{selectedTrip.distance}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Select a trip to view details
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 