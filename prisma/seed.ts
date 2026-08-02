import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  if (!adminEmail || !adminPassword) {
    console.warn('Skipping admin user seed: ADMIN_EMAIL or ADMIN_PASSWORD is not set.');
    return;
  }

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists. Skipping.`);
    return;
  }

  // Hash the password securely
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  // Create the super admin
  const admin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      fullName: adminName,
      passwordHash: passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Successfully created SUPER_ADMIN user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
