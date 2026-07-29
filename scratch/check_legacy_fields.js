const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const apps = await prisma.membershipApplication.findMany({
    where: {
      OR: [
        { identityDocumentUrl: { not: null } },
        { supportingDocumentUrl: { not: null } },
        { profilePhotoUrl: { not: null } }
      ]
    }
  });
  console.log('Applications with non-null legacy document URL fields:', JSON.stringify(apps, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
