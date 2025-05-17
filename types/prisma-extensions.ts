import { Prisma } from '@prisma/client'

declare module '@prisma/client' {
  export interface User {
    recoveryCodes: string[]
  }

  export interface UserSelect {
    recoveryCodes?: boolean
  }

  export interface UserUpdateInput {
    recoveryCodes?: string[]
  }
}
