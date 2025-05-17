"use client"

import * as React from "react"
import { Footer } from "@/components/ui/footer"
import { ChatBot } from "@/components/chat/ChatBot"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {children}
        <ChatBot />
      </main>
      <Footer />
    </div>
  )
} 