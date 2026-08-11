import prisma from '../lib/prisma';

async function main() {
  console.log('Fetching database stats...');
  const total = await prisma.membershipApplication.count();
  console.log('Total applications in database:', total);
  
  const statusGroups = await prisma.membershipApplication.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  });
  console.log('Status groups breakdown:', statusGroups);

  const recent = await prisma.membershipApplication.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      status: true
    }
  });
  console.log('Recent 5 applications:');
  recent.forEach((app) => {
    console.log(`- [${app.status}] ID: ${app.id}, Name: ${app.firstName} ${app.lastName}, Date: ${app.createdAt.toISOString()}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
