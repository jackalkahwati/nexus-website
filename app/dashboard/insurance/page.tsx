"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Shield,
  AlertTriangle,
  FileText,
  PieChart,
  Car,
  User,
  Camera,
  AlertCircle,
  Activity,
  FileCheck,
  Settings,
  BarChart
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Risk Level component
function RiskLevelBadge({ level, size = "default" }: { level: string; size?: "small" | "default" }) {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  }
  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[level as keyof typeof colors]} ${size === "small" ? "text-xs" : ""}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

// Real-time Monitoring component
function RealTimeMonitoring() {
  const fleetStatus = {
    active: 45,
    maintenance: 3,
    inactive: 2,
    total: 50
  }

  const recentAlerts = [
    { id: 1, type: "speed", vehicle: "Tesla Model 3", time: "2 min ago", priority: "high" },
    { id: 2, type: "maintenance", vehicle: "BMW X5", time: "15 min ago", priority: "medium" },
    { id: 3, type: "location", vehicle: "Ford Transit", time: "1 hour ago", priority: "low" }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Active Vehicles</h3>
          <p className="text-2xl font-bold text-green-600">{fleetStatus.active}</p>
          <Progress value={90} className="mt-2" />
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">In Maintenance</h3>
          <p className="text-2xl font-bold text-yellow-600">{fleetStatus.maintenance}</p>
          <Progress value={6} className="mt-2" />
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Inactive</h3>
          <p className="text-2xl font-bold text-red-600">{fleetStatus.inactive}</p>
          <Progress value={4} className="mt-2" />
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Total Fleet</h3>
          <p className="text-2xl font-bold">{fleetStatus.total}</p>
          <Progress value={100} className="mt-2" />
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {recentAlerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-5 w-5 ${
                  alert.priority === "high" ? "text-red-500" :
                  alert.priority === "medium" ? "text-yellow-500" : "text-green-500"
                }`} />
                <div>
                  <p className="font-medium">{alert.vehicle}</p>
                  <p className="text-sm text-muted-foreground">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} alert - {alert.time}</p>
                </div>
              </div>
              <RiskLevelBadge level={alert.priority} size="small" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Driver Behavior Analysis component
function DriverBehaviorAnalysis() {
  const driverMetrics = [
    { id: 1, name: "John Doe", score: 92, incidents: 0, risk: "low" },
    { id: 2, name: "Jane Smith", score: 78, incidents: 2, risk: "medium" },
    { id: 3, name: "Mike Johnson", score: 65, incidents: 4, risk: "high" }
  ]

  const behaviorStats = {
    hardBraking: 12,
    speeding: 8,
    suddenAcceleration: 5,
    unsafeTurns: 3
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Hard Braking</h3>
          <p className="text-2xl font-bold">{behaviorStats.hardBraking}</p>
          <p className="text-sm text-muted-foreground">Events this week</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Speeding</h3>
          <p className="text-2xl font-bold">{behaviorStats.speeding}</p>
          <p className="text-sm text-muted-foreground">Events this week</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Sudden Acceleration</h3>
          <p className="text-2xl font-bold">{behaviorStats.suddenAcceleration}</p>
          <p className="text-sm text-muted-foreground">Events this week</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Unsafe Turns</h3>
          <p className="text-2xl font-bold">{behaviorStats.unsafeTurns}</p>
          <p className="text-sm text-muted-foreground">Events this week</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Driver Risk Assessment</h3>
        <div className="space-y-3">
          {driverMetrics.map(driver => (
            <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">Safety Score: {driver.score}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{driver.incidents} incidents</span>
                <RiskLevelBadge level={driver.risk} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Damage Detection component
function DamageDetection() {
  const recentDamages = [
    { id: 1, vehicle: "Tesla Model 3", type: "Scratch", location: "Right Door", severity: "low", date: "2024-02-01" },
    { id: 2, vehicle: "BMW X5", type: "Dent", location: "Front Bumper", severity: "medium", date: "2024-02-02" },
    { id: 3, vehicle: "Ford Transit", type: "Crack", location: "Windshield", severity: "high", date: "2024-02-03" }
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-medium mb-4">Recent Damage Reports</h3>
        <div className="space-y-3">
          {recentDamages.map(damage => (
            <div key={damage.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5" />
                <div>
                  <p className="font-medium">{damage.vehicle}</p>
                  <p className="text-sm text-muted-foreground">{damage.type} - {damage.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{damage.date}</span>
                <RiskLevelBadge level={damage.severity} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">AI Detection Status</h3>
          <p className="text-2xl font-bold text-green-600">Active</p>
          <p className="text-sm text-muted-foreground">Last scan: 5 minutes ago</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Pending Reviews</h3>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">Requires human verification</p>
        </Card>
      </div>
    </div>
  )
}

// Claims Form component with enhanced features
function ClaimsForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle">Vehicle</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tesla">Tesla Model 3</SelectItem>
              <SelectItem value="bmw">BMW X5</SelectItem>
              <SelectItem value="ford">Ford Transit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="incident-date">Incident Date</Label>
          <Input type="date" id="incident-date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="incident-type">Incident Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select incident type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collision">Collision</SelectItem>
              <SelectItem value="theft">Theft</SelectItem>
              <SelectItem value="vandalism">Vandalism</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea 
            id="description"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="Describe the incident..."
          />
        </div>
        <div className="space-y-2">
          <Label>Supporting Documents</Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Drag and drop files here or click to upload</p>
          </div>
        </div>
      </div>
      <Button className="w-full">Submit Claim</Button>
    </div>
  )
}

// Coverage Options component with enhanced features
function CoverageOptions() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Collision Coverage</h3>
            <p className="text-sm text-muted-foreground">Covers damage from accidents</p>
          </div>
          <Select defaultValue="full">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Comprehensive Coverage</h3>
            <p className="text-sm text-muted-foreground">Covers non-collision damage</p>
          </div>
          <Select defaultValue="basic">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Liability Coverage</h3>
            <p className="text-sm text-muted-foreground">Covers damage to others</p>
          </div>
          <Select defaultValue="full">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="w-full">Save Coverage Settings</Button>
    </div>
  )
}

// Risk Analysis component
function RiskAnalysis() {
  const vehicles = [
    { id: 1, name: "Tesla Model 3", risk: "low", lastIncident: "Never" },
    { id: 2, name: "BMW X5", risk: "medium", lastIncident: "3 months ago" },
    { id: 3, name: "Ford Transit", risk: "high", lastIncident: "1 month ago" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">Last incident: {vehicle.lastIncident}</p>
            </div>
            <RiskLevelBadge level={vehicle.risk} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InsurancePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Insurance Management</h1>
      </div>
      
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Driver Behavior
          </TabsTrigger>
          <TabsTrigger value="damage" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Damage Detection
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Coverage
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="monitoring">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Real-time Fleet Monitoring</h2>
              <p className="text-muted-foreground">Monitor your fleet's status and receive real-time alerts.</p>
              <Separator className="my-4" />
              <RealTimeMonitoring />
            </div>
          </TabsContent>

          <TabsContent value="behavior">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Driver Behavior Analysis</h2>
              <p className="text-muted-foreground">AI-powered analysis of driver behavior and safety metrics.</p>
              <Separator className="my-4" />
              <DriverBehaviorAnalysis />
            </div>
          </TabsContent>

          <TabsContent value="damage">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">AI Damage Detection</h2>
              <p className="text-muted-foreground">Automated detection and reporting of vehicle damage.</p>
              <Separator className="my-4" />
              <DamageDetection />
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Fleet Risk Analysis</h2>
              <p className="text-muted-foreground">Monitor and analyze risk levels across your fleet.</p>
              <Separator className="my-4" />
              <RiskAnalysis />
            </div>
          </TabsContent>

          <TabsContent value="claims">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">File a Claim</h2>
              <p className="text-muted-foreground">Submit and manage insurance claims.</p>
              <Separator className="my-4" />
              <ClaimsForm />
            </div>
          </TabsContent>

          <TabsContent value="coverage">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Coverage Options</h2>
              <p className="text-muted-foreground">Configure insurance coverage levels for your fleet.</p>
              <Separator className="my-4" />
              <CoverageOptions />
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Insurance Reports</h2>
              <p className="text-muted-foreground">View and download insurance reports and analytics.</p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Claims Summary</h3>
                  <p className="text-2xl font-bold">3 Active Claims</p>
                  <p className="text-sm text-muted-foreground">2 pending, 1 in review</p>
                </Card>
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Premium Status</h3>
                  <p className="text-2xl font-bold">$2,450/month</p>
                  <p className="text-sm text-muted-foreground">Next payment: Mar 1, 2024</p>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
} 