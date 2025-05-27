import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertCircle, BarChart3, Calendar, Clock, Settings, WrenchIcon } from "lucide-react"

export default function PredictiveMaintenancePage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Predictive Maintenance</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-powered maintenance optimization to prevent failures before they occur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <WrenchIcon className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Predictive Analytics</h3>
          <p className="text-muted-foreground">
            Advanced AI algorithms predict potential failures and maintenance needs
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Activity className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
          <p className="text-muted-foreground">
            Continuous monitoring of vehicle health and performance metrics
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <AlertCircle className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Early Warning System</h3>
          <p className="text-muted-foreground">
            Proactive alerts for potential issues before they become critical
          </p>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="specs">Technical Specs</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Settings className="h-5 w-5" />
                Automated Diagnostics
              </h3>
              <p className="text-muted-foreground">
                AI-powered system automatically diagnoses issues and recommends solutions
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Calendar className="h-5 w-5" />
                Maintenance Scheduling
              </h3>
              <p className="text-muted-foreground">
                Intelligent scheduling of maintenance tasks based on predictive analytics
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </h3>
              <p className="text-muted-foreground">
                Detailed analytics and reporting on maintenance metrics and KPIs
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Clock className="h-5 w-5" />
                Real-time Updates
              </h3>
              <p className="text-muted-foreground">
                Live updates on maintenance status and vehicle health
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Reduced Downtime</h3>
              <p className="text-muted-foreground">
                Minimize vehicle downtime through proactive maintenance
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Cost Savings</h3>
              <p className="text-muted-foreground">
                Lower maintenance costs through optimized scheduling and prevention
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Extended Vehicle Life</h3>
              <p className="text-muted-foreground">
                Extend the operational life of vehicles through proper maintenance
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Improved Safety</h3>
              <p className="text-muted-foreground">
                Enhanced safety through early detection of potential issues
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Compatible with all major vehicle types</li>
                <li>• Internet connectivity required</li>
                <li>• Sensor integration capability</li>
                <li>• Web browser access</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Integration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• REST API access</li>
                <li>• Real-time data streaming</li>
                <li>• Third-party system integration</li>
                <li>• Custom webhook support</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500">
          Get Started with Predictive Maintenance
        </Button>
      </div>
    </div>
  )
} 