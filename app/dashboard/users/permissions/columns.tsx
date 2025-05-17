import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Lock } from "lucide-react"

export type Permission = {
  id: string
  name: string
  description: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  conditions: Record<string, any>
  rolesCount: number
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.getValue("resource")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      return (
        <Badge variant="secondary">
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "rolesCount",
    header: "Roles",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.getValue("rolesCount")} roles
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const permission = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(permission.id)}
            >
              Copy permission ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View permission details</DropdownMenuItem>
            <DropdownMenuItem>Edit permission</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete permission
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 