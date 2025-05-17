"use client"

import { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  MoreHorizontal,
  Users,
  Shield,
  Trash2,
  Search,
  Filter,
  Settings,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Role {
  id: string
  name: string
  description: string
  users: number
  permissions: number
  createdAt: string
  type: 'system' | 'custom'
}

const columns = [
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }: { row: { original: Role } }) => {
      const role = row.original
      return (
        <div>
          <div className="font-medium">{role.name}</div>
          <div className="text-sm text-muted-foreground">{role.description}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }: { row: { getValue: (key: string) => number } }) => {
      const count = row.getValue("users")
      return (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }: { row: { getValue: (key: string) => number } }) => {
      const count = row.getValue("permissions")
      return (
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: { getValue: (key: string) => Role['type'] } }) => {
      const type = row.getValue("type")
      return (
        <Badge variant={type === 'system' ? 'secondary' : 'default'}>
          {type}
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Role } }) => {
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
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Edit Permissions
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              View Users
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Role Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              disabled={role.type === 'system'}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

// Mock data - replace with actual API call
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access",
    users: 5,
    permissions: 42,
    createdAt: "2023-01-01",
    type: "system"
  },
  {
    id: "2",
    name: "Manager",
    description: "Team and resource management",
    users: 12,
    permissions: 28,
    createdAt: "2023-02-15",
    type: "custom"
  },
  {
    id: "3",
    name: "User",
    description: "Standard user access",
    users: 156,
    permissions: 15,
    createdAt: "2023-01-01",
    type: "system"
  }
]

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const { toast } = useToast()

  const handleAddRole = () => {
    toast({
      title: "Not implemented",
      description: "This feature is coming soon.",
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage user roles and permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role and define its permissions.
              </DialogDescription>
            </DialogHeader>
            {/* Add role form will go here */}
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search roles..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={roles}
      />
    </div>
  )
} 