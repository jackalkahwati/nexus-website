import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea"
import { Permission } from "./columns"
import { createPermission, updatePermission } from "@/lib/api/permissions"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  resource: z.string().min(1, "Resource is required"),
  action: z.enum(["create", "read", "update", "delete", "manage"], {
    required_error: "Action is required",
  }),
  conditions: z.record(z.any()).optional(),
})

interface PermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission
  onSuccess?: () => void
}

export function PermissionDialog({
  open,
  onOpenChange,
  permission,
  onSuccess,
}: PermissionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: permission?.name || "",
      description: permission?.description || "",
      resource: permission?.resource || "",
      action: permission?.action || "read",
      conditions: permission?.conditions || {},
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (permission) {
        await updatePermission(permission.id, values)
        toast({
          title: "Permission updated",
          description: "The permission has been updated successfully.",
        })
      } else {
        await createPermission(values)
        toast({
          title: "Permission created",
          description: "The permission has been created successfully.",
        })
      }
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {permission ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
          <DialogDescription>
            {permission
              ? "Edit the permission details below."
              : "Create a new permission by filling out the form below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter permission name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name for the permission
                  </FormDescription>
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
                      placeholder="Enter permission description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of what this permission allows
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter resource name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The resource this permission applies to (e.g., "users", "teams")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="manage">Manage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The action this permission allows
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {permission ? "Update Permission" : "Create Permission"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 