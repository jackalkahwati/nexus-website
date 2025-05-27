const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function main() {
  // Create admin role
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Administrator role with full access',
      permissions: {
        create: [
          { name: 'FULL_ACCESS', description: 'Full system access' }
        ]
      }
    }
  })

  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@lattis.com',
      password: hashedPassword,
      name: 'Admin User',
      roleId: adminRole.id,
      isActive: true
    }
  })

  console.log('Admin user created:', adminUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
