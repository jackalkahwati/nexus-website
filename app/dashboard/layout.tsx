"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { AnalyticsProvider } from "@/contexts/AnalyticsContext"
import { PaymentProvider } from "@/contexts/PaymentContext"
import { IntegrationProvider } from "@/contexts/IntegrationContext"
import { RouteOptimizationProvider } from "@/contexts/RouteOptimizationContext"
import { Navigation } from "@/components/navigation/Navigation"
import { ChatButton } from "@/components/chat/chat-button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/client-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found in dashboard layout, redirecting to login")
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
      <IntegrationProvider>
        <PaymentProvider>
          <AnalyticsProvider>
            <RouteOptimizationProvider>
              <div className="relative flex min-h-screen">
                {/* Sidebar */}
                <aside
                  className={cn(
                    "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[60px]" : "w-[240px]"
                  )}
                >
                  {/* Logo */}
                  <div className={cn(
                    "flex h-16 items-center border-b px-4",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}>
                    <div className={cn(
                      "flex items-center transition-all duration-300",
                      isCollapsed ? "flex-col gap-0" : "flex-row gap-2"
                    )}>
                      <span className={cn(
                        "font-bold tracking-tight transition-all duration-300",
                        isCollapsed ? "text-base" : "text-xl"
                      )}>
                        Lattis
                      </span>
                      <span className={cn(
                        "text-muted-foreground transition-all duration-300",
                        isCollapsed ? "text-[10px]" : "text-sm"
                      )}>
                        Nexus
                      </span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <Navigation isCollapsed={isCollapsed} />

                  {/* Collapse Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-sm hover:bg-accent",
                      "transition-transform duration-300",
                      isCollapsed && "rotate-180"
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">
                      {isCollapsed ? "Expand" : "Collapse"} Sidebar
                    </span>
                  </Button>
                </aside>

                {/* Main Content */}
                <main className={cn(
                  "flex-1 overflow-hidden px-8 pb-8 pt-4",
                  "transition-all duration-300 ease-in-out",
                  isCollapsed ? "pl-[76px]" : "pl-[256px]"
                )}>
                  {children}
                </main>

                {/* Chat Button */}
                <ChatButton />
              </div>
            </RouteOptimizationProvider>
          </AnalyticsProvider>
        </PaymentProvider>
      </IntegrationProvider>
    </NotificationProvider>
  )
}
