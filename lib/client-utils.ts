"use client"

import { customAlphabet } from 'nanoid'

// Generate a secure random password
export function generatePassword(length: number = 12): string {
  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*',
    length
  )
  return nanoid()
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
) {
  // Convert data to CSV format
  const headerRow = headers 
    ? Object.values(headers).join(',')
    : Object.keys(data[0]).join(',')

  const rows = data.map(item => 
    Object.values(item)
      .map(value => `"${value}"`)
      .join(',')
  )

  const csv = [headerRow, ...rows].join('\n')
  
  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 