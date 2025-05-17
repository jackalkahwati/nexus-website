import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Activity, Wifi, Radio, Settings, Bell } from "lucide-react"

export default function WebSocketPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">WebSocket Streams</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Real-time data streaming for live vehicle updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Zap className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Real-time Updates</h3>
          <p className="text-muted-foreground">
            Live streaming of vehicle telemetry and status
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Activity className="h-12 w-12 text-green-500" />
          <h3 className="text-xl font-semibold">Event Streams</h3>
          <p className="text-muted-foreground">
            Subscribe to specific event types and notifications
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Wifi className="h-12 w-12 text-purple-500" />
          <h3 className="text-xl font-semibold">Reliable Connection</h3>
          <p className="text-muted-foreground">
            Automatic reconnection and message queuing
          </p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">WebSocket Overview</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect to our WebSocket endpoint to receive real-time updates:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
                  <code>wss://ws.lattis.com/v1/stream</code>
                </pre>
              </div>
              <p className="text-muted-foreground">
                The WebSocket connection provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time vehicle status updates</li>
                <li>Live telemetry data</li>
                <li>System events and notifications</li>
                <li>Automatic reconnection handling</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Authentication</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Authenticate your WebSocket connection using your API key:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
                  <code>{`
wss://ws.lattis.com/v1/stream?api_key=your_api_key
                  `.trim()}</code>
                </pre>
              </div>
              <p className="text-muted-foreground">
                After connecting, send an authentication message:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
                  <code>{`
{
  "type": "auth",
  "data": {
    "api_key": "your_api_key",
    "api_secret": "your_api_secret"
  }
}
                  `.trim()}</code>
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Event Types</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Vehicle Events</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
{
  "type": "vehicle_status",
  "data": {
    "vehicle_id": "v123",
    "status": "active",
    "location": {
      "lat": 37.7749,
      "lng": -122.4194
    },
    "battery": 85,
    "speed": 25
  }
}
                    `.trim()}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">System Events</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
{
  "type": "system_event",
  "data": {
    "event": "maintenance_required",
    "severity": "warning",
    "message": "Vehicle v123 requires maintenance"
  }
}
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Code Examples</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">JavaScript</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
const ws = new WebSocket('wss://ws.lattis.com/v1/stream');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    data: {
      api_key: 'your_api_key',
      api_secret: 'your_api_secret'
    }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Subscribe to specific vehicle
ws.send(JSON.stringify({
  type: 'subscribe',
  data: {
    vehicle_id: 'v123'
  }
}));
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="space-y-4">
            <Settings className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-semibold">Configuration</h3>
            <p className="text-muted-foreground">
              Learn about WebSocket connection settings
            </p>
            <Button variant="outline" className="w-full">
              View Configuration Guide
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Bell className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">Event Reference</h3>
            <p className="text-muted-foreground">
              Complete list of WebSocket events
            </p>
            <Button variant="outline" className="w-full">
              View Event Reference
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 