import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

async function main() {
  console.log('Running Prisma migrations...')
  
  try {
    // Run migrations
    execSync('npx prisma migrate dev --name add_password_history', { stdio: 'inherit' })
    
    // Generate Prisma Client
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    console.log('Migration completed successfully')
    
    // Initialize Prisma client to verify changes
    const prisma = new PrismaClient()
    
    // Test new schema by creating a test password history entry
    const testUser = await prisma.user.findFirst()
    if (testUser) {
      await prisma.passwordHistory.create({
        data: {
          userId: testUser.id,
          hash: 'test-hash',
        },
      })
      console.log('Test password history entry created successfully')
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()
