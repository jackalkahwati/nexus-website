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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"
import { DatabaseConfig } from "@/types/integration"

const databaseFormSchema = z.object({
  type: z.enum(['postgresql', 'mysql', 'mongodb', 'redis']),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port is required"),
  database: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  ssl: z.boolean().default(false),
  options: z.record(z.string(), z.any()).optional(),
})

type DatabaseFormValues = z.infer<typeof databaseFormSchema>

const defaultValues: Partial<DatabaseFormValues> = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  ssl: false,
}

interface DatabaseFormProps {
  onSubmit: (config: DatabaseConfig) => Promise<void>
  onCancel: () => void
}

export function DatabaseForm({ onSubmit, onCancel }: DatabaseFormProps) {
  const { toast } = useToast()
  const { testConnection, isLoading } = useDatabase()
  const [isTesting, setIsTesting] = useState(false)

  const form = useForm<DatabaseFormValues>({
    resolver: zodResolver(databaseFormSchema),
    defaultValues,
  })

  const handleTestConnection = async () => {
    const values = form.getValues()
    setIsTesting(true)
    
    try {
      await testConnection(values as DatabaseConfig)
      toast({
        title: "Connection successful",
        description: "Successfully connected to the database",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to database",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSubmit = async (values: DatabaseFormValues) => {
    try {
      await testConnection(values as DatabaseConfig)
      await onSubmit(values as DatabaseConfig)
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please ensure your database connection is working before saving",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select your database type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="localhost" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5432"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input placeholder="my_database" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="database_user" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ssl"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  SSL Connection
                </FormLabel>
                <FormDescription>
                  Enable SSL/TLS for secure database connection
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting || isLoading}
          >
            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isTesting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isTesting || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
} 