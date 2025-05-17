"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  FileText,
  Shield,
  TrendingUp,
  User,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react"
import type { Driver } from "@/types/driver"

interface DriverDetailsProps {
  driver: Driver | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (id: string, updates: Partial<Driver>) => Promise<void>
}

export function DriverDetails({
  driver,
  open,
  onOpenChange,
  onUpdate,
}: DriverDetailsProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedDriver, setEditedDriver] = React.useState<Partial<Driver>>({})

  React.useEffect(() => {
    if (driver) {
      setEditedDriver(driver)
    }
  }, [driver])

  const handleSave = async () => {
    if (driver && onUpdate) {
      await onUpdate(driver.id, editedDriver)
      setIsEditing(false)
    }
  }

  if (!driver) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Driver Details</DialogTitle>
          <DialogDescription>
            View and manage driver information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{driver.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={driver.status === 'Available' ? 'success' : 'secondary'}>
                      {driver.status}
                    </Badge>
                    <span>•</span>
                    <span>ID: {driver.id}</span>
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={editedDriver.phone}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Emergency Contact</Label>
                        <Input
                          value={editedDriver.emergencyContact?.name}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              emergencyContact: {
                                ...prev.emergencyContact!,
                                name: e.target.value
                              }
                            }))
                          }
                        />
                        <Input
                          value={editedDriver.emergencyContact?.phone}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              emergencyContact: {
                                ...prev.emergencyContact!,
                                phone: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Emergency Contact</span>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{driver.emergencyContact.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{driver.emergencyContact.phone}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>License Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>License Number</Label>
                        <Input
                          value={editedDriver.license?.number}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              license: {
                                ...prev.license!,
                                number: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input
                          value={editedDriver.license?.type}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              license: {
                                ...prev.license!,
                                type: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          type="date"
                          value={editedDriver.license?.expiryDate.split('T')[0]}
                          onChange={(e) =>
                            setEditedDriver(prev => ({
                              ...prev,
                              license: {
                                ...prev.license!,
                                expiryDate: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">License Number</span>
                        <span>{driver.license.number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span>{driver.license.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expiry Date</span>
                        <Badge variant={
                          new Date(driver.license.expiryDate) > new Date()
                            ? 'success'
                            : 'destructive'
                        }>
                          {new Date(driver.license.expiryDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Certifications</span>
                        <div className="flex gap-2">
                          {driver.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Safety Score</span>
                      <span className="font-medium">{driver.performanceMetrics.safetyScore}%</span>
                    </div>
                    <Progress value={driver.performanceMetrics.safetyScore} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                      <span className="font-medium">{driver.performanceMetrics.onTimeDeliveryRate}%</span>
                    </div>
                    <Progress value={driver.performanceMetrics.onTimeDeliveryRate} />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Completed Trips</span>
                      <span className="font-medium">{driver.performanceMetrics.completedTrips}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add recent activity items here */}
                    <div className="text-sm text-muted-foreground">
                      No recent activity to display
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {driver.schedule.map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium">{day.weekDay}</div>
                        <div className="text-sm text-muted-foreground">
                          {day.startTime} - {day.endTime}
                        </div>
                      </div>
                      <div className="text-sm">
                        {day.breaks.map((break_, i) => (
                          <div key={i} className="text-muted-foreground">
                            Break: {break_.startTime} - {break_.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Driver's License</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  {driver.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{cert} Certification</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 