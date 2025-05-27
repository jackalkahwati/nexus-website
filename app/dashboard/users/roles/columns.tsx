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
import { MoreHorizontal, Shield } from "lucide-react"

export type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  usersCount: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isSystem = row.original.isSystem
      return (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
          {isSystem && (
            <Badge variant="secondary" className="ml-2">
              System
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.getValue("permissions") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 3).map((permission) => (
            <Badge key={permission} variant="secondary">
              {permission}
            </Badge>
          ))}
          {permissions.length > 3 && (
            <Badge variant="secondary">+{permissions.length - 3}</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "usersCount",
    header: "Users",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.getValue("usersCount")} users
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original

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
              onClick={() => navigator.clipboard.writeText(role.id)}
            >
              Copy role ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View role details</DropdownMenuItem>
            <DropdownMenuItem disabled={role.isSystem}>
              Edit role
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              disabled={role.isSystem}
            >
              Delete role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 