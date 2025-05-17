const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin role if it doesn't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        permissions: {
          create: [
            { name: 'FULL_ACCESS' }
          ]
        }
      }
    })

    // Hash password
    const hashedPassword = await hash('admin123', 12)

    // Create admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lattis.com' },
      update: {},
      create: {
        email: 'admin@lattis.com',
        hashedPassword: hashedPassword,
        name: 'Admin User',
        roleId: adminRole.id,
        status: 'ACTIVE'
      }
    })

    console.log('Admin user created/updated:', adminUser)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
