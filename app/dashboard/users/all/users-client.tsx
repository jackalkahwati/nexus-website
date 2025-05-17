"use client"

import { useState, useEffect } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  UserPlus,
  MoreHorizontal,
  Mail,
  UserCog,
  Shield,
  Trash2,
  Search,
  Download,
  Filter,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Permission {
  name: string
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
}

interface User {
  id: string
  name: string | null
  email: string
  Role: Role | null
  createdAt: string
  updatedAt: string
  image: string | null
  status: string
}

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: { original: User } }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name || 'Unnamed User'}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }: { row: { original: User } }) => {
      const role = row.original.Role
      return (
        <Badge variant="outline">
          {role?.name || 'No Role'}
        </Badge>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: User } }) => {
      const user = row.original
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
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCog className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Permissions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = () => {
    toast({
      title: "Not implemented",
      description: "This feature is coming soon.",
    })
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. They will receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            {/* Add user form will go here */}
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <DataTable 
          columns={columns} 
          data={users}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
} 