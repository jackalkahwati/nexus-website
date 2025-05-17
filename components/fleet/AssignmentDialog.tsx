"use client"

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Vehicle } from '@/types/fleet'
import { useToast } from '@/components/ui/use-toast'

const assignmentSchema = z.object({
  type: z.enum(['delivery', 'pickup', 'service']),
  startTime: z.string(),
  endTime: z.string().optional(),
  location: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

interface AssignmentDialogProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignmentCreated?: () => void
}

export default function AssignmentDialog({
  vehicle,
  open,
  onOpenChange,
  onAssignmentCreated,
}: AssignmentDialogProps) {
  const { toast } = useToast()
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      type: 'delivery',
      startTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
      location: {
        address: '',
        lat: 0,
        lng: 0,
      },
    },
  })

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      const response = await fetch(`/api/fleet/vehicles/${vehicle.id}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create assignment')
      }

      toast({
        title: 'Assignment Created',
        description: 'The vehicle assignment has been created successfully.',
      })

      onOpenChange(false)
      onAssignmentCreated?.()
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast({
        title: 'Error',
        description: 'Failed to create assignment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Mock function to simulate geocoding
  const handleAddressChange = async (address: string) => {
    // In a real application, this would call a geocoding service
    form.setValue('location', {
      address,
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for {vehicle.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank for open-ended assignments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter address"
                      onChange={(e) => {
                        field.onChange(e)
                        handleAddressChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Assignment</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 