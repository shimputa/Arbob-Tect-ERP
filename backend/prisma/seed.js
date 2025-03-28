import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (!existingSuperAdmin) {
    // Create super admin if doesn't exist
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 1
      }
    });
    
    console.log('Super admin created successfully');
  } else {
    console.log('Super admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 