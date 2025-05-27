import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import crypto from 'crypto'

// CSP Directives
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust based on your needs
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'https://api.stripe.com'], // Add other API endpoints
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
}

// Generate CSP Header
const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ')

// Security Headers
const securityHeaders = {
  'Content-Security-Policy': cspHeader,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}

// Anti-CSRF Token Generation
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Validate CSRF Token
function validateCSRFToken(request: NextRequest): boolean {
  const requestToken = request.headers.get('x-csrf-token')
  const cookieToken = request.cookies.get('csrf-token')?.value

  if (!requestToken || !cookieToken) {
    return false
  }

  return crypto.timingSafeEqual(
    Buffer.from(requestToken),
    Buffer.from(cookieToken)
  )
}

export async function securityMiddleware(
  request: NextRequest,
  response?: NextResponse
) {
  // Create base response if not provided
  const res = response || NextResponse.next()

  // Add Security Headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  // CSRF Protection for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!validateCSRFToken(request)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // Generate new CSRF token for GET requests
  if (request.method === 'GET' && !request.headers.get('x-csrf-token')) {
    const csrfToken = generateCSRFToken()
    res.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })
  }

  // Add security headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    res.headers.set('Cache-Control', 'no-store, max-age=0')
    res.headers.set('Pragma', 'no-cache')
  }

  return res
}

// Export middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/webhooks (webhook endpoints that need raw body)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/webhooks/).*)',
  ],
} 