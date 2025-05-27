import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// Define the security headers
export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'X-XSS-Protection': string;
  'X-DNS-Prefetch-Control': string;
  'Strict-Transport-Security': string;
  'Permissions-Policy': string;
}

// Define CSP directives
export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'frame-ancestors': string[];
  'form-action': string[];
  'base-uri': string[];
  'object-src': string[];
  [key: string]: string[];
}

export class SecurityService {
  private cspDirectives: CSPDirectives;
  private securityHeaders: SecurityHeaders;

  constructor(customCSP?: Partial<CSPDirectives>) {
    // Default CSP directives
    this.cspDirectives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'", 'https://api.stripe.com'],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
    };

    // Merge custom CSP if provided
    if (customCSP) {
      Object.keys(customCSP).forEach((key) => {
        if (customCSP[key as keyof CSPDirectives]) {
          this.cspDirectives[key] = customCSP[key as keyof CSPDirectives]!;
        }
      });
    }

    // Generate CSP header
    const cspHeader = Object.entries(this.cspDirectives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');

    // Define security headers
    this.securityHeaders = {
      'Content-Security-Policy': cspHeader,
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'X-DNS-Prefetch-Control': 'on',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    };
  }

  // Generate a CSRF token
  generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  validateCSRFToken(requestToken?: string, cookieToken?: string): boolean {
    if (!requestToken || !cookieToken) {
      return false;
    }

    try {
      return crypto.timingSafeEqual(
        Buffer.from(requestToken),
        Buffer.from(cookieToken)
      );
    } catch (error) {
      console.error('CSRF validation error:', error);
      return false;
    }
  }

  // Apply security headers and CSRF protection
  applySecurityMiddleware(
    request: NextRequest,
    response?: NextResponse
  ): NextResponse {
    // Create base response if not provided
    const res = response || NextResponse.next();

    // Add Security Headers
    Object.entries(this.securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    // CSRF Protection for mutations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const requestToken = request.headers.get('x-csrf-token');
      const cookieToken = request.cookies.get('csrf-token')?.value;

      if (!this.validateCSRFToken(requestToken || '', cookieToken)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid CSRF token' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate new CSRF token for GET requests
    if (request.method === 'GET' && !request.headers.get('x-csrf-token')) {
      const csrfToken = this.generateCSRFToken();
      res.cookies.set('csrf-token', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }

    // Add security headers for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      res.headers.set('Cache-Control', 'no-store, max-age=0');
      res.headers.set('Pragma', 'no-cache');
    }

    return res;
  }

  // Get the matcher configuration for middleware
  getMatcherConfig() {
    return {
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
    };
  }
}