"use client"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'

export default function Toasters() {
  return (
    <>
      <Toaster />
      <SonnerToaster />
    </>
  )
} 