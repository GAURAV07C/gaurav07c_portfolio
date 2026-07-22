import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ orgSlug: string; repoSlug: string }> }) {
  try {
    const { orgSlug, repoSlug } = await params;
    const org = await prisma.organisation.findUnique({ where: { slug: orgSlug } });
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });

    const repo = await prisma.repository.findFirst({ where: { organisationId: org.id, slug: repoSlug } });
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });

    const contributions = await prisma.openSource.findMany({
      where: { repoId: repo.id },
      include: { repo: { include: { organisation: true } } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ org, repo, contributions: contributions.filter(c => c.repo) });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
