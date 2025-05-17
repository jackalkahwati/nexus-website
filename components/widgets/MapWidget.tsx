"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from "@/lib/cn"
import { AlertCircle, Loader2 } from "lucide-react"

interface VehicleLocation {
  id: string
  name: string
  status: 'active' | 'parked' | 'maintenance'
  lat: number
  lng: number
  lastUpdate: string
  speed: number
  heading: number
  driver: string
}

interface MapWidgetProps {
  className?: string
}

const MapWidget = ({ className }: MapWidgetProps) => {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)
  const markers = React.useRef<mapboxgl.Marker[]>([])
  const [locations, setLocations] = React.useState<VehicleLocation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch locations
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/fleet/locations')
        if (!response.ok) throw new Error('Failed to fetch locations')
        const data = await response.json()
        setLocations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load locations')
      }
    }

    fetchLocations()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLocations, 30000)
    return () => clearInterval(interval)
  }, [])

  // Initialize map
  React.useEffect(() => {
    if (!mapContainer.current || map.current) return
    
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setError("Mapbox token is missing. Please check your environment configuration.")
      setIsLoading(false)
      return
    }

    try {
      mapboxgl.accessToken = token

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 12,
      })

      newMap.on('load', () => {
        setIsLoading(false)
      })

      newMap.on('error', (e) => {
        setError(e.error.message)
        setIsLoading(false)
      })

      map.current = newMap

      return () => {
        markers.current.forEach(marker => marker.remove())
        newMap.remove()
        map.current = null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      setIsLoading(false)
    }
  }, [])

  // Update markers when locations change
  React.useEffect(() => {
    const currentMap = map.current
    if (!currentMap || error) return

    try {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove())
      markers.current = []

      // Add new markers
      locations.forEach((location) => {
        const markerColor = 
          location.status === 'active' ? '#10B981' : 
          location.status === 'parked' ? '#3B82F6' : '#EF4444'

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm text-gray-600">Driver: ${location.driver}</p>
            <p class="text-sm text-gray-600">Speed: ${location.speed} mph</p>
            <p class="text-sm text-gray-600">Status: ${location.status}</p>
            <p class="text-sm text-gray-600">Last Update: ${new Date(location.lastUpdate).toLocaleTimeString()}</p>
          </div>
        `)

        const marker = new mapboxgl.Marker({
          color: markerColor
        })
          .setLngLat([location.lng, location.lat])
          .setPopup(popup)
          .addTo(currentMap)

        markers.current.push(marker)
      })

      // Fit bounds if there are locations
      if (locations.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        locations.forEach(location => {
          bounds.extend([location.lng, location.lat])
        })
        currentMap.fitBounds(bounds, { padding: 50 })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update markers')
    }
  }, [locations, error])

  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle>Fleet Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className={cn(
            "h-[400px] w-full rounded-md border",
            (isLoading || error) && "opacity-50"
          )}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MapWidget
