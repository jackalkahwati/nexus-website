"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Package,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ArrowUpDown,
  AlertTriangle,
  Settings,
  Download,
  DollarSign,
} from "lucide-react"
import { useMaintenance } from "@/contexts/MaintenanceContext"
import { MaintenancePart } from "@/types/maintenance"
import { PartsDialog } from "@/components/parts/parts-dialog"
import { cn } from "@/lib/cn"

const mockParts: MaintenancePart[] = [
  {
    id: "P001",
    name: "Brake Pad Set",
    partNumber: "BP-2024-001",
    quantity: 24,
    cost: 89.99,
    status: "in_stock",
    supplier: "BrakeMaster Inc",
    orderDate: "2024-01-15",
    expectedDeliveryDate: "2024-01-20",
  },
  {
    id: "P002",
    name: "Air Filter",
    partNumber: "AF-2024-002",
    quantity: 15,
    cost: 29.99,
    status: "in_stock",
    supplier: "FilterPro",
    orderDate: "2024-01-10",
    expectedDeliveryDate: "2024-01-18",
  },
  {
    id: "P003",
    name: "Engine Oil (5L)",
    partNumber: "EO-2024-003",
    quantity: 5,
    cost: 45.99,
    status: "ordered",
    supplier: "LubeTech",
    orderDate: "2024-01-18",
    expectedDeliveryDate: "2024-01-25",
  },
]

type SortableFields = keyof Pick<MaintenancePart, "name" | "quantity" | "cost">

export default function PartsPage() {
  const [parts, setParts] = React.useState<MaintenancePart[]>(mockParts)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedPart, setSelectedPart] = React.useState<MaintenancePart | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableFields | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })
  const [statusFilter, setStatusFilter] = React.useState<MaintenancePart["status"] | "all">("all")

  const filteredParts = React.useMemo(() => {
    return parts.filter((part) => {
      const matchesSearch =
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.supplier?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || part.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [parts, searchQuery, statusFilter])

  const sortedParts = React.useMemo(() => {
    if (!sortConfig.key) return filteredParts

    return [...filteredParts].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredParts, sortConfig])

  const handleSort = (key: SortableFields) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleAddPart = (data: Omit<MaintenancePart, "id">) => {
    const newPart = {
      ...data,
      id: `P${String(parts.length + 1).padStart(3, "0")}`,
    }
    setParts((current) => [...current, newPart])
  }

  const handleUpdatePart = (id: string, updates: Partial<MaintenancePart>) => {
    setParts((current) =>
      current.map((part) => (part.id === id ? { ...part, ...updates } : part))
    )
  }

  const handleDeletePart = (id: string) => {
    if (confirm("Are you sure you want to delete this part?")) {
      setParts((current) => current.filter((part) => part.id !== id))
    }
  }

  const getStatusColor = (status: MaintenancePart["status"]) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800"
      case "ordered":
        return "bg-blue-100 text-blue-800"
      case "backordered":
        return "bg-yellow-100 text-yellow-800"
      case "installed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLowStockAlert = (quantity: number) => {
    return quantity <= 5 ? (
      <div className="flex items-center text-yellow-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        Low Stock
      </div>
    ) : null
  }

  const totalValue = React.useMemo(() => {
    return parts.reduce((sum, part) => sum + part.cost * part.quantity, 0)
  }, [parts])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parts Management</h1>
          <p className="text-muted-foreground">
            Manage inventory, track parts, and monitor stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parts.length}</div>
            <p className="text-xs text-muted-foreground">
              {parts.filter((p) => p.status === "in_stock").length} in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parts.filter((p) => p.quantity <= 5).length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordered Parts</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parts.filter((p) => p.status === "ordered").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Parts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parts Inventory</CardTitle>
              <CardDescription>Manage and track your parts inventory</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("in_stock")}>
                  In Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("ordered")}>
                  Ordered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("backordered")}>
                  Backordered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("installed")}>
                  Installed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1"
                  >
                    Part Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("quantity")}
                    className="flex items-center gap-1"
                  >
                    Quantity
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("cost")}
                    className="flex items-center gap-1"
                  >
                    Cost
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell>{part.partNumber}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{part.quantity}</div>
                      {getLowStockAlert(part.quantity)}
                    </div>
                  </TableCell>
                  <TableCell>${part.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusColor(part.status))}>
                      {part.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{part.supplier}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedPart(part)
                          setDialogOpen(true)
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePart(part.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Parts Dialog */}
      <PartsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        part={selectedPart}
        onSubmit={(data) => {
          if (selectedPart) {
            handleUpdatePart(selectedPart.id, data)
          } else {
            handleAddPart(data)
          }
          setSelectedPart(null)
        }}
      />
    </div>
  )
} 