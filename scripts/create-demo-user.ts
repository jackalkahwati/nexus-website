const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Create or get the demo role
    const demoRole = await prisma.role.upsert({
      where: { name: "DEMO" },
      update: {},
      create: {
        name: "DEMO",
        permissions: {
          create: [
            { name: "dashboard.view" },
            { name: "dashboard.access" },
            { name: "dashboard:read" },
            { name: "fleet.view" },
            { name: "fleet:read" },
            { name: "vehicles.view" },
            { name: "analytics.view" },
            { name: "maintenance.view" },
            { name: "api.access" },
            { name: "search.access" },
            { name: "reports.view" }
          ]
        }
      }
    })

    console.log('Demo role created/updated:', demoRole)

    // Hash password - using 'demo123'
    const hashedPassword = await hash('demo123', 12)

    // Create demo user if it doesn't exist
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {
        hashedPassword: hashedPassword, // Update password hash even if user exists
      },
      create: {
        email: 'demo@example.com',
        hashedPassword: hashedPassword,
        name: 'Demo User',
        roleId: demoRole.id,
        status: 'ACTIVE'
      }
    })

    console.log('Demo user created/updated:', demoUser)
    
    // Output the credentials for reference
    console.log('\nDemo credentials:')
    console.log('Email: demo@example.com')
    console.log('Password: demo123')
    
  } catch (error) {
    console.error('Error creating demo user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()