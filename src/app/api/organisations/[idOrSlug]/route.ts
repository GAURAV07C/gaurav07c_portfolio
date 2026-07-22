import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrg } from "@/lib/opensource-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const orgWithRepos = await prisma.organisation.findUnique({ where: { id: org.id }, include: { repos: true } });
    return NextResponse.json(orgWithRepos);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    const updated = await prisma.organisation.update({
      where: { id: org.id },
      data: { name: body.name, description: body.description, image: body.image || null },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const org = await getOrg(idOrSlug);
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.organisation.delete({ where: { id: org.id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
