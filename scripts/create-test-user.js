const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create or get the user role
  const role = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "Default user role",
      permissions: {
        create: [
          {
            name: "dashboard:read",
            description: "Can view dashboard",
          },
        ],
      },
    },
  });

  const password = await hash("testpassword123", 12);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password,
      roleId: role.id,
    },
  });

  console.log("Created test user:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
