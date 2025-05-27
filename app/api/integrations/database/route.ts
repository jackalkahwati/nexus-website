import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database'
import { DatabaseConfig } from '@/types/integration'
import { DatabaseError } from '@/lib/db-utils'

// Test database connection
export async function POST(req: NextRequest) {
  try {
    const config: DatabaseConfig = await req.json()
    const dbService = new DatabaseService(config)
    
    await dbService.connect()
    const healthCheck = await dbService.healthCheck()
    await dbService.disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: healthCheck
    })
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Get database information
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const configStr = searchParams.get('config')
    
    if (!configStr) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database configuration is required'
        },
        { status: 400 }
      )
    }

    const config: DatabaseConfig = JSON.parse(decodeURIComponent(configStr))
    const dbService = new DatabaseService(config)
    
    await dbService.connect()
    const info = await dbService.getDatabaseInfo()
    await dbService.disconnect()

    return NextResponse.json({
      success: true,
      data: info
    })
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Execute raw query
export async function PUT(req: NextRequest) {
  try {
    const { config, query, values = [] } = await req.json()
    
    if (!config || !query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database configuration and query are required'
        },
        { status: 400 }
      )
    }

    const dbService = new DatabaseService(config)
    
    await dbService.connect()
    const result = await dbService.queryRaw(query, values)
    await dbService.disconnect()

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 