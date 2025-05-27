import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, FileCheck, BookOpen, CheckCircle, FileText, Bell, Lock } from "lucide-react"

export default function SafetyCompliancePage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Safety & Compliance</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive regulatory compliance and safety management tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <Shield className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Regulatory Compliance</h3>
          <p className="text-muted-foreground">
            Stay compliant with industry regulations and standards
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <AlertTriangle className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Risk Management</h3>
          <p className="text-muted-foreground">
            Proactive risk assessment and mitigation strategies
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <FileCheck className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold">Documentation</h3>
          <p className="text-muted-foreground">
            Automated compliance documentation and reporting
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
                <BookOpen className="h-5 w-5" />
                Policy Management
              </h3>
              <p className="text-muted-foreground">
                Centralized management of safety policies and procedures
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <CheckCircle className="h-5 w-5" />
                Compliance Monitoring
              </h3>
              <p className="text-muted-foreground">
                Real-time monitoring of compliance status and violations
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <FileText className="h-5 w-5" />
                Audit Management
              </h3>
              <p className="text-muted-foreground">
                Streamlined audit processes and documentation
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Bell className="h-5 w-5" />
                Alert System
              </h3>
              <p className="text-muted-foreground">
                Instant notifications for compliance issues and updates
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Risk Reduction</h3>
              <p className="text-muted-foreground">
                Minimize operational risks through proactive compliance
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Legal Protection</h3>
              <p className="text-muted-foreground">
                Strengthen legal standing with documented compliance
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Operational Efficiency</h3>
              <p className="text-muted-foreground">
                Streamline compliance processes and reduce overhead
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Brand Protection</h3>
              <p className="text-muted-foreground">
                Maintain reputation through consistent compliance
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Automated compliance checks</li>
                <li>• Real-time monitoring</li>
                <li>• Document management</li>
                <li>• Audit trail tracking</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Role-based access control</li>
                <li>• Data encryption</li>
                <li>• Secure audit logs</li>
                <li>• Compliance reporting</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500">
          Enhance Your Safety & Compliance
        </Button>
      </div>
    </div>
  )
} 