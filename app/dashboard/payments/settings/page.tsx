"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Clock, Users, Shield, AlertTriangle } from "lucide-react"

// Base Rate Configuration Component
function BaseRateConfig() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hourly Base Rate ($)</Label>
          <Input type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label>Daily Base Rate ($)</Label>
          <Input type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label>Weekly Base Rate ($)</Label>
          <Input type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label>Monthly Base Rate ($)</Label>
          <Input type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
      </div>
      <Button className="w-full">Save Base Rates</Button>
    </div>
  )
}

// Service Fee Configuration Component
function ServiceFeeConfig() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Platform Service Fee</h3>
            <p className="text-sm text-muted-foreground">Applied to each rental</p>
          </div>
          <div className="flex items-center gap-4">
            <Input 
              type="number" 
              className="w-24" 
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Select defaultValue="percentage">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Insurance Fee</h3>
            <p className="text-sm text-muted-foreground">Per rental insurance coverage</p>
          </div>
          <div className="flex items-center gap-4">
            <Input 
              type="number" 
              className="w-24" 
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Select defaultValue="fixed">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Cleaning Fee</h3>
            <p className="text-sm text-muted-foreground">Optional cleaning service</p>
          </div>
          <div className="flex items-center gap-4">
            <Input 
              type="number" 
              className="w-24" 
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Select defaultValue="fixed">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button className="w-full">Save Service Fees</Button>
    </div>
  )
}

// Penalty Fee Configuration Component
function PenaltyFeeConfig() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Late Return Fee</h3>
            <p className="text-sm text-muted-foreground">Per hour after scheduled return</p>
          </div>
          <Input 
            type="number" 
            className="w-32" 
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Damage Fee</h3>
            <p className="text-sm text-muted-foreground">Base fee for vehicle damage</p>
          </div>
          <Input 
            type="number" 
            className="w-32" 
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Cancellation Fee</h3>
            <p className="text-sm text-muted-foreground">For last-minute cancellations</p>
          </div>
          <Input 
            type="number" 
            className="w-32" 
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <Button className="w-full">Save Penalty Fees</Button>
    </div>
  )
}

// Membership Plan Configuration Component
function MembershipConfig() {
  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", active: true, discount: 5 },
    { id: 2, name: "Premium", active: true, discount: 10 },
    { id: 3, name: "Enterprise", active: false, discount: 15 }
  ])

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Switch checked={plan.active} />
              <div>
                <h3 className="font-medium">{plan.name} Plan</h3>
                <p className="text-sm text-muted-foreground">{plan.discount}% discount on rentals</p>
              </div>
            </div>
            <Button variant="outline">Edit Plan</Button>
          </div>
        ))}
      </div>
      <Button className="w-full">Add New Plan</Button>
    </div>
  )
}

// Stripe Integration Component
function StripeIntegration() {
  const [connected, setConnected] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-medium">Stripe Account Status</h3>
            <p className="text-sm text-muted-foreground">
              {connected ? "Connected and ready to process payments" : "Not connected"}
            </p>
          </div>
          <Button variant={connected ? "outline" : "default"}>
            {connected ? "Manage Account" : "Connect Stripe"}
          </Button>
        </div>
      </Card>

      {connected && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Processing Fee</h4>
            <p className="text-2xl font-bold">2.9% + $0.30</p>
            <p className="text-sm text-muted-foreground">Per transaction</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Payout Schedule</h4>
            <p className="text-2xl font-bold">2 Days</p>
            <p className="text-sm text-muted-foreground">Standard transfer time</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Available Balance</h4>
            <p className="text-2xl font-bold">$2,450.00</p>
            <p className="text-sm text-muted-foreground">Ready to transfer</p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function PaymentSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <CreditCard className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Fleet Payment Settings</h1>
      </div>

      <Tabs defaultValue="stripe" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Base Rates
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Service Fees
          </TabsTrigger>
          <TabsTrigger value="penalties" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Penalties
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membership
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="stripe">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Stripe Integration</h2>
              <p className="text-muted-foreground">Connect and manage your Stripe account for payment processing.</p>
              <Separator className="my-4" />
              <StripeIntegration />
            </div>
          </TabsContent>

          <TabsContent value="rates">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Base Rate Configuration</h2>
              <p className="text-muted-foreground">Set your base rental rates for different durations.</p>
              <Separator className="my-4" />
              <BaseRateConfig />
            </div>
          </TabsContent>

          <TabsContent value="fees">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Service Fee Configuration</h2>
              <p className="text-muted-foreground">Configure additional service fees and charges.</p>
              <Separator className="my-4" />
              <ServiceFeeConfig />
            </div>
          </TabsContent>

          <TabsContent value="penalties">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Penalty Fee Configuration</h2>
              <p className="text-muted-foreground">Set fees for late returns, damages, and cancellations.</p>
              <Separator className="my-4" />
              <PenaltyFeeConfig />
            </div>
          </TabsContent>

          <TabsContent value="membership">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Membership Plans</h2>
              <p className="text-muted-foreground">Create and manage membership plans with special rates.</p>
              <Separator className="my-4" />
              <MembershipConfig />
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
} 