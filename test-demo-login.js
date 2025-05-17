// A simple script to test the demo user login credentials
const { PrismaClient } = require('@prisma/client');
const { compare } = require('bcryptjs');

const prisma = new PrismaClient();

async function testDemoLogin() {
  try {
    console.log('🔍 Testing demo user login...');
    
    // Query the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        status: true,
        Role: {
          select: {
            name: true,
            permissions: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!demoUser) {
      console.error('❌ Demo user not found! Make sure to run the create-demo-user.ts script.');
      return;
    }

    console.log('✅ Demo user found:', {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      status: demoUser.status,
      role: demoUser.Role?.name
    });

    // Verify the password
    const isPasswordValid = await compare('demo123', demoUser.hashedPassword);
    
    if (isPasswordValid) {
      console.log('✅ Password verification succeeded for demo123');
    } else {
      console.error('❌ Password verification failed for demo123');
    }

    // Check permissions
    if (demoUser.Role?.permissions) {
      console.log('📋 Demo user permissions:');
      demoUser.Role.permissions.forEach(p => {
        console.log(`  - ${p.name}`);
      });
    } else {
      console.warn('⚠️ No permissions found for demo user');
    }

    console.log('\n✅ Demo credentials should work correctly:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('❌ Error testing demo login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDemoLogin();