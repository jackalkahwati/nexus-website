import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SearchResult {
  id: string
  type: string
  name: string
  description: string
  path: string
  updatedAt: string
}

export const columns: ColumnDef<SearchResult>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("type")}</Badge>
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link 
          href={row.original.path}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      return new Date(row.getValue("updatedAt")).toLocaleDateString()
    },
  },
] 