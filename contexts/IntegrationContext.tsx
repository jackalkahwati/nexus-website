"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface Integration {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  config?: Record<string, any>
  lastSync?: Date
  error?: string
}

interface IntegrationContextType {
  integrations: Integration[]
  isLoading: boolean
  error: string | null
  connectIntegration: (type: string, config: Record<string, any>) => Promise<void>
  disconnectIntegration: (id: string) => Promise<void>
  syncIntegration: (id: string) => Promise<void>
  getIntegrationStatus: (id: string) => Integration | undefined
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined)

export function IntegrationProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectIntegration = useCallback(async (type: string, config: Record<string, any>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Here you would typically make an API call to connect the integration
      // For example:
      // const response = await fetch('/api/integrations', {
      //   method: 'POST',
      //   body: JSON.stringify({ type, config })
      // })
      // const data = await response.json()
      
      const newIntegration: Integration = {
        id: Date.now().toString(),
        name: type,
        type,
        status: 'connected',
        config,
        lastSync: new Date()
      }

      setIntegrations(prev => [...prev, newIntegration])
      console.log('Integration connected:', newIntegration)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect integration')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnectIntegration = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Here you would typically make an API call to disconnect the integration
      // await fetch(`/api/integrations/${id}`, { method: 'DELETE' })

      setIntegrations(prev => prev.filter(integration => integration.id !== id))
      console.log('Integration disconnected:', id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect integration')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const syncIntegration = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Here you would typically make an API call to sync the integration
      // await fetch(`/api/integrations/${id}/sync`, { method: 'POST' })

      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === id
            ? { ...integration, lastSync: new Date(), status: 'connected' }
            : integration
        )
      )
      console.log('Integration synced:', id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync integration')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getIntegrationStatus = useCallback(
    (id: string) => integrations.find(integration => integration.id === id),
    [integrations]
  )

  return (
    <IntegrationContext.Provider
      value={{
        integrations,
        isLoading,
        error,
        connectIntegration,
        disconnectIntegration,
        syncIntegration,
        getIntegrationStatus
      }}
    >
      {children}
    </IntegrationContext.Provider>
  )
}

export function useIntegration() {
  const context = useContext(IntegrationContext)
  if (context === undefined) {
    throw new Error('useIntegration must be used within an IntegrationProvider')
  }
  return context
} 