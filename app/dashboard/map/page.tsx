"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Layers,
  Mountain,
  MapPin,
  Truck,
  Box,
  Search,
  Eye,
  Settings,
  Plus
} from "lucide-react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from "@/lib/cn"

// Note: Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapControls {
  show3D: boolean
  showTraffic: boolean
  showGeofences: boolean
  showVehicles: boolean
  showPOIs: boolean
}

export default function MapPage() {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)
  const [controls, setControls] = React.useState<MapControls>({
    show3D: false,
    showTraffic: true,
    showGeofences: true,
    showVehicles: true,
    showPOIs: false
  })

  React.useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136],
      zoom: 13,
      pitch: controls.show3D ? 45 : 0,
      bearing: controls.show3D ? -17.6 : 0
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    map.current.on('load', () => {
      if (!map.current) return

      // Add 3D building layer
      const layers = map.current.getStyle().layers
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id

      if (controls.show3D) {
        map.current.addLayer(
          {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        )
      }

      // Add traffic layer
      if (controls.showTraffic) {
        map.current.addLayer({
          'id': 'traffic',
          'type': 'line',
          'source': {
            'type': 'vector',
            'url': 'mapbox://mapbox.mapbox-traffic-v1'
          },
          'source-layer': 'traffic',
          'paint': {
            'line-width': 2,
            'line-color': [
              'match',
              ['get', 'congestion'],
              'low', '#4CAF50',
              'moderate', '#FFD700',
              'heavy', '#FF5252',
              'severe', '#B71C1C',
              '#4CAF50'
            ]
          }
        })
      }

      // Add example vehicles
      if (controls.showVehicles) {
        const vehicles = [
          { lng: 144.9631, lat: -37.8136, id: 'vehicle-1' },
          { lng: 144.9731, lat: -37.8036, id: 'vehicle-2' },
          { lng: 144.9531, lat: -37.8236, id: 'vehicle-3' },
        ]

        vehicles.forEach((vehicle) => {
          const el = document.createElement('div')
          el.className = 'vehicle-marker'
          el.style.backgroundColor = '#3b82f6'
          el.style.width = '20px'
          el.style.height = '20px'
          el.style.borderRadius = '50%'
          el.style.border = '3px solid white'
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'

          new mapboxgl.Marker(el)
            .setLngLat([vehicle.lng, vehicle.lat])
            .addTo(map.current!)
        })
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [controls])

  const toggleControl = (key: keyof MapControls) => {
    setControls(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Map</h1>
          <p className="text-muted-foreground">
            Interactive map with real-time tracking and 3D visualization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Map Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add POI
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Sidebar */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Map Controls</CardTitle>
            <CardDescription>Customize map view and layers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>3D Buildings</Label>
                  <p className="text-sm text-muted-foreground">
                    Show building heights
                  </p>
                </div>
                <Switch
                  checked={controls.show3D}
                  onCheckedChange={() => toggleControl('show3D')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Traffic Layer</Label>
                  <p className="text-sm text-muted-foreground">
                    Show traffic conditions
                  </p>
                </div>
                <Switch
                  checked={controls.showTraffic}
                  onCheckedChange={() => toggleControl('showTraffic')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Geofences</Label>
                  <p className="text-sm text-muted-foreground">
                    Show zones and boundaries
                  </p>
                </div>
                <Switch
                  checked={controls.showGeofences}
                  onCheckedChange={() => toggleControl('showGeofences')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vehicles</Label>
                  <p className="text-sm text-muted-foreground">
                    Show vehicle locations
                  </p>
                </div>
                <Switch
                  checked={controls.showVehicles}
                  onCheckedChange={() => toggleControl('showVehicles')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Points of Interest</Label>
                  <p className="text-sm text-muted-foreground">
                    Show custom POIs
                  </p>
                </div>
                <Switch
                  checked={controls.showPOIs}
                  onCheckedChange={() => toggleControl('showPOIs')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Search Location</Label>
              <Input
                placeholder="Search address or place..."
                startIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="md:col-span-9 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={mapContainer} 
                className="w-full h-[700px] rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 