"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { MaintenancePart } from "@/types/maintenance"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  partNumber: z.string().min(2, "Part number must be at least 2 characters"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  status: z.enum(["in_stock", "ordered", "backordered", "installed"]),
  supplier: z.string().min(2, "Supplier must be at least 2 characters"),
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface PartsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  part?: MaintenancePart | null
  onSubmit: (data: Omit<MaintenancePart, "id">) => void
}

export function PartsDialog({ open, onOpenChange, part, onSubmit }: PartsDialogProps) {
  const defaultValues = React.useMemo(() => ({
    name: "",
    partNumber: "",
    quantity: 0,
    cost: 0,
    status: "in_stock" as const,
    supplier: "",
    orderDate: "",
    expectedDeliveryDate: "",
  }), []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Reset form when dialog opens/closes or part changes
  React.useEffect(() => {
    if (open) {
      const values = part ? {
        name: part.name,
        partNumber: part.partNumber,
        quantity: part.quantity,
        cost: part.cost,
        status: part.status,
        supplier: part.supplier,
        orderDate: part.orderDate || "",
        expectedDeliveryDate: part.expectedDeliveryDate || "",
      } : defaultValues;

      form.reset(values);
    }
  }, [open, part, form.reset, defaultValues]);

  const onSubmitForm = async (data: FormData) => {
    try {
      onSubmit(data)
      onOpenChange(false)
      form.reset(defaultValues)
    } catch (error) {
      console.error("Error submitting form:", error)
      // Handle error appropriately
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{part ? "Edit Part" : "Add New Part"}</DialogTitle>
          <DialogDescription>
            {part
              ? "Edit the details of an existing part"
              : "Add a new part to your inventory"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="backordered">Backordered</SelectItem>
                      <SelectItem value="installed">Installed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{part ? "Update" : "Add"} Part</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 