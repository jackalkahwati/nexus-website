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
import { MoreHorizontal, Users } from "lucide-react"

export type Team = {
  id: string
  name: string
  description: string
  membersCount: number
  leader: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
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
    accessorKey: "membersCount",
    header: "Members",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.getValue("membersCount")} members
        </Badge>
      )
    },
  },
  {
    accessorKey: "leader",
    header: "Team Lead",
    cell: ({ row }) => {
      const leader = row.getValue("leader") as Team["leader"]
      return (
        <div className="flex flex-col">
          <span className="font-medium">{leader.name}</span>
          <span className="text-sm text-muted-foreground">{leader.email}</span>
        </div>
      )
    },
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(team.id)}
            >
              Copy team ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View team details</DropdownMenuItem>
            <DropdownMenuItem>Edit team</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 