"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/client-layout"
import { useRouter } from "next/navigation"

// Simplified skeleton component
const WidgetSkeleton = () => (
  <Card className="p-6">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <Skeleton className="h-10 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/4" />
  </Card>
)

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading || !user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-12 gap-6">
          <WidgetSkeleton />
          <WidgetSkeleton />
          <WidgetSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h1>
        <Button onClick={handleLogout}>Log out</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Cards */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Fleet Status</h2>
          <p className="text-4xl font-bold text-green-500">95%</p>
          <p className="text-sm text-muted-foreground mt-2">Operational vehicles</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Active Drivers</h2>
          <p className="text-4xl font-bold text-blue-500">24</p>
          <p className="text-sm text-muted-foreground mt-2">Currently on duty</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Today</h2>
          <p className="text-4xl font-bold text-purple-500">$5,240</p>
          <p className="text-sm text-muted-foreground mt-2">+12% from yesterday</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Maintenance</h2>
          <p className="text-4xl font-bold text-amber-500">3</p>
          <p className="text-sm text-muted-foreground mt-2">Vehicles due service</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Fuel Usage</h2>
          <p className="text-4xl font-bold text-emerald-500">1,240L</p>
          <p className="text-sm text-muted-foreground mt-2">Last 7 days</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Incidents</h2>
          <p className="text-4xl font-bold text-red-500">0</p>
          <p className="text-sm text-muted-foreground mt-2">No incidents today</p>
        </Card>
      </div>
    </div>
  )
}
