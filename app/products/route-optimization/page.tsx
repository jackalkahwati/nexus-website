import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Route, Clock, BarChart3, Zap, Target, Truck, Compass } from "lucide-react"

export default function RouteOptimizationPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Route Optimization</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced routing algorithms for maximum efficiency and minimal travel time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Route className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Smart Routing</h3>
          <p className="text-muted-foreground">
            AI-powered route planning considering multiple variables
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Clock className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Real-time Adjustments</h3>
          <p className="text-muted-foreground">
            Dynamic route updates based on traffic and conditions
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <Target className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Multi-stop Planning</h3>
          <p className="text-muted-foreground">
            Efficient handling of multiple destinations and waypoints
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
                <Map className="h-5 w-5" />
                Dynamic Mapping
              </h3>
              <p className="text-muted-foreground">
                Real-time map updates with traffic and road conditions
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Truck className="h-5 w-5" />
                Fleet Management
              </h3>
              <p className="text-muted-foreground">
                Coordinate multiple vehicles for optimal coverage
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </h3>
              <p className="text-muted-foreground">
                Detailed analytics on route efficiency and performance
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Compass className="h-5 w-5" />
                Navigation Integration
              </h3>
              <p className="text-muted-foreground">
                Seamless integration with navigation systems
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Fuel Efficiency</h3>
              <p className="text-muted-foreground">
                Reduce fuel consumption through optimized routes
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Time Savings</h3>
              <p className="text-muted-foreground">
                Minimize travel time and improve delivery speed
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Cost Reduction</h3>
              <p className="text-muted-foreground">
                Lower operational costs through efficient routing
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Improve service reliability and on-time delivery
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GPS tracking capability</li>
                <li>• Internet connectivity</li>
                <li>• Mobile device support</li>
                <li>• Real-time data processing</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Integration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• API-first architecture</li>
                <li>• Map service integration</li>
                <li>• Fleet management systems</li>
                <li>• Custom data inputs</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500">
          Start Optimizing Your Routes
        </Button>
      </div>
    </div>
  )
} 