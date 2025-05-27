"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAuth } from "@/app/client-layout"

/**
 * Custom hook that synchronizes NextAuth session with the local AuthContext
 * This ensures both authentication systems work together seamlessly
 */
export function useAuthSync() {
  const { data: session, status } = useSession()
  const { user, login, logout } = useAuth()

  useEffect(() => {
    // When NextAuth session loads or changes
    if (status === "authenticated" && session?.user) {
      // If we have a NextAuth session but no local auth or different user, sync them
      if (!user || user.id !== session.user.id) {
        // Extract user data from NextAuth session
        const userData = {
          id: session.user.id,
          name: session.user.name || undefined,
          email: session.user.email,
          role: session.user.role as string || undefined
        }
        
        // Update local auth context
        login(userData)
      }
    } else if (status === "unauthenticated" && user) {
      // If NextAuth shows no session but we have a local user, clear it
      logout()
    }
  }, [session, status, user, login, logout])

  return { 
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated" && !!user
  }
}