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
    return NextResponse.json(contributions);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string }> }) {
  try {
    const { idOrSlug, repoIdOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    const repo = await getRepo(org.id, repoIdOrSlug);
    if (!repo) return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    const body = await request.json();
    if (!body.title || !body.title.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const baseSlug = body.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
    let slug = (body.slug && body.slug.trim()) || baseSlug;
    while (await prisma.openSource.count({ where: { slug } })) {
      const i = (parseInt(slug.split("-").pop() || "0", 10) || 0) + 1;
      slug = `${baseSlug}-${i}`;
    }
    const contribution = await prisma.openSource.create({
      data: {
        repoId: repo.id,
        organisation: org.slug,
        title: body.title.trim(),
        slug,
        description: body.description || "",
        repoUrl: body.repoUrl || repo.url,
        prUrl: body.prUrl || "",
        type: body.type || "feature",
        techStack: body.techStack || "[]",
        date: body.date || new Date().toISOString().split("T")[0],
        status: body.status || "merged",
        image: body.image || null,
      },
    });
    return NextResponse.json(contribution, { status: 201 });
  } catch (error) {
    console.error("POST contributions error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
