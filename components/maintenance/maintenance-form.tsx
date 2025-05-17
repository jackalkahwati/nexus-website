"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/cn"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { MaintenanceTask, MaintenanceType, ServicePriority } from "@/types/maintenance"
import { useVehicles } from "@/hooks/use-vehicles"
import { useTechnicians } from "@/hooks/use-technicians"
import { toast } from "sonner"

const maintenanceFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(['preventive', 'charging', 'battery', 'corrective', 'emergency'] as const),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  vehicleId: z.string({
    required_error: "Please select a vehicle.",
  }),
  scheduledDate: z.date(),
  estimatedDuration: z.number().min(1),
  estimatedCost: z.number().min(0),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof maintenanceFormSchema>

interface MaintenanceFormProps {
  task?: MaintenanceTask
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function MaintenanceForm({ task, onSubmit, onCancel }: MaintenanceFormProps) {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles()
  const { technicians, isLoading: isLoadingTechnicians } = useTechnicians()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      vehicleId: task.vehicleId,
      scheduledDate: new Date(task.scheduledDate),
      estimatedDuration: task.estimatedDuration,
      estimatedCost: task.cost || 0,
      assignedTo: task.assignedTo,
      notes: task.notes?.join('\n'),
    } : {
      title: "",
      description: "",
      type: "preventive",
      priority: "medium",
      vehicleId: "",
      scheduledDate: new Date(),
      estimatedDuration: 60,
      estimatedCost: 0,
      notes: "",
    },
  })

  async function onSubmitForm(data: FormValues) {
    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create maintenance task")
      }

      toast.success("Maintenance task created successfully")
      form.reset()
      onSubmit(data)
    } catch (error) {
      console.error("Error creating maintenance task:", error)
      toast.error("Failed to create maintenance task")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Oil Change" {...field} />
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
                  placeholder="Detailed description of the maintenance task"
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
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="charging">Charging</SelectItem>
                    <SelectItem value="battery">Battery</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingVehicles ? (
                    <SelectItem value="loading" disabled>
                      Loading vehicles...
                    </SelectItem>
                  ) : vehicles.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No vehicles available
                    </SelectItem>
                  ) : (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimatedCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Cost ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTechnicians ? (
                      <SelectItem value="loading" disabled>
                        Loading technicians...
                      </SelectItem>
                    ) : technicians.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No technicians available
                      </SelectItem>
                    ) : (
                      technicians
                        .filter(tech => tech.availability === 'available')
                        .map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name} ({tech.specialties.join(', ')})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Only available technicians are shown
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or instructions"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any additional information or special instructions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 