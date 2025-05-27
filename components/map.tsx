"use client"

import * as React from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cn } from "@/lib/cn"

// Note: Replace with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Map({ className, ...props }: MapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<mapboxgl.Map | null>(null)
  const [lng] = React.useState(144.9631)
  const [lat] = React.useState(-37.8136)
  const [zoom] = React.useState(11)

  React.useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    // Add 3D building layer
    map.current.on('load', () => {
      if (!map.current) return

      // Add 3D building layer
      const layers = map.current.getStyle().layers
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id

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

      // Add some example vehicle markers
      const vehicles = [
        { lng: 144.9631, lat: -37.8136, id: 'vehicle-1' },
        { lng: 144.9731, lat: -37.8036, id: 'vehicle-2' },
        { lng: 144.9531, lat: -37.8236, id: 'vehicle-3' },
      ]

      vehicles.forEach((vehicle) => {
        // Create a DOM element for the marker
        const el = document.createElement('div')
        el.className = 'vehicle-marker'
        el.style.backgroundColor = '#3b82f6'
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.border = '3px solid white'
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'

        // Add markers to the map
        new mapboxgl.Marker(el)
          .setLngLat([vehicle.lng, vehicle.lat])
          .addTo(map.current)
      })
    })

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [lng, lat, zoom])

  return (
    <div ref={mapContainer} className={cn("w-full h-full min-h-[400px]", className)} {...props} />
  )
} 