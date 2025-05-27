import { useState, useCallback } from 'react'
import { DatabaseConfig, DatabaseInfo } from '@/types/integration'

interface DatabaseState {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  info: DatabaseInfo | null
}

interface UseDatabaseReturn extends DatabaseState {
  testConnection: (config: DatabaseConfig) => Promise<void>
  getDatabaseInfo: (config: DatabaseConfig) => Promise<void>
  executeQuery: (config: DatabaseConfig, query: string, values?: unknown[]) => Promise<unknown>
  resetState: () => void
}

interface ApiResponse<T> {
  success: boolean
  error?: string
  data?: T
}

export function useDatabase(): UseDatabaseReturn {
  const [state, setState] = useState<DatabaseState>({
    isConnected: false,
    isLoading: false,
    error: null,
    info: null,
  })

  const resetState = useCallback(() => {
    setState({
      isConnected: false,
      isLoading: false,
      error: null,
      info: null,
    })
  }, [])

  const testConnection = useCallback(async (config: DatabaseConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/integrations/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      const data: ApiResponse<void> = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Connection test failed')
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      }))
      throw error
    }
  }, [])

  const getDatabaseInfo = useCallback(async (config: DatabaseConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const configStr = encodeURIComponent(JSON.stringify(config))
      const response = await fetch(`/api/integrations/database?config=${configStr}`)
      const data: ApiResponse<DatabaseInfo> = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to get database info')
      }

      setState(prev => ({
        ...prev,
        info: data.data || null,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        info: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get database info',
      }))
      throw error
    }
  }, [])

  const executeQuery = useCallback(async (
    config: DatabaseConfig,
    query: string,
    values: unknown[] = []
  ): Promise<unknown> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/integrations/database', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config, query, values }),
      })

      const data: ApiResponse<unknown> = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Query execution failed')
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }))

      return data.data
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Query execution failed',
      }))
      throw error
    }
  }, [])

  return {
    ...state,
    testConnection,
    getDatabaseInfo,
    executeQuery,
    resetState,
  }
} 