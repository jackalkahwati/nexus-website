"use client"

import { ReactNode, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { hasPermission, hasAnyPermission } from "@/lib/auth"
import { useAuthSync } from "@/hooks/use-auth-sync"

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredPermissions?: string[]
  requiredRole?: string
  fallbackUrl?: string
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
  fallbackUrl = "/login"
}: ProtectedRouteProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // Sync NextAuth with local auth
  useAuthSync()

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (status === "loading") return
    
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(fallbackUrl)
      return
    }
    
    // If authenticated, but role check fails
    if (requiredRole && session?.user?.role !== requiredRole) {
      console.log("Access denied: incorrect role", {
        required: requiredRole,
        user: session?.user?.role
      })
      router.push(fallbackUrl)
      return
    }
    
    // If authenticated, but permission check fails
    if (requiredPermission && !hasPermission(session?.user?.permissions || [], requiredPermission)) {
      console.log("Access denied: missing required permission", {
        required: requiredPermission,
        user: session?.user?.permissions
      })
      router.push(fallbackUrl)
      return
    }
    
    // If authenticated, but lacks any of the required permissions
    if (requiredPermissions?.length && !hasAnyPermission(session?.user?.permissions || [], requiredPermissions)) {
      console.log("Access denied: missing any required permissions", {
        required: requiredPermissions,
        user: session?.user?.permissions
      })
      router.push(fallbackUrl)
      return
    }
  }, [
    status, 
    session, 
    router, 
    requiredPermission, 
    requiredPermissions, 
    requiredRole, 
    fallbackUrl
  ])

  // Show nothing while loading or if access check fails
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }
  
  // If authenticated and passed all permission checks, render children
  return <>{children}</>
}