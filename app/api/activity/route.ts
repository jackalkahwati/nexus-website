import { NextResponse } from 'next/server'

export async function GET() {
  // Demo activity data
  const activityData = {
    activities: [
      {
        id: '1',
        type: 'vehicle_status',
        title: 'Vehicle Status Update',
        description: 'Vehicle LT-2023-45 is now active and on route',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'maintenance',
        title: 'Maintenance Completed',
        description: 'Scheduled maintenance completed for Vehicle LT-2023-32',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        type: 'route',
        title: 'Route Optimized',
        description: 'Downtown delivery routes optimized for 6 vehicles',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        status: 'info'
      },
      {
        id: '4',
        type: 'alert',
        title: 'Battery Alert',
        description: 'Low battery warning for Vehicle LT-2023-28',
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        status: 'warning'
      },
      {
        id: '5',
        type: 'system',
        title: 'System Update',
        description: 'Fleet management system updated to version 2.4.0',
        timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        status: 'info'
      }
    ],
    summary: {
      total: 5,
      success: 2,
      warning: 1,
      info: 2
    }
  }

  return NextResponse.json(activityData)
} 