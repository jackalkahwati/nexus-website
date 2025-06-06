"use client"

import { useEffect } from 'react'
import { logger } from '../lib/logging/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Runtime error occurred', { error })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Something went wrong!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            An unexpected error has occurred. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error.message}
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => reset()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
