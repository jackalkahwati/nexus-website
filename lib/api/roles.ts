import { Role } from "@/app/dashboard/users/roles/columns"

export async function getRoles(): Promise<Role[]> {
  const response = await fetch("/api/users/roles")
  if (!response.ok) {
    throw new Error("Failed to fetch roles")
  }
  return response.json()
}

export async function createRole(data: Omit<Role, "id" | "createdAt" | "updatedAt" | "usersCount">) {
  const response = await fetch("/api/users/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create role")
  }
  return response.json()
}

export async function updateRole(id: string, data: Partial<Role>) {
  const response = await fetch(`/api/users/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update role")
  }
  return response.json()
}

export async function deleteRole(id: string) {
  const response = await fetch(`/api/users/roles/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete role")
  }
}

export async function assignRoleToUser(roleId: string, userId: string) {
  const response = await fetch(`/api/users/roles/${roleId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })
  if (!response.ok) {
    throw new Error("Failed to assign role to user")
  }
  return response.json()
}

export async function removeRoleFromUser(roleId: string, userId: string) {
  const response = await fetch(`/api/users/roles/${roleId}/users/${userId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to remove role from user")
  }
} 