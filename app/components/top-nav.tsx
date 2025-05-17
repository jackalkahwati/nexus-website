"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/client-layout'
import Link from 'next/link'
import { UserMenu } from '@/components/header/UserMenu'

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  if (!mounted) {
    return (
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <div className="w-[200px]" />
            <Button variant="ghost" size="icon">
              <div className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <Link href="/dashboard" className="font-bold text-xl">
            Lattis Nexus
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px] pl-8"
              />
            </div>
            <Button type="submit" variant="ghost" size="sm">
              Search
            </Button>
          </form>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <UserMenu />
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 