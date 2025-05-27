"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Integration } from "@/types/integration"

const credentialsSchema = z.object({
  apiKey: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  endpoint: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
})

const integrationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(['api', 'webhook', 'database', 'sdk', 'custom'] as const),
  category: z.enum([
    'payment',
    'tracking',
    'maintenance',
    'fleet_management',
    'telematics',
    'authentication',
    'analytics',
    'mapping',
    'weather',
    'notification'
  ] as const),
  config: z.record(z.any()).optional(),
  credentials: credentialsSchema,
  permissions: z.array(z.string()).default([]),
  template: z.string().optional(),
})

type IntegrationFormValues = z.infer<typeof integrationFormSchema>

interface IntegrationFormProps {
  integration?: Integration
  onSubmit: (data: IntegrationFormValues) => void
  onCancel: () => void
}

// Add predefined integration templates
const INTEGRATION_TEMPLATES = {
  stripe: {
    name: "Stripe Payments",
    description: "Process payments and manage subscriptions for bike rentals",
    type: "api",
    category: "payment",
    config: {
      webhookEvents: ["payment.success", "payment.failed", "subscription.updated"],
    }
  },
  mapbox: {
    name: "Mapbox",
    description: "Advanced mapping and navigation features for fleet tracking",
    type: "api",
    category: "mapping",
    config: {
      services: ["maps", "navigation", "geocoding"]
    }
  },
  twilio: {
    name: "Twilio",
    description: "SMS notifications for riders and fleet managers",
    type: "api",
    category: "notification",
    config: {
      services: ["sms", "voice"]
    }
  },
  auth0: {
    name: "Auth0",
    description: "User authentication and authorization management",
    type: "api",
    category: "authentication",
    config: {
      features: ["social_login", "mfa", "role_management"]
    }
  },
  openweather: {
    name: "OpenWeather",
    description: "Real-time weather data for route optimization",
    type: "api",
    category: "weather",
    config: {
      dataTypes: ["current", "forecast", "alerts"]
    }
  },
  googleanalytics: {
    name: "Google Analytics",
    description: "Track user behavior and app performance",
    type: "api",
    category: "analytics",
    config: {
      tracking: ["users", "events", "conversions"]
    }
  },
  samsara: {
    name: "Samsara",
    description: "Advanced fleet telematics and vehicle diagnostics",
    type: "api",
    category: "telematics",
    config: {
      features: ["diagnostics", "location", "safety"]
    }
  },
  zendesk: {
    name: "Zendesk",
    description: "Customer support and ticket management",
    type: "api",
    category: "maintenance",
    config: {
      features: ["tickets", "chat", "knowledge_base"]
    }
  }
}

export function IntegrationForm({ integration, onSubmit, onCancel }: IntegrationFormProps) {
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: integration ? {
      name: integration.name,
      description: integration.description,
      type: integration.type,
      category: integration.category,
      config: integration.config,
      credentials: integration.credentials || {},
      permissions: integration.permissions,
    } : {
      name: "",
      description: "",
      type: "api",
      category: "fleet_management",
      config: {},
      credentials: {},
      permissions: [],
    },
  })

  const integrationType = form.watch('type')
  
  const handleTemplateSelect = (templateKey: string) => {
    if (templateKey === 'custom_integration') {
      form.setValue('name', '')
      form.setValue('description', '')
      form.setValue('type', 'api')
      form.setValue('category', 'fleet_management')
      form.setValue('config', {})
      return
    }

    const template = INTEGRATION_TEMPLATES[templateKey as keyof typeof INTEGRATION_TEMPLATES]
    if (template) {
      form.setValue('name', template.name)
      form.setValue('description', template.description)
      form.setValue('type', template.type as any)
      form.setValue('category', template.category as any)
      form.setValue('config', template.config)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quick Start Templates</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value)
                handleTemplateSelect(value)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom_integration">Custom Integration</SelectItem>
                  {Object.entries(INTEGRATION_TEMPLATES).map(([key, template]) => (
                    <SelectItem key={key} value={key}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a pre-configured template or create a custom integration
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Integration name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this integration does"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="sdk">SDK</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="payment">Payment Processing</SelectItem>
                    <SelectItem value="tracking">Vehicle Tracking</SelectItem>
                    <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                    <SelectItem value="fleet_management">Fleet Management</SelectItem>
                    <SelectItem value="telematics">Telematics</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="mapping">Mapping & Navigation</SelectItem>
                    <SelectItem value="weather">Weather Services</SelectItem>
                    <SelectItem value="notification">Notifications</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {integrationType === 'api' && (
          <>
            <FormField
              control={form.control}
              name="credentials.endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/v1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentials.apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key will be encrypted before storage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {integrationType === 'webhook' && (
          <FormField
            control={form.control}
            name="credentials.endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-server.com/webhook" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {integrationType === 'database' && (
          <>
            <FormField
              control={form.control}
              name="credentials.endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost:5432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credentials.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Database username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credentials.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Database password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {integration ? 'Update Integration' : 'Create Integration'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 