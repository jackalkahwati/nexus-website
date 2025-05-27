"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code, Copy, Terminal, Webhook } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/v1/vehicles",
    description: "List all vehicles in the fleet",
    example: `curl -X GET "https://api.example.com/v1/vehicles" \\
-H "Authorization: Bearer YOUR_API_KEY"`
  },
  {
    method: "POST",
    endpoint: "/api/v1/vehicles",
    description: "Add a new vehicle to the fleet",
    example: `curl -X POST "https://api.example.com/v1/vehicles" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "name": "Vehicle 1",
  "type": "truck",
  "capacity": 1000
}'`
  },
  {
    method: "GET",
    endpoint: "/api/v1/routes",
    description: "Get optimized routes for vehicles",
    example: `curl -X GET "https://api.example.com/v1/routes" \\
-H "Authorization: Bearer YOUR_API_KEY"`
  }
]

const sdkExamples = {
  javascript: `import { FleetClient } from '@fleet/sdk';

const client = new FleetClient('YOUR_API_KEY');

// List all vehicles
const vehicles = await client.vehicles.list();

// Add a new vehicle
const newVehicle = await client.vehicles.create({
  name: 'Vehicle 1',
  type: 'truck',
  capacity: 1000
});`,
  python: `from fleet_sdk import FleetClient

client = FleetClient('YOUR_API_KEY')

# List all vehicles
vehicles = client.vehicles.list()

# Add a new vehicle
new_vehicle = client.vehicles.create(
    name='Vehicle 1',
    type='truck',
    capacity=1000
)`,
  java: `import com.fleet.sdk.FleetClient;

FleetClient client = new FleetClient("YOUR_API_KEY");

// List all vehicles
List<Vehicle> vehicles = client.vehicles().list();

// Add a new vehicle
Vehicle newVehicle = client.vehicles().create(
    new VehicleRequest()
        .setName("Vehicle 1")
        .setType("truck")
        .setCapacity(1000)
);`
}

export default function ApiDocumentationPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Documentation</h2>
          <p className="text-muted-foreground">
            Integrate with our platform using our REST API
          </p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Authentication</h3>
        <p className="text-sm text-muted-foreground mb-4">
          All API requests require authentication using an API key. You can get your API key from the Settings page.
        </p>
        <div className="bg-muted p-4 rounded-md">
          <code className="text-sm">
            Authorization: Bearer YOUR_API_KEY
          </code>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">API Reference</h3>
        {apiEndpoints.map((endpoint, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {endpoint.method}
                    </span>
                    <code className="text-sm">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SDK Examples</h3>
        <Tabs defaultValue="javascript" className="space-y-4">
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="java">Java</TabsTrigger>
          </TabsList>
          {Object.entries(sdkExamples).map(([language, code]) => (
            <TabsContent key={language} value={language}>
              <div className="relative">
                <div className="absolute right-2 top-2">
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    {code}
                  </pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Terminal className="h-6 w-6 text-primary" />
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-semibold">CLI Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Use our command-line tool for quick access to common operations
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Installation</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-sm">npm install -g @fleet/cli</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Start</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-x-auto">
{`# Login to your account
fleet login

# List all vehicles
fleet vehicles list

# Get vehicle status
fleet vehicles status VEH_ID

# Create maintenance task
fleet maintenance create`}
                    </pre>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://github.com/fleet/cli', '_blank')}
                >
                  View CLI Documentation
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Webhook className="h-6 w-6 text-primary" />
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-semibold">Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Set up webhooks to receive real-time updates about your fleet
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Available Events</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>vehicle.status_changed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>maintenance.scheduled</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>route.completed</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Example Payload</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-x-auto">
{`{
  "event": "vehicle.status_changed",
  "vehicle_id": "veh_123",
  "status": "maintenance_required",
  "timestamp": "2024-02-04T02:33:03Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    Configure Webhooks
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open('/docs/webhooks', '_blank')}
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 