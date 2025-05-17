import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { cn } from "@/lib/cn"

interface ThemeOption {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const availableThemes: ThemeOption[] = [
  { 
    label: 'Light',
    value: 'light',
    icon: Sun,
    description: 'Light theme for daytime use'
  },
  { 
    label: 'Dark',
    value: 'dark',
    icon: Moon,
    description: 'Dark theme for reduced eye strain'
  },
  { 
    label: 'System',
    value: 'system',
    icon: Monitor,
    description: 'Follows your system preferences'
  }
]

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-colors duration-150">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Theme Preferences
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Choose how Lattis looks to you. Select a theme preference below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {availableThemes.map((option) => {
          const Icon = option.icon
          const isActive = theme === option.value
          const isEffectiveTheme = option.value === 'system' 
            ? systemTheme === resolvedTheme
            : option.value === resolvedTheme

          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-all duration-150",
                "hover:border-primary/50 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                isActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                  )} />
                  {isActive && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </div>

              {isEffectiveTheme && (
                <div className="absolute -top-2 -right-2">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Current theme: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} 
        {theme === 'system' && ' (System)'}
      </div>
    </div>
  )
} 