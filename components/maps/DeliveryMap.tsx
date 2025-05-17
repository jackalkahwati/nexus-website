import React, { useEffect, useCallback, useRef, useState } from 'react'
import {
  Map,
  // Marker,
  // Popup,
  // NavigationControl,
  // FullscreenControl,
  // ScaleControl,
  // GeolocateControl,
  // MapRef
} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Navigation, Clock, Package } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from "@/lib/cn"

// Custom map styles with better contrast
const MAP_STYLES = {
  light: {
    default: 'mapbox://styles/mapbox/streets-v12',
    navigation: 'mapbox://styles/mapbox/navigation-day-v1',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
  },
  dark: {
    default: 'mapbox://styles/mapbox/dark-v11',
    navigation: 'mapbox://styles/mapbox/navigation-night-v1',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
  }
} as const

interface Delivery {
  id: string
  orderId: string
  address: string
  coordinates: [number, number]
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'failed'
  priority: 'normal' | 'high' | 'urgent'
  estimatedTime: string
  actualTime?: string
  driver: string
  customer: string
  items: number
  distance: number
  notes?: string
}

interface DeliveryMapProps {
  deliveries: Delivery[]
  selectedDelivery: Delivery | null
  onSelectDelivery: (delivery: Delivery | null) => void
  showNavigation?: boolean
}

export function DeliveryMap({ 
  deliveries, 
  selectedDelivery, 
  onSelectDelivery,
  showNavigation = false 
}: DeliveryMapProps) {
  const mapRef = React.useRef<MapRef>(null)
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme()
  const [mapKey, setMapKey] = React.useState(Date.now())
  const [isMapLoaded, setIsMapLoaded] = React.useState(false)
  const [viewport, setViewport] = React.useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12
  })

  // Debug theme state
  useEffect(() => {
    console.log('Theme State:', {
      theme,
      systemTheme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      htmlClass: document.documentElement.classList.contains('dark'),
      timestamp: new Date().toISOString()
    })
  }, [theme, systemTheme, resolvedTheme])

  // Force map reload when theme changes
  useEffect(() => {
    const newKey = Date.now()
    console.log('Forcing map reload:', { newKey, oldKey: mapKey })
    setMapKey(newKey)
    
    // Reset map when theme changes
    if (mapRef.current && isMapLoaded) {
      mapRef.current.resize()
    }
  }, [resolvedTheme])

  // Handle map load
  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true)
    console.log('Map loaded:', { mapKey, theme: resolvedTheme })
  }, [mapKey, resolvedTheme])

  // Choose map style based on theme and navigation needs
  const mapStyle = React.useMemo(() => {
    const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme) || 'light'
    const isDark = currentTheme === 'dark'
    const styleSet = isDark ? MAP_STYLES.dark : MAP_STYLES.light
    const selectedStyle = showNavigation ? styleSet.navigation : styleSet.default
    
    // Add cache-busting parameter
    const cacheBust = `?v=${mapKey}`
    const finalStyle = `${selectedStyle}${cacheBust}`
    
    console.log('Map style selected:', {
      currentTheme,
      isDark,
      selectedStyle,
      finalStyle
    })
    
    return finalStyle
  }, [theme, systemTheme, resolvedTheme, showNavigation, mapKey])

  const getMarkerColor = (status: Delivery['status'], isDark = false) => {
    const baseColors = {
      completed: isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500',
      in_progress: isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500',
      pending: isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-500',
      delayed: isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-500',
      failed: isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-500'
    }
    return baseColors[status] || (isDark ? 'text-gray-400' : 'text-gray-600')
  }

  const getStatusBadgeColor = (status: Delivery['status'], isDark = false) => {
    const baseColors = {
      completed: isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      in_progress: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700',
      pending: isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700',
      delayed: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700',
      failed: isDark ? 'bg-rose-900/50 text-rose-300' : 'bg-rose-100 text-rose-700'
    }
    return baseColors[status] || (isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')
  }

  const getPriorityScale = (priority: Delivery['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'scale-125'
      case 'high':
        return 'scale-110'
      default:
        return 'scale-100'
    }
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[500px] rounded-lg overflow-hidden transition-colors duration-150",
        "border dark:border-gray-800",
        "bg-white dark:bg-gray-950",
        "shadow-sm dark:shadow-none"
      )}
      data-theme={resolvedTheme}
    >
      <Map
        ref={mapRef}
        key={mapKey}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        onMove={evt => setViewport(evt.viewState)}
        onLoad={onMapLoad}
        attributionControl={false}
        reuseMaps={false}
        renderWorldCopies={false}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        fog={{
          range: [0.8, 8],
          color: resolvedTheme === 'dark' ? '#000' : '#fff',
          'horizon-blend': 0.5
        }}
      >
        {/* Map Controls */}
        <div className="absolute top-2 right-2 space-y-2">
          <NavigationControl visualizePitch={true} showCompass={true} />
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
          />
          <FullscreenControl />
        </div>
        <ScaleControl position="bottom-right" />

        {/* Delivery Markers */}
        {deliveries.map((delivery) => (
          <Marker
            key={delivery.id}
            latitude={delivery.coordinates[1]}
            longitude={delivery.coordinates[0]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation()
              onSelectDelivery(delivery)
            }}
          >
            <div 
              className={cn(
                "transition-all duration-300 hover:scale-125 cursor-pointer relative",
                getPriorityScale(delivery.priority),
                selectedDelivery?.id === delivery.id ? 'scale-125 animate-bounce' : ''
              )}
              role="button"
              aria-label={`Delivery ${delivery.orderId} - ${delivery.status}`}
            >
              <MapPin 
                className={cn(
                  "h-6 w-6",
                  getMarkerColor(delivery.status, resolvedTheme === 'dark'),
                  "filter drop-shadow-lg",
                  "dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]",
                  "transition-colors duration-150"
                )}
              />
              {delivery.priority === 'urgent' && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
          </Marker>
        ))}

        {/* Delivery Popup */}
        {selectedDelivery && (
          <Popup
            latitude={selectedDelivery.coordinates[1]}
            longitude={selectedDelivery.coordinates[0]}
            anchor="bottom"
            onClose={() => onSelectDelivery(null)}
            closeButton={true}
            closeOnClick={false}
            className={cn(
              "delivery-popup",
              "!bg-white dark:!bg-gray-900",
              "!rounded-lg",
              "!shadow-lg dark:!shadow-2xl",
              "transition-colors duration-150"
            )}
            maxWidth="300px"
          >
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                  {selectedDelivery.orderId}
                </h3>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium transition-colors duration-150",
                  getStatusBadgeColor(selectedDelivery.status, resolvedTheme === 'dark')
                )}>
                  {selectedDelivery.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{selectedDelivery.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 shrink-0" />
                  <span>{selectedDelivery.distance.toFixed(1)} miles</span>
                </p>
                <p className="flex items-center gap-2">
                  <Package className="h-4 w-4 shrink-0" />
                  <span>{selectedDelivery.items} items</span>
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span>ETA: {new Date(selectedDelivery.estimatedTime).toLocaleTimeString()}</span>
                    {selectedDelivery.actualTime && (
                      <span className="text-xs">
                        Actual: {new Date(selectedDelivery.actualTime).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                <p className="pt-1 border-t dark:border-gray-800">
                  Driver: {selectedDelivery.driver}
                </p>
                {selectedDelivery.notes && (
                  <p className="italic text-gray-500 dark:text-gray-400 pt-1 border-t dark:border-gray-800">
                    Note: {selectedDelivery.notes}
                  </p>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
} 