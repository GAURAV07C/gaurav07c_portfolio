import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getOrg(idOrSlug: string) {
  if (!idOrSlug) return Promise.resolve(null);
  if (idOrSlug.startsWith("cm")) {
    return prisma.organisation.findUnique({ where: { id: idOrSlug } });
  }
  return prisma.organisation.findUnique({ where: { slug: idOrSlug } });
}

export async function GET(_request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const repos = await prisma.repository.findMany({ where: { organisationId: org.id }, orderBy: { name: "asc" } });
    return NextResponse.json(repos);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Organisation not found" }, { status: 404 });
    const body = await request.json();
    if (!body.name || !body.name.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const baseSlug = body.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
    let slug = (body.slug && body.slug.trim()) || baseSlug;
    while (await prisma.repository.count({ where: { organisationId: org.id, slug } })) {
      const i = (parseInt(slug.split("-").pop() || "0", 10) || 0) + 1;
      slug = `${baseSlug}-${i}`;
    }
    const repo = await prisma.repository.create({
      data: { organisationId: org.id, name: body.name.trim(), slug, url: body.url, description: body.description || "", image: body.image || null },
    });
    return NextResponse.json(repo, { status: 201 });
  } catch (error) {
    console.error("POST repositories error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
