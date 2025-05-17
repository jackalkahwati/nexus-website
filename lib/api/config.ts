export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || window.location.origin

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = new URL(endpoint, API_BASE_URL)
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
} 