"use client"

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Bell } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

const WEBHOOK_EVENTS = [
  {
    type: 'vehicle.status.updated',
    description: 'Triggered when a vehicle\'s status changes',
    example: {
      id: 'evt_123',
      type: 'vehicle.status.updated',
      data: {
        vehicleId: 'veh_123',
        oldStatus: 'active',
        newStatus: 'maintenance',
        timestamp: '2024-01-20T08:00:00Z'
      }
    }
  },
  {
    type: 'booking.created',
    description: 'Triggered when a new booking is created',
    example: {
      id: 'evt_124',
      type: 'booking.created',
      data: {
        bookingId: 'bkg_123',
        vehicleId: 'veh_123',
        userId: 'usr_456',
        startTime: '2024-01-20T10:00:00Z',
        endTime: '2024-01-20T11:00:00Z'
      }
    }
  },
  {
    type: 'alert.triggered',
    description: 'Triggered when a vehicle alert is detected',
    example: {
      id: 'evt_125',
      type: 'alert.triggered',
      data: {
        alertId: 'alt_123',
        vehicleId: 'veh_123',
        type: 'low_battery',
        severity: 'warning',
        timestamp: '2024-01-20T08:30:00Z'
      }
    }
  }
]

export function WebhookDocs() {
  const [selectedEvent, setSelectedEvent] = React.useState(WEBHOOK_EVENTS[0])
  const { addNotification } = useNotifications()

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      addNotification({
        id: Date.now().toString(),
        title: "Copied to clipboard",
        description: "Code snippet has been copied to your clipboard",
        type: "success",
        time: new Date().toISOString(),
        read: false
      })
    }).catch(() => {
      addNotification({
        id: Date.now().toString(),
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        type: "warning",
        time: new Date().toISOString(),
        read: false
      })
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Events</CardTitle>
          <CardDescription>Available webhook events and their triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WEBHOOK_EVENTS.map((event, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg cursor-pointer hover:border-primary"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4" />
                  <h3 className="font-semibold">{event.type}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Example payload for the selected event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Event Type</h3>
              <Badge>{selectedEvent.type}</Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Example Payload</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg font-mono text-sm">
                  {JSON.stringify(selectedEvent.example, null, 2)}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(JSON.stringify(selectedEvent.example, null, 2))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Implementation Example</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg font-mono text-sm">
                  {`app.post('/webhook', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case '${selectedEvent.type}':
      // Handle the event
      console.log('Received ${selectedEvent.type}:', event.data);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});`}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode(`app.post('/webhook', (req, res) => {
  const event = req.body;

  switch (event.type) {
    case '${selectedEvent.type}':
      // Handle the event
      console.log('Received ${selectedEvent.type}:', event.data);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 