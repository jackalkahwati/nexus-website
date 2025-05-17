import { useCallback } from "react"
import { useToast as useToastPrimitive } from "components/ui/use-toast"
import type { ToastActionElement } from "components/ui/toast"

interface ToastOptions {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

export function useToast() {
  const { toast } = useToastPrimitive()

  const showToast = useCallback(
    ({ title, description, action, variant = "default" }: ToastOptions) => {
      toast({
        title,
        description,
        action,
        variant,
      })
    },
    [toast]
  )

  return {
    toast: showToast,
  }
}
