import { Prisma } from '@prisma/client'

declare global {
  namespace PrismaJson {
    type UserRecoveryCodes = string[]
  }
}

declare module '@prisma/client' {
  interface User {
    recoveryCodes?: RecoveryCodes | null
  }

  interface RecoveryCodes {
    id: string
    userId: string
    codes: string[]
    user: User
    createdAt: Date
    updatedAt: Date
  }

  interface Vehicle {
    type: string
  }

  interface VehicleCreateInput {
    type: string
  }

  interface VehicleUncheckedCreateInput {
    type: string
  }

  interface PrismaClient {
    recoveryCodes: Prisma.RecoveryCodesDelegate<DefaultArgs>
  }
}

export {}
