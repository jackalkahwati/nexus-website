import { Permission } from "@/app/dashboard/users/permissions/columns"
import { fetchApi } from "./config"

export async function getPermissions(): Promise<Permission[]> {
  return fetchApi("/api/users/permissions")
}

export async function createPermission(data: Omit<Permission, "id" | "createdAt" | "updatedAt" | "rolesCount">) {
  return fetchApi("/api/users/permissions", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePermission(id: string, data: Partial<Permission>) {
  return fetchApi(`/api/users/permissions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deletePermission(id: string) {
  return fetchApi(`/api/users/permissions/${id}`, {
    method: "DELETE",
  })
}

export async function assignPermissionToRole(permissionId: string, roleId: string) {
  return fetchApi(`/api/users/permissions/${permissionId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roleId }),
  })
}

export async function removePermissionFromRole(permissionId: string, roleId: string) {
  return fetchApi(`/api/users/permissions/${permissionId}/roles/${roleId}`, {
    method: "DELETE",
  })
} 