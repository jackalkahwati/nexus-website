import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { 
  generateDemandForecast,
  updateForecastAccuracy,
  getForecastMetrics
} from '@/lib/demand-forecast-utils'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { stationId, startTime, endTime, factors } = body

    if (!stationId || !startTime || !endTime || !factors) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const forecast = await generateDemandForecast(
      stationId,
      new Date(startTime),
      new Date(endTime),
      factors
    )

    return NextResponse.json(forecast)
  } catch (error) {
    console.error('Error generating demand forecast:', error)
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const stationId = searchParams.get('stationId')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    if (!stationId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const metrics = await getForecastMetrics(
      stationId,
      new Date(startTime),
      new Date(endTime)
    )

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error getting forecast metrics:', error)
    return NextResponse.json(
      { error: 'Failed to get metrics' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { stationId, timestamp, actualDemand } = body

    if (!stationId || !timestamp || actualDemand === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedForecast = await updateForecastAccuracy(
      stationId,
      new Date(timestamp),
      actualDemand
    )

    if (!updatedForecast) {
      return NextResponse.json(
        { error: 'No forecast found for the specified time' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedForecast)
  } catch (error) {
    console.error('Error updating forecast accuracy:', error)
    return NextResponse.json(
      { error: 'Failed to update forecast' },
      { status: 500 }
    )
  }
} 