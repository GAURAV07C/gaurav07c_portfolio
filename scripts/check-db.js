const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.project.findMany({ 
  select: { id: true, title: true, description: true, results: true } 
})
.then(projects => { 
  console.log(JSON.stringify(projects, null, 2)); 
  return prisma.$disconnect();
})
.catch(err => { 
  console.error(err); 
  process.exit(1); 
});
