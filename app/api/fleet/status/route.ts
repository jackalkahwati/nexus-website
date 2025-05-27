import { NextResponse } from 'next/server'

export async function GET() {
  // Demo data
  const fleetStatus = {
    active: 18,
    parked: 4,
    maintenance: 2,
    activeChange: 2,
    parkedChange: -1,
    maintenanceChange: 0
  }

  return NextResponse.json(fleetStatus)
} 