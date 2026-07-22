const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const org = await prisma.organisation.findFirst();
  console.log(org ? "org_exists" : "no_org");
  await prisma.$disconnect();
})();
