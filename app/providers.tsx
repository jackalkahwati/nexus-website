"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./client-layout"
import { NotificationProvider } from "@/contexts/NotificationContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
