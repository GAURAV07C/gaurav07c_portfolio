const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const education = await prisma.education.findMany();
  console.log("Education data:", JSON.stringify(education, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
