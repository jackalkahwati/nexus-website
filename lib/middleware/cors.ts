import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface CorsConfig {
  allowedOrigins?: string[]
  allowedMethods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  maxAge?: number
  credentials?: boolean
}

const defaultConfig: CorsConfig = {
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400,
  credentials: true,
}

export async function cors(
  request: NextRequest,
  handler?: () => Promise<NextResponse>,
  config: CorsConfig = {}
): Promise<NextResponse> {
  const mergedConfig = { ...defaultConfig, ...config }
  const origin = request.headers.get('origin') || '*'

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    
    setCorsHeaders(response, origin, mergedConfig)
    return response
  }

  // Handle actual requests
  if (handler) {
    const response = await handler()
    setCorsHeaders(response, origin, mergedConfig)
    return response
  }

  // If no handler provided, just return CORS headers
  const response = new NextResponse(null, { status: 200 })
  setCorsHeaders(response, origin, mergedConfig)
  return response
}

function setCorsHeaders(
  response: NextResponse,
  origin: string,
  config: CorsConfig
): void {
  // Set CORS headers
  if (config.allowedOrigins?.includes('*') || config.allowedOrigins?.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  if (config.allowedMethods) {
    response.headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '))
  }

  if (config.allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
  }

  if (config.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '))
  }

  if (config.maxAge) {
    response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
  }
}

// Export a preconfigured CORS middleware for common use cases
export const corsMiddleware = (handler: () => Promise<NextResponse>) => {
  return (request: NextRequest) => cors(request, handler)
} 