import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Lock, Server, Shield, Zap } from "lucide-react"

export default function ApiReferencePage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">API Reference</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Complete documentation for the Lattis REST API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Server className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">REST API</h3>
          <p className="text-muted-foreground">
            HTTP-based API for fleet management operations
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Lock className="h-12 w-12 text-purple-500" />
          <h3 className="text-xl font-semibold">Authentication</h3>
          <p className="text-muted-foreground">
            Secure API access with API keys and OAuth
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Zap className="h-12 w-12 text-yellow-500" />
          <h3 className="text-xl font-semibold">Real-time Events</h3>
          <p className="text-muted-foreground">
            WebSocket streams for live updates
          </p>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Fleet Management</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <pre className="text-sm">
                    <code>GET /api/v1/fleet</code>
                    <p className="text-muted-foreground mt-1">List all vehicles in the fleet</p>
                  </pre>
                  <pre className="text-sm">
                    <code>POST /api/v1/fleet</code>
                    <p className="text-muted-foreground mt-1">Add a new vehicle to the fleet</p>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Vehicle Operations</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <pre className="text-sm">
                    <code>GET /api/v1/vehicles/{'{id}'}</code>
                    <p className="text-muted-foreground mt-1">Get vehicle details</p>
                  </pre>
                  <pre className="text-sm">
                    <code>PUT /api/v1/vehicles/{'{id}'}/status</code>
                    <p className="text-muted-foreground mt-1">Update vehicle status</p>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Authentication</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                All API requests must include your API key in the Authorization header:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
                  <code>{`
Authorization: Bearer your_api_key
                  `.trim()}</code>
                </pre>
              </div>
              <div className="mt-6 space-y-2">
                <h4 className="text-lg font-medium">OAuth 2.0</h4>
                <p className="text-muted-foreground">
                  For user-based authentication, we support OAuth 2.0:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={code}
&client_id={client_id}
&client_secret={client_secret}
&redirect_uri={redirect_uri}
                    `.trim()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Error Handling</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The API uses standard HTTP response codes and returns errors in JSON format:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm">
                  <code>{`
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid vehicle ID provided",
    "status": 400,
    "details": {
      "field": "vehicle_id",
      "reason": "not_found"
    }
  }
}
                  `.trim()}</code>
                </pre>
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
const response = await fetch('https://api.lattis.com/v1/fleet', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
});

const fleet = await response.json();
                    `.trim()}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">Python</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`
import requests

response = requests.get(
    'https://api.lattis.com/v1/fleet',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
)

fleet = response.json()
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
            <Database className="h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-semibold">Rate Limits</h3>
            <p className="text-muted-foreground">
              Learn about API rate limits and quotas
            </p>
            <Button variant="outline" className="w-full">
              View Rate Limits
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Shield className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">Security</h3>
            <p className="text-muted-foreground">
              API security best practices and guidelines
            </p>
            <Button variant="outline" className="w-full">
              View Security Guide
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 