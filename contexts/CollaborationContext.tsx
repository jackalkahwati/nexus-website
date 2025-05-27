'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { logger } from "lib/logging/logger"

type CollaborationStatus = 'connected' | 'disconnected' | 'reconnecting'

interface CollaborationContextType {
  status: CollaborationStatus
  activeUsers: number
}

const CollaborationContext = createContext<CollaborationContextType>({
  status: 'disconnected',
  activeUsers: 0
})

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CollaborationStatus>('disconnected')
  const [activeUsers, setActiveUsers] = useState(0)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    const connectSSE = () => {
      try {
        const sse = new EventSource('/api/collaboration/stream')

        sse.onopen = () => {
          setStatus('connected')
          logger.info('Connected to collaboration server')
        }

        sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'presence') {
              setActiveUsers(data.activeUsers)
            }
          } catch (error) {
            logger.error('Error parsing collaboration message', { error })
          }
        }

        sse.onerror = () => {
          setStatus('reconnecting')
          sse.close()
          setTimeout(connectSSE, 5000)
        }

        setEventSource(sse)
      } catch (error) {
        logger.error('Error establishing collaboration connection', { error })
        setStatus('disconnected')
      }
    }

    connectSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  return (
    <CollaborationContext.Provider value={{ status, activeUsers }}>
      {children}
    </CollaborationContext.Provider>
  )
}

export const useCollaboration = () => useContext(CollaborationContext)
