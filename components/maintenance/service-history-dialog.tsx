"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Wrench,
  User,
  DollarSign,
  Car,
  FileText,
  Download,
  Package,
} from "lucide-react"
import { ServiceHistory } from "@/types/maintenance"
import { format } from "date-fns"
import { cn } from "@/lib/cn"

interface ServiceHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ServiceHistory | null
}

export function ServiceHistoryDialog({
  open,
  onOpenChange,
  record,
}: ServiceHistoryDialogProps) {
  if (!record) return null

  const getMaintenanceTypeColor = (type: ServiceHistory["type"]) => {
    switch (type) {
      case "preventive":
        return "bg-blue-100 text-blue-800"
      case "corrective":
        return "bg-red-100 text-red-800"
      case "charging":
        return "bg-purple-100 text-purple-800"
      case "battery":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Service Record Details</DialogTitle>
          <DialogDescription>
            Detailed information about the maintenance service
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-200px)]">
            <div className="space-y-6 p-1">
              {/* Overview Section */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Date</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {format(new Date(record.performedAt), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${record.cost.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mileage</CardTitle>
                    <Car className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {record.mileage.toLocaleString()} mi
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Vehicle ID
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        {record.vehicleId}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Service Type
                      </div>
                      <Badge className={cn(getMaintenanceTypeColor(record.type))}>
                        {record.type}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Performed By
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {record.performedBy}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Maintenance ID
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        {record.maintenanceId}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </div>
                    <p className="text-sm">{record.description}</p>
                  </div>

                  {record.notes && record.notes.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Notes
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {record.notes.map((note, index) => (
                            <li key={index} className="text-sm">
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {record.parts && record.parts.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Parts Used
                        </div>
                        <div className="space-y-2">
                          {record.parts.map((part) => (
                            <div
                              key={part.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span>{part.name}</span>
                                <span className="text-muted-foreground">
                                  ({part.partNumber})
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span>Qty: {part.quantity}</span>
                                <span>${part.cost.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {record.attachments && record.attachments.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          Attachments
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((attachment, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Attachment {index + 1}</span>
                              <Download className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 