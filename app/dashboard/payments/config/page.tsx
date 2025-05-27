"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CreditCard,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Plus,
  Timer,
  Bike,
  CalendarDays,
  CalendarClock,
  Save,
  Settings2,
  Zap,
  Shield,
  Tag,
  Users,
  Package
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { usePayment } from "@/contexts/PaymentContext"

interface PricingTier {
  id: string
  name: string
  basePrice: number
  timeUnit: 'minute' | 'hour' | 'day' | 'week' | 'month'
  pricePerUnit: number
  minimumUnits: number
  maximumUnits?: number
  deposit?: number
  isActive: boolean
  description?: string
  features?: string[]
}

interface ServiceFee {
  id: string
  name: string
  type: 'fixed' | 'percentage'
  amount: number
  description?: string
  isActive: boolean
  applicableTo?: ('rides' | 'rentals' | 'subscriptions')[]
}

interface DiscountRule {
  id: string
  name: string
  type: 'percentage' | 'fixed'
  amount: number
  minAmount?: number
  maxDiscount?: number
  isActive: boolean
  description?: string
}

export default function PaymentConfigPage() {
  const { toast } = useToast()
  const { updatePricingConfig } = usePayment()

  const [pricingTiers, setPricingTiers] = React.useState<PricingTier[]>([
    {
      id: "1",
      name: "Pay as you go",
      basePrice: 1.00,
      timeUnit: 'minute',
      pricePerUnit: 0.35,
      minimumUnits: 10,
      isActive: true,
      description: "Perfect for short trips",
      features: ["No commitment", "Pay only for what you use", "24/7 support"]
    },
    {
      id: "2",
      name: "Hourly rental",
      basePrice: 5.00,
      timeUnit: 'hour',
      pricePerUnit: 3.00,
      minimumUnits: 1,
      maximumUnits: 24,
      deposit: 20.00,
      isActive: true,
      description: "Ideal for longer rides",
      features: ["Flexible duration", "Reduced per-unit rate", "Free unlocks"]
    },
    {
      id: "3",
      name: "Daily rental",
      basePrice: 15.00,
      timeUnit: 'day',
      pricePerUnit: 12.00,
      minimumUnits: 1,
      maximumUnits: 7,
      deposit: 50.00,
      isActive: true,
      description: "Best for full day usage",
      features: ["24-hour access", "Multiple rides included", "Insurance included"]
    },
    {
      id: "4",
      name: "Weekly pass",
      basePrice: 49.99,
      timeUnit: 'week',
      pricePerUnit: 0,
      minimumUnits: 1,
      isActive: true,
      description: "Great for regular users",
      features: ["Unlimited rides", "Priority support", "Exclusive benefits"]
    },
    {
      id: "5",
      name: "Monthly subscription",
      basePrice: 29.99,
      timeUnit: 'month',
      pricePerUnit: 0,
      minimumUnits: 1,
      isActive: true,
      description: "Best value for daily riders",
      features: ["Unlimited rides", "Premium support", "Member benefits"]
    }
  ])

  const [serviceFees, setServiceFees] = React.useState<ServiceFee[]>([
    {
      id: "1",
      name: "Unlock fee",
      type: 'fixed',
      amount: 1.00,
      description: "One-time fee per ride",
      isActive: true,
      applicableTo: ['rides']
    },
    {
      id: "2",
      name: "Service fee",
      type: 'percentage',
      amount: 7.5,
      description: "Applied to total ride cost",
      isActive: true,
      applicableTo: ['rides', 'rentals']
    },
    {
      id: "3",
      name: "Insurance fee",
      type: 'fixed',
      amount: 0.50,
      description: "Per ride insurance coverage",
      isActive: true,
      applicableTo: ['rides', 'rentals']
    },
    {
      id: "4",
      name: "Subscription processing",
      type: 'percentage',
      amount: 2.5,
      description: "Monthly subscription processing",
      isActive: true,
      applicableTo: ['subscriptions']
    }
  ])

  const [discountRules, setDiscountRules] = React.useState<DiscountRule[]>([
    {
      id: "1",
      name: "First-time user",
      type: 'percentage',
      amount: 50,
      maxDiscount: 10,
      isActive: true,
      description: "50% off first ride (up to $10)"
    },
    {
      id: "2",
      name: "Bulk purchase",
      type: 'percentage',
      amount: 15,
      minAmount: 50,
      isActive: true,
      description: "15% off purchases over $50"
    },
    {
      id: "3",
      name: "Student discount",
      type: 'percentage',
      amount: 10,
      isActive: true,
      description: "10% off for verified students"
    }
  ])

  const timeUnitOptions = [
    { value: 'minute', label: 'Per Minute', icon: Timer },
    { value: 'hour', label: 'Per Hour', icon: Clock },
    { value: 'day', label: 'Per Day', icon: Calendar },
    { value: 'week', label: 'Per Week', icon: CalendarClock },
    { value: 'month', label: 'Per Month', icon: CalendarDays }
  ]

  const handleSave = async () => {
    try {
      await updatePricingConfig({
        pricingTiers,
        serviceFees,
        discountRules
      })
      toast({
        title: "Settings saved",
        description: "Payment configuration has been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment configuration.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Configuration</h2>
          <p className="text-muted-foreground">
            Manage pricing tiers, fees, and discounts
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">
            <Tag className="mr-2 h-4 w-4" />
            Pricing Tiers
          </TabsTrigger>
          <TabsTrigger value="fees">
            <Settings2 className="mr-2 h-4 w-4" />
            Service Fees
          </TabsTrigger>
          <TabsTrigger value="discounts">
            <Zap className="mr-2 h-4 w-4" />
            Discounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4 grid-cols-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pricing Tiers</CardTitle>
                    <CardDescription>Configure rental and subscription pricing</CardDescription>
                  </div>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {pricingTiers.map((tier) => (
                  <div key={tier.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{tier.name}</Label>
                        <div className="text-sm text-muted-foreground">
                          {tier.description}
                        </div>
                        <div className="text-sm">
                          {tier.basePrice > 0 && `$${tier.basePrice.toFixed(2)} base + `}
                          ${tier.pricePerUnit.toFixed(2)} per {tier.timeUnit}
                        </div>
                      </div>
                      <Switch
                        checked={tier.isActive}
                        onCheckedChange={(checked) => {
                          setPricingTiers(tiers =>
                            tiers.map(t =>
                              t.id === tier.id ? { ...t, isActive: checked } : t
                            )
                          )
                        }}
                      />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label>Base Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={tier.basePrice}
                            className="pl-8"
                            onChange={(e) => {
                              setPricingTiers(tiers =>
                                tiers.map(t =>
                                  t.id === tier.id ? { ...t, basePrice: parseFloat(e.target.value) } : t
                                )
                              )
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Price Per Unit</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={tier.pricePerUnit}
                            className="pl-8"
                            onChange={(e) => {
                              setPricingTiers(tiers =>
                                tiers.map(t =>
                                  t.id === tier.id ? { ...t, pricePerUnit: parseFloat(e.target.value) } : t
                                )
                              )
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time Unit</Label>
                        <Select
                          value={tier.timeUnit}
                          onValueChange={(value) => {
                            setPricingTiers(tiers =>
                              tiers.map(t =>
                                t.id === tier.id ? { ...t, timeUnit: value as PricingTier['timeUnit'] } : t
                              )
                            )
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeUnitOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  {React.createElement(option.icon, {
                                    className: "mr-2 h-4 w-4"
                                  })}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Deposit (Optional)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            value={tier.deposit || ''}
                            className="pl-8"
                            onChange={(e) => {
                              setPricingTiers(tiers =>
                                tiers.map(t =>
                                  t.id === tier.id ? { ...t, deposit: parseFloat(e.target.value) } : t
                                )
                              )
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Service Fees</CardTitle>
                  <CardDescription>Configure additional fees and charges</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {serviceFees.map((fee) => (
                <div key={fee.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{fee.name}</Label>
                      <div className="text-sm text-muted-foreground">
                        {fee.description}
                      </div>
                      <div className="text-sm">
                        Applies to: {fee.applicableTo?.join(', ')}
                      </div>
                    </div>
                    <Switch
                      checked={fee.isActive}
                      onCheckedChange={(checked) => {
                        setServiceFees(fees =>
                          fees.map(f =>
                            f.id === fee.id ? { ...f, isActive: checked } : f
                          )
                        )
                      }}
                    />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fee Type</Label>
                      <Select
                        value={fee.type}
                        onValueChange={(value) => {
                          setServiceFees(fees =>
                            fees.map(f =>
                              f.id === fee.id ? { ...f, type: value as ServiceFee['type'] } : f
                            )
                          )
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">
                            <div className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Fixed Amount
                            </div>
                          </SelectItem>
                          <SelectItem value="percentage">
                            <div className="flex items-center">
                              <Percent className="mr-2 h-4 w-4" />
                              Percentage
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        {fee.type === 'fixed' ? (
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Percent className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                          type="number"
                          step={fee.type === 'fixed' ? "0.01" : "0.1"}
                          value={fee.amount}
                          className="pl-8"
                          onChange={(e) => {
                            setServiceFees(fees =>
                              fees.map(f =>
                                f.id === fee.id ? { ...f, amount: parseFloat(e.target.value) } : f
                              )
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Discount Rules</CardTitle>
                  <CardDescription>Configure promotional discounts and special offers</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {discountRules.map((rule) => (
                <div key={rule.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{rule.name}</Label>
                      <div className="text-sm text-muted-foreground">
                        {rule.description}
                      </div>
                    </div>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => {
                        setDiscountRules(rules =>
                          rules.map(r =>
                            r.id === rule.id ? { ...r, isActive: checked } : r
                          )
                        )
                      }}
                    />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select
                        value={rule.type}
                        onValueChange={(value) => {
                          setDiscountRules(rules =>
                            rules.map(r =>
                              r.id === rule.id ? { ...r, type: value as DiscountRule['type'] } : r
                            )
                          )
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">
                            <div className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Fixed Amount
                            </div>
                          </SelectItem>
                          <SelectItem value="percentage">
                            <div className="flex items-center">
                              <Percent className="mr-2 h-4 w-4" />
                              Percentage
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        {rule.type === 'fixed' ? (
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Percent className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                          type="number"
                          step={rule.type === 'fixed' ? "0.01" : "0.1"}
                          value={rule.amount}
                          className="pl-8"
                          onChange={(e) => {
                            setDiscountRules(rules =>
                              rules.map(r =>
                                r.id === rule.id ? { ...r, amount: parseFloat(e.target.value) } : r
                              )
                            )
                          }}
                        />
                      </div>
                    </div>
                    {rule.type === 'percentage' && (
                      <>
                        <div className="space-y-2">
                          <Label>Minimum Purchase Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              value={rule.minAmount || ''}
                              className="pl-8"
                              onChange={(e) => {
                                setDiscountRules(rules =>
                                  rules.map(r =>
                                    r.id === rule.id ? { ...r, minAmount: parseFloat(e.target.value) } : r
                                  )
                                )
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Maximum Discount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              value={rule.maxDiscount || ''}
                              className="pl-8"
                              onChange={(e) => {
                                setDiscountRules(rules =>
                                  rules.map(r =>
                                    r.id === rule.id ? { ...r, maxDiscount: parseFloat(e.target.value) } : r
                                  )
                                )
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 