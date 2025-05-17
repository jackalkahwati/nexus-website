import { NextResponse } from 'next/server'

export type ApiResponse<T = any> = {
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({
    data,
    message,
    error: null
  })
}

export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json(
    {
      error,
      data: null
    },
    { status }
  )
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

export function notFoundResponse(resource: string = 'Resource') {
  return errorResponse(`${resource} not found`, 404)
}

export function serverErrorResponse(error: unknown) {
  console.error('Server error:', error)
  return errorResponse('Internal server error', 500)
}

export function validateRequiredFields(data: Record<string, any>, fields: string[]) {
  const missingFields = fields.filter(field => !data[field])
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
} 