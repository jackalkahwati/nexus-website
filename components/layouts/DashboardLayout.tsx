"use client"

import * as React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation/Navigation"
import { UserMenu } from "@/components/header/UserMenu"
import { NotificationsMenu } from "@/components/header/NotificationsMenu"
import { SearchCommand } from "@/components/header/SearchCommand"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { useAuth } from "@/app/client-layout"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  const handleSidebarToggle = React.useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found in DashboardLayout, redirecting to login")
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <NotificationProvider>
      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "w-[60px]" : "w-[240px]"
          )}
        >
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center border-b px-4",
            isSidebarCollapsed ? "justify-center" : "justify-start"
          )}>
            <div className={cn(
              "flex items-center transition-all duration-300",
              isSidebarCollapsed ? "flex-col gap-0" : "flex-row gap-2"
            )}>
              <span className={cn(
                "font-bold tracking-tight transition-all duration-300",
                isSidebarCollapsed ? "text-base" : "text-xl"
              )}>
                Lattis
              </span>
              <span className={cn(
                "text-muted-foreground transition-all duration-300",
                isSidebarCollapsed ? "text-[10px]" : "text-sm"
              )}>
                Nexus
              </span>
            </div>
          </div>

          {/* Navigation */}
          <Navigation isCollapsed={isSidebarCollapsed} />

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-sm hover:bg-accent",
              "transition-transform duration-300",
              isSidebarCollapsed && "rotate-180"
            )}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">
              {isSidebarCollapsed ? "Expand" : "Collapse"} Sidebar
            </span>
          </Button>
        </aside>
      
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center space-x-4 flex-1">
              <SearchCommand />
              <Breadcrumb />
            </div>
            
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <NotificationsMenu />
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-hidden px-8 pb-8 pt-4",
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "pl-[76px]" : "pl-[256px]"
          )}>
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
}
