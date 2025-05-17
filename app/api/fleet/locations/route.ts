import { NextResponse } from 'next/server'

export async function GET() {
  // Demo location data
  const locations = [
    {
      id: 'v1',
      name: 'Truck 001',
      status: 'active',
      lat: 37.7749,
      lng: -122.4194,
      lastUpdate: new Date().toISOString(),
      speed: 35,
      heading: 90,
      driver: 'John Smith'
    },
    {
      id: 'v2',
      name: 'Truck 002',
      status: 'parked',
      lat: 37.7858,
      lng: -122.4008,
      lastUpdate: new Date().toISOString(),
      speed: 0,
      heading: 180,
      driver: 'Sarah Johnson'
    },
    {
      id: 'v3',
      name: 'Truck 003',
      status: 'maintenance',
      lat: 37.7694,
      lng: -122.4862,
      lastUpdate: new Date().toISOString(),
      speed: 0,
      heading: 0,
      driver: 'Mike Wilson'
    }
  ]

  return NextResponse.json(locations)
} 