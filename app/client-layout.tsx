"use client"

import { ThemeProvider } from 'next-themes'
import { TopNav } from './components/top-nav'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { Toaster } from '@/components/ui/toaster'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Create auth context
interface User {
  id: string
  name?: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
})

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved user on mount
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          console.log('Found stored user:', parsedUser)
          setUser(parsedUser)
        } else {
          console.log('No stored user found')
        }
      } catch (e) {
        console.error('Error parsing stored user:', e)
        // Clear corrupted data
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    // In browser environment
    if (typeof window !== 'undefined') {
      checkUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    console.log('Logging in user:', userData)
    setUser(userData)
    try {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('User data saved to localStorage')
      
      // Save to cookie for middleware authentication
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Strict`
      console.log('User data saved to cookie')
    } catch (e) {
      console.error('Error saving user data:', e)
    }
  }

  const logout = () => {
    console.log('Logging out user')
    setUser(null)
    try {
      // Remove from localStorage
      localStorage.removeItem('user')
      console.log('User removed from localStorage')
      
      // Remove from cookie
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
      console.log('User removed from cookie')
    } catch (e) {
      console.error('Error removing user data:', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          <TopNav />
          {children}
          <Toaster />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
