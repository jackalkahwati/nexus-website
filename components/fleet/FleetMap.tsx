"use client"

import * as React from 'react'
import { Map } from 'react-map-gl'
import type { Vehicle } from '@/types/fleet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Battery, MapPin } from 'lucide-react'
import { VehicleStatus } from '@/types/fleet';

interface FleetMapProps {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  onVehicleSelect: (vehicle: Vehicle) => void
}

export default function FleetMap({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}: FleetMapProps) {
  const [viewport, setViewport] = React.useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  })

  const [popupInfo, setPopupInfo] = React.useState<Vehicle | null>(null)

  // Update viewport when selected vehicle changes
  React.useEffect(() => {
    if (selectedVehicle) {
      setViewport({
        latitude: selectedVehicle.location.lat,
        longitude: selectedVehicle.location.lng,
        zoom: 14,
      })
      setPopupInfo(selectedVehicle)
    }
  }, [selectedVehicle])

  const getStatusColor = (status: VehicleStatus): string => {
    if (status === VehicleStatus.ACTIVE) return 'bg-green-500';
    if (status === VehicleStatus.INACTIVE) return 'bg-gray-500';
    if (status === VehicleStatus.MAINTENANCE) return 'bg-yellow-500';
    if (status === VehicleStatus.CHARGING) return 'bg-blue-500';
    return 'bg-red-500'; // Default/Unknown
  }

  return (
    <Map
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          latitude={vehicle.location.lat}
          longitude={vehicle.location.lng}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            setPopupInfo(vehicle)
            onVehicleSelect(vehicle)
          }}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 ${
              selectedVehicle?.id === vehicle.id ? 'ring-2 ring-white ring-opacity-50' : ''
            }`}
            style={{ backgroundColor: getStatusColor(vehicle.status) }}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          latitude={popupInfo.location.lat}
          longitude={popupInfo.location.lng}
          anchor="top"
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          <Card className="w-64">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{popupInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{popupInfo.type}</p>
                </div>
                {popupInfo.status === VehicleStatus.ACTIVE && <Badge variant="default" className={getStatusColor(popupInfo.status)}>Active</Badge>}
                {popupInfo.status === VehicleStatus.INACTIVE && <Badge variant="secondary" className={getStatusColor(popupInfo.status)}>Inactive</Badge>}
                {popupInfo.status === VehicleStatus.MAINTENANCE && <Badge variant="destructive" className={getStatusColor(popupInfo.status)}>Maintenance</Badge>}
                {popupInfo.status === VehicleStatus.CHARGING && <Badge variant="outline" className={getStatusColor(popupInfo.status)}>Charging</Badge>}
                {![VehicleStatus.ACTIVE, VehicleStatus.INACTIVE, VehicleStatus.MAINTENANCE, VehicleStatus.CHARGING].includes(popupInfo.status) && (
                  <Badge className={getStatusColor(popupInfo.status)}>{String(popupInfo.status)}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Battery className="w-4 h-4" />
                <span>{popupInfo.telemetry.batteryLevel}%</span>
                <span className="text-muted-foreground">•</span>
                <span>{popupInfo.telemetry.temperature}°F</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(popupInfo.location.lastUpdated).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </Popup>
      )}
    </Map>
  )
} 