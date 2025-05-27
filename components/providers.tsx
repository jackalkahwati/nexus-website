"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { PaymentProvider } from "@/contexts/PaymentContext"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationProvider>
        <PaymentProvider>
          {children}
          <Toaster />
        </PaymentProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}
