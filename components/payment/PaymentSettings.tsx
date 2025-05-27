"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { DollarSign, Percent } from "lucide-react"

const paymentSettingsSchema = z.object({
  baseRates: z.object({
    perMinute: z.number().min(0),
    perHour: z.number().min(0),
    perDay: z.number().min(0),
    perWeek: z.number().min(0),
    perMonth: z.number().min(0),
  }),
  serviceFees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["fixed", "percentage"]),
    amount: z.number().min(0),
    isActive: z.boolean(),
    applicableTo: z.array(z.enum(["rides", "rentals", "subscriptions"]))
  })),
  penaltyFees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number().min(0),
    isActive: z.boolean()
  })),
  depositSettings: z.object({
    requireDeposit: z.boolean(),
    depositAmount: z.number().min(0),
    refundableAmount: z.number().min(0)
  })
})

type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>

const defaultValues: PaymentSettingsValues = {
  baseRates: {
    perMinute: 0.35,
    perHour: 3.00,
    perDay: 25.00,
    perWeek: 120.00,
    perMonth: 399.00
  },
  serviceFees: [
    {
      id: "1",
      name: "Unlock fee",
      type: "fixed",
      amount: 1.00,
      isActive: true,
      applicableTo: ["rides"]
    },
    {
      id: "2",
      name: "Service fee",
      type: "percentage",
      amount: 7.5,
      isActive: true,
      applicableTo: ["rides", "rentals"]
    },
    {
      id: "3",
      name: "Insurance fee",
      type: "fixed",
      amount: 0.50,
      isActive: true,
      applicableTo: ["rides", "rentals"]
    }
  ],
  penaltyFees: [
    {
      id: "1",
      name: "Late return",
      amount: 10.00,
      isActive: true
    },
    {
      id: "2",
      name: "Out of zone parking",
      amount: 15.00,
      isActive: true
    },
    {
      id: "3",
      name: "Damage fee",
      amount: 50.00,
      isActive: true
    }
  ],
  depositSettings: {
    requireDeposit: true,
    depositAmount: 50.00,
    refundableAmount: 45.00
  }
}

export function PaymentSettings() {
  const form = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues
  })

  async function onSubmit(data: PaymentSettingsValues) {
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Settings updated",
        description: "Your payment settings have been saved successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment settings. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Base Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Base Rates</CardTitle>
            <CardDescription>Set the base rental rates for different durations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="baseRates.perMinute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Minute Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseRates.perHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Hour Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseRates.perDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Day Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseRates.perWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Week Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseRates.perMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per Month Rate</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Service Fees</CardTitle>
            <CardDescription>Configure additional service fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("serviceFees").map((fee, index) => (
              <div key={fee.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormField
                      control={form.control}
                      name={`serviceFees.${index}.isActive`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">{fee.name}</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`serviceFees.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`serviceFees.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            {fee.type === "fixed" ? (
                              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Percent className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            )}
                            <Input
                              type="number"
                              step="0.01"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Penalty Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Penalty Fees</CardTitle>
            <CardDescription>Set fees for violations and damages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("penaltyFees").map((fee, index) => (
              <div key={fee.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name={`penaltyFees.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">{fee.name}</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`penaltyFees.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Deposit Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Deposit Settings</CardTitle>
            <CardDescription>Configure security deposit requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="depositSettings.requireDeposit"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Require Security Deposit</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("depositSettings.requireDeposit") && (
              <div className="grid gap-4 grid-cols-2">
                <FormField
                  control={form.control}
                  name="depositSettings.depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depositSettings.refundableAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refundable Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Amount to be refunded after successful return
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Save Payment Settings
        </Button>
      </form>
    </Form>
  )
} 