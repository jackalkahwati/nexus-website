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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  MoreHorizontal,
  Users,
  Settings,
  Trash2,
  Search,
  Filter,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const columns = [
  {
    accessorKey: "name",
    header: "Team Name",
    cell: ({ row }) => {
      const team = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={team.avatar} alt={team.name} />
            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{team.name}</div>
            <div className="text-sm text-muted-foreground">{team.description}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const count = row.getValue("members")
      return (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department")
      return (
        <Badge variant="outline">
          {department}
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
    cell: ({ row }) => {
      const team = row.original
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
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Team Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

// Mock data - replace with actual API call
const mockTeams = [
  {
    id: "1",
    name: "Engineering",
    description: "Product development team",
    members: 12,
    department: "Technology",
    createdAt: "2023-01-15",
    avatar: ""
  },
  {
    id: "2",
    name: "Design",
    description: "UI/UX design team",
    members: 8,
    department: "Creative",
    createdAt: "2023-02-20",
    avatar: ""
  },
  // Add more mock teams as needed
]

export default function TeamsClient() {
  const [teams, setTeams] = useState(mockTeams)
  const { toast } = useToast()

  const handleAddTeam = () => {
    toast({
      title: "Not implemented",
      description: "This feature is coming soon.",
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage teams and their members
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team and add members to it.
              </DialogDescription>
            </DialogHeader>
            {/* Add team form will go here */}
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search teams..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={teams}
        pagination
      />
    </div>
  )
} 