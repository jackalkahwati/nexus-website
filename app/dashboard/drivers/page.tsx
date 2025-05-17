"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  AlertTriangle,
  Clock,
  Calendar,
  Shield,
  TrendingUp,
  FileText,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { useDrivers } from "@/hooks/use-drivers"
import type { Driver, DriverPerformance, DriverSchedule } from "@/types/driver"

export default function DriversPage() {
  const { drivers, isLoading, error } = useDrivers()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])

  const filteredDrivers = React.useMemo(() => {
    return drivers?.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(driver.status)
      return matchesSearch && matchesStatus
    })
  }, [drivers, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">
            Monitor driver performance, schedules, and compliance
          </p>
        </div>
        <Button onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drivers?.filter(d => d.status === 'Available').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {drivers?.length || 0} total drivers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <Progress value={98} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Driver Overview</CardTitle>
              <CardDescription>
                View and manage all drivers
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance Score</TableHead>
                <TableHead>Hours Today</TableHead>
                <TableHead>Next Break</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers?.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>
                    <Badge variant={driver.status === 'Available' ? 'success' : 'secondary'}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{driver.performanceMetrics.rating}%</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </TableCell>
                  <TableCell>{driver.performanceMetrics.totalHours}h</TableCell>
                  <TableCell>
                    <Clock className="h-4 w-4 inline mr-1" />
                    {driver.schedule[0]?.breaks[0]?.startTime || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={driver.license.expiryDate > new Date().toISOString() ? 'success' : 'destructive'}>
                      {driver.license.expiryDate > new Date().toISOString() ? 'Valid' : 'Expired'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 