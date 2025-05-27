import { Team } from "@/app/dashboard/users/teams/columns"

export async function getTeams(): Promise<Team[]> {
  const response = await fetch("/api/users/teams")
  if (!response.ok) {
    throw new Error("Failed to fetch teams")
  }
  return response.json()
}

export async function createTeam(data: Omit<Team, "id" | "createdAt" | "updatedAt">) {
  const response = await fetch("/api/users/teams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create team")
  }
  return response.json()
}

export async function updateTeam(id: string, data: Partial<Team>) {
  const response = await fetch(`/api/users/teams/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update team")
  }
  return response.json()
}

export async function deleteTeam(id: string) {
  const response = await fetch(`/api/users/teams/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete team")
  }
}

export async function addTeamMember(teamId: string, userId: string) {
  const response = await fetch(`/api/users/teams/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })
  if (!response.ok) {
    throw new Error("Failed to add team member")
  }
  return response.json()
}

export async function removeTeamMember(teamId: string, userId: string) {
  const response = await fetch(`/api/users/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to remove team member")
  }
} 