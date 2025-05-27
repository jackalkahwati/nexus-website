"use client"

import Link from 'next/link'
import { Button } from './button'
import Navigation from './navigation'
import { SearchCommand } from '../header/SearchCommand'
import { NotificationsMenu } from '../header/NotificationsMenu'
import { UserMenu } from '../header/UserMenu'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isDashboardPage = pathname.startsWith('/dashboard')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#0B0B0F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0B0F]/80">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">LATTIS</span>
          </Link>
          <Navigation />
        </div>

        <div className="ml-auto flex items-center gap-4">
          {isDashboardPage ? (
            <>
              <SearchCommand />
              <NotificationsMenu />
              <UserMenu />
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-500">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 