import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { generateServerPassword } from "@/lib/server/password-utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, workEmail, company } = body

    console.log("Processing demo registration for:", workEmail)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: workEmail }
    })

    if (existingUser) {
      console.log("User already exists:", workEmail)
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Generate a secure random password
    const password = generateServerPassword()
    const hashedPassword = await hashPassword(password)

    try {
      // Get or create demo role
      const demoRole = await prisma.role.upsert({
        where: { name: "DEMO" },
        update: {},
        create: {
          name: "DEMO",
          permissions: {
            create: [
              { name: "demo.access" },
              { name: "fleet.view" },
              { name: "vehicles.view" },
              { name: "dashboard.view" },
              { name: "analytics.view" },
              { name: "maintenance.view" }
            ]
          }
        }
      })
      console.log("Demo role created/found:", demoRole.id)

      // Create user and associated data in a transaction
      const user = await prisma.$transaction(async (tx) => {
        console.log("Starting transaction")
        
        // Create demo request record
        const demoRequest = await tx.demoRequest.create({
          data: {
            fullName,
            email: workEmail,
            company,
            status: "PENDING"
          }
        })
        console.log("Demo request created:", demoRequest.id)

        // Create user with proper field names and relations
        const user = await tx.user.create({
          data: {
            name: fullName,
            email: workEmail,
            hashedPassword: hashedPassword,
            roleId: demoRole.id,
            status: "ACTIVE"
          },
          select: {
            id: true,
            email: true,
            name: true,
            Role: true,
            hashedPassword: true,
            createdAt: true
          }
        })
        console.log("User created:", user.id)

        // Create demo vehicles
        const truck1 = await tx.vehicle.create({
          data: {
            name: "Demo Truck 1",
            type: "standard",
            mileage: 0,
            status: "AVAILABLE"
          }
        })
        console.log("Demo truck 1 created:", truck1.id)

        const van1 = await tx.vehicle.create({
          data: {
            name: "Demo Van 1",
            type: "standard",
            mileage: 0,
            status: "AVAILABLE"
          }
        })
        console.log("Demo van 1 created:", van1.id)

        const truck2 = await tx.vehicle.create({
          data: {
            name: "Demo Truck 2",
            type: "standard",
            mileage: 0,
            status: "AVAILABLE"
          }
        })
        console.log("Demo truck 2 created:", truck2.id)

        // Log activity
        const activity = await tx.activity.create({
          data: {
            action: "DEMO_ACCOUNT_CREATED",
            target: "USER",
            userId: user.id
          }
        })
        console.log("Activity logged:", activity.id)

        return user
      })

      console.log("Transaction completed successfully")

      // Return credentials for immediate login
      return NextResponse.json({
        credentials: {
          email: user.email,
          password: password
        }
      })

    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      throw dbError
    }

  } catch (error) {
    console.error("Demo registration error:", error)
    // Return more specific error message if available
    const errorMessage = error instanceof Error ? error.message : "Failed to create demo account"
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
