import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ orgSlug: string; repoSlug: string; prSlug: string }> }) {
  try {
    const { orgSlug, repoSlug, prSlug } = await params;
    const org = await prisma.organisation.findUnique({ where: { slug: orgSlug } });
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });

    const repo = await prisma.repository.findFirst({ where: { organisationId: org.id, slug: repoSlug } });
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });

    const contribution = await prisma.openSource.findUnique({
      where: { slug: prSlug },
      include: { repo: { include: { organisation: true } } },
    });

    if (!contribution || !contribution.repo) {
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 });
    }

    return NextResponse.json(contribution);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
