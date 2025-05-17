"use client"

import * as React from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from "@/lib/cn"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface Coordinates {
  lng: number
  lat: number
}

interface Stop {
  id: string
  coordinates: Coordinates
  address: string
  type: "pickup" | "delivery"
  status: "pending" | "completed" | "delayed"
  time?: string
}

interface RouteMapProps extends React.HTMLAttributes<HTMLDivElement> {
  stops?: Stop[]
  selectedRouteId?: string
  onStopClick?: (stop: Stop) => void
  className?: string
}

export function RouteMap({ 
  stops = [], 
  selectedRouteId,
  onStopClick,
  className,
  ...props 
}: RouteMapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)
  const [lng] = React.useState(144.9631)
  const [lat] = React.useState(-37.8136)
  const [zoom] = React.useState(12)

  // Initialize map
  React.useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 45,
      bearing: -17.6
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    // Add route layer on load
    map.current.on('load', () => {
      if (!map.current) return

      // Add source for route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: stops.map(stop => [
              stop.coordinates.lng,
              stop.coordinates.lat
            ])
          }
        }
      })

      // Add route line layer
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      })

      // Add turn radius layer
      map.current.addLayer({
        id: 'routePoints',
        type: 'circle',
        source: 'route',
        paint: {
          'circle-radius': 6,
          'circle-color': '#3b82f6',
          'circle-opacity': 0.8
        }
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [lng, lat, zoom])

  // Update markers when stops change
  React.useEffect(() => {
    if (!map.current) return

    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker')
    while (markers[0]) {
      markers[0].remove()
    }

    // Add markers for each stop
    stops.forEach((stop, index) => {
      // Create marker element
      const el = document.createElement('div')
      el.className = 'marker'
      el.style.backgroundColor = stop.type === 'pickup' ? '#22c55e' : '#3b82f6'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.border = '3px solid white'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
      el.style.cursor = 'pointer'
      el.innerHTML = `<span style="
        color: white;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      ">${index + 1}</span>`

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <div style="font-weight: 500;">${stop.address}</div>
          <div style="color: #666; font-size: 12px; margin-top: 4px;">
            ${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
            ${stop.time ? `<br>${stop.time}` : ''}
          </div>
        </div>
      `)

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Add click handler
      el.addEventListener('click', () => {
        onStopClick?.(stop)
      })
    })

    // Fit bounds to include all stops
    if (stops.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      stops.forEach(stop => {
        bounds.extend([stop.coordinates.lng, stop.coordinates.lat])
      })
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      })
    }
  }, [stops, onStopClick])

  return (
    <div 
      ref={mapContainer} 
      className={cn("w-full h-[600px] rounded-lg", className)} 
      {...props} 
    />
  )
} 