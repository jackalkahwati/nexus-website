"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { OptimizationResult, OptimizedRoute } from "@/types/route-optimization"

const COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEEAD", // Yellow
  "#D4A5A5", // Pink
  "#9B59B6", // Purple
  "#3498DB", // Light Blue
  "#E67E22", // Orange
  "#2ECC71", // Emerald
]

interface OptimizedRouteMapProps {
  result: OptimizationResult
}

export function OptimizedRouteMap({ result }: OptimizedRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>(
    result.routes.map(route => route.vehicleId)
  )

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.4194, 37.7749], // Default to San Francisco
      zoom: 12
    })

    const bounds = new mapboxgl.LngLatBounds()

    // Add routes to map
    result.routes.forEach((route, index) => {
      const color = COLORS[index % COLORS.length]

      // Add route line
      route.segments.forEach(segment => {
        const coordinates = decodePolyline(segment.polyline)
        coordinates.forEach(coord => bounds.extend(coord))

        map.current?.addSource(`route-${route.vehicleId}-${segment.start.lat}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates
            }
          }
        })

        map.current?.addLayer({
          id: `route-${route.vehicleId}-${segment.start.lat}`,
          type: "line",
          source: `route-${route.vehicleId}-${segment.start.lat}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: visibleRoutes.includes(route.vehicleId) ? "visible" : "none"
          },
          paint: {
            "line-color": color,
            "line-width": 4,
            "line-opacity": 0.8
          }
        })
      })

      // Add stop markers
      route.stops.forEach((stop, stopIndex) => {
        bounds.extend([stop.lng, stop.lat])

        const el = document.createElement("div")
        el.className = "marker"
        el.style.backgroundColor = color
        el.style.width = "24px"
        el.style.height = "24px"
        el.style.borderRadius = "12px"
        el.style.border = "2px solid white"
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
        el.style.display = "flex"
        el.style.alignItems = "center"
        el.style.justifyContent = "center"
        el.style.color = "white"
        el.style.fontWeight = "bold"
        el.style.fontSize = "12px"
        el.innerText = (stopIndex + 1).toString()

        new mapboxgl.Marker(el)
          .setLngLat([stop.lng, stop.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <div class="font-bold">${stop.type === "pickup" ? "Pickup" : "Delivery"}</div>
                <div>${stop.address}</div>
                <div class="text-sm text-gray-500">
                  Arrival: ${new Date(stop.arrivalTime).toLocaleTimeString()}
                </div>
              </div>
            `)
          )
          .addTo(map.current!)
      })
    })

    // Fit map to bounds
    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    })

    // Cleanup
    return () => {
      map.current?.remove()
    }
  }, [result, visibleRoutes])

  const toggleRoute = (vehicleId: string) => {
    setVisibleRoutes(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    )

    result.routes
      .find(route => route.vehicleId === vehicleId)
      ?.segments.forEach(segment => {
        const visibility = !visibleRoutes.includes(vehicleId) ? "visible" : "none"
        map.current?.setLayoutProperty(
          `route-${vehicleId}-${segment.start.lat}`,
          "visibility",
          visibility
        )
      })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {result.routes.map((route, index) => (
          <RouteCard
            key={route.vehicleId}
            route={route}
            color={COLORS[index % COLORS.length]}
            isVisible={visibleRoutes.includes(route.vehicleId)}
            onToggleVisibility={() => toggleRoute(route.vehicleId)}
          />
        ))}
      </div>

      <Card className="relative">
        <div
          ref={mapContainer}
          className="w-full h-[600px] rounded-lg overflow-hidden"
        />
      </Card>
    </div>
  )
}

interface RouteCardProps {
  route: OptimizedRoute
  color: string
  isVisible: boolean
  onToggleVisibility: () => void
}

function RouteCard({ route, color, isVisible, onToggleVisibility }: RouteCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-medium">Vehicle {route.vehicleId}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
        >
          {isVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Stops</span>
          <span>{route.metrics.totalStops}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distance</span>
          <span>{(route.metrics.totalDistance / 1000).toFixed(1)} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span>{Math.round(route.metrics.totalDuration / 60)} min</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Utilization</span>
          <span>{Math.round(route.metrics.utilization * 100)}%</span>
        </div>
      </div>
    </Card>
  )
}

// Helper function to decode polyline
function decodePolyline(str: string): [number, number][] {
  const points: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < str.length) {
    let shift = 0
    let result = 0

    do {
      result |= (str.charCodeAt(index) - 63 - 1) << shift
      shift += 5
      index++
    } while (str.charCodeAt(index - 1) >= 0x20)

    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0

    do {
      result |= (str.charCodeAt(index) - 63 - 1) << shift
      shift += 5
      index++
    } while (str.charCodeAt(index - 1) >= 0x20)

    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push([lng / 100000, lat / 100000])
  }

  return points
} 