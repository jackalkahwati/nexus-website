import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input.replace(/[<>'"]/g, '')
}

/**
 * Validates and sanitizes an email address
 */
export function sanitizeEmail(email: string): string {
  const emailSchema = z.string().email()
  return emailSchema.parse(email.toLowerCase().trim())
}

/**
 * Validates and sanitizes a username
 */
export function sanitizeUsername(username: string): string {
  const usernameSchema = z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
  return usernameSchema.parse(username.trim())
}

/**
 * Sanitizes an object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

/**
 * Validates and sanitizes a URL
 */
export function sanitizeUrl(url: string): string {
  const urlSchema = z.string().url()
  const sanitized = urlSchema.parse(url.trim())
  
  // Only allow http and https protocols
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    throw new Error('Invalid URL protocol')
  }
  
  return sanitized
}

/**
 * Sanitizes SQL queries to prevent SQL injection
 * Note: This is a basic implementation. Use parameterized queries when possible.
 */
export function sanitizeSql(query: string): string {
  return query.replace(/['";\\]/g, '')
}

/**
 * Validates and sanitizes a file name
 */
export function sanitizeFileName(fileName: string): string {
  const fileNameSchema = z.string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9_.-]+$/)
  return fileNameSchema.parse(fileName.trim())
}

/**
 * Validates and sanitizes a phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  const phoneSchema = z.string()
    .regex(/^\+?[1-9]\d{1,14}$/)
  return phoneSchema.parse(phone.replace(/\D/g, ''))
}

/**
 * Validates and sanitizes JSON input
 */
export function sanitizeJson(input: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(input)
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid JSON input: must be an object')
    }
    return sanitizeObject(parsed as Record<string, unknown>)
  } catch (error) {
    throw new Error('Invalid JSON input')
  }
}

/**
 * Creates a type-safe validator and sanitizer using Zod
 */
export function createValidator<T>(schema: z.ZodType<T>) {
  return (input: unknown): T => {
    const validated = schema.parse(input)
    if (validated && typeof validated === 'object' && !Array.isArray(validated)) {
      return sanitizeObject(validated as Record<string, unknown>) as T
    }
    return validated
  }
} 