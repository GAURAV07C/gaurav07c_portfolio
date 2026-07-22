import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrg, getRepo } from "@/lib/opensource-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string }> }) {
  try {
    const { idOrSlug, repoIdOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    const repo = await getRepo(org.id, repoIdOrSlug);
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    const contributions = await prisma.openSource.findMany({ where: { repoId: repo.id }, orderBy: { date: "desc" } });
    return NextResponse.json({ org, repo, contributions });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string }> }) {
  try {
    const { idOrSlug, repoIdOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    const repo = await getRepo(org.id, repoIdOrSlug);
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    const body = await request.json();
    const updated = await prisma.repository.update({
      where: { id: repo.id },
      data: { name: body.name, slug: body.slug, url: body.url, description: body.description, image: body.image || null },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string }> }) {
  try {
    const { idOrSlug, repoIdOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    const repo = await getRepo(org.id, repoIdOrSlug);
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    await prisma.repository.delete({ where: { id: repo.id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
