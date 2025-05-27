const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin role if it doesn't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        permissions: {
          create: [
            { name: 'view_dashboard' },
            { name: 'manage_users' },
            { name: 'manage_vehicles' }
          ]
        }
      }
    });

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        roleId: adminRole.id
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword, // @map("password") in schema
        roleId: adminRole.id
      }
    });

    console.log('Test user created:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
