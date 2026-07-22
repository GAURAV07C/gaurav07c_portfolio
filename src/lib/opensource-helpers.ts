import { prisma } from "@/lib/prisma";

export function getOrg(idOrSlug: string) {
  if (!idOrSlug) return Promise.resolve(null);
  if (idOrSlug.startsWith("cm")) {
    return prisma.organisation.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.organisation.findUnique({ where: { slug: idOrSlug } });
}

export function getRepo(orgId: string, idOrSlug: string) {
  if (!idOrSlug) return Promise.resolve(null);
  if (idOrSlug.startsWith("cm")) {
    return prisma.repository.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.repository.findFirst({ where: { organisationId: orgId, slug: idOrSlug } });
}

export function getContribution(idOrSlug: string) {
  if (!idOrSlug) return Promise.resolve(null);
  if (idOrSlug.startsWith("cm")) {
    return prisma.openSource.findUnique({ where: { id: idOrSlug }, include: { repo: true } });
  }
  return prisma.openSource.findUnique({ where: { slug: idOrSlug }, include: { repo: true } });
}
