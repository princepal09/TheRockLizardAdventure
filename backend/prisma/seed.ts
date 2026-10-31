import { prisma } from '../src/lib/prisma.js';
import { env } from '../src/config/env.config.js';
import { hashPassword } from '../src/utils/auth/password.js';

async function main() {
  // Create the initial admin if it doesn't already exist.
  const existingAdmin = await prisma.admin.findUnique({
    where: {
      email: env.ADMIN_EMAIL,
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);

  await prisma.admin.create({
    data: {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      passwordHash: hashedPassword,
    },
  });

  console.log('Admin user created successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
