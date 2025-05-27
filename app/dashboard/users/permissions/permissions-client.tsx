"use client"

import { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { columns, type Permission } from './columns'

const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'fleet.read',
    description: 'View fleet information and status',
    resource: 'fleet',
    action: 'read',
    conditions: {},
    rolesCount: 3,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'fleet.write',
    description: 'Modify fleet settings and configurations',
    resource: 'fleet',
    action: 'update',
    conditions: {},
    rolesCount: 2,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'users.manage',
    description: 'Manage user accounts and roles',
    resource: 'users',
    action: 'manage',
    conditions: {},
    rolesCount: 1,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'analytics.view',
    description: 'Access analytics and reporting',
    resource: 'analytics',
    action: 'read',
    conditions: {},
    rolesCount: 4,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'settings.admin',
    description: 'Modify system-wide settings',
    resource: 'settings',
    action: 'manage',
    conditions: {},
    rolesCount: 1,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
]

export default function PermissionsPageClient() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions)
  const { toast } = useToast()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage system permissions and access controls
          </p>
        </div>
        <Button>Add Permission</Button>
      </div>
      <DataTable columns={columns} data={permissions} />
    </div>
  )
} 