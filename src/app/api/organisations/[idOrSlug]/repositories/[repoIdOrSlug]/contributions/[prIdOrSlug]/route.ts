import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContribution } from "@/lib/opensource-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string; prIdOrSlug: string }> }) {
  try {
    const { prIdOrSlug } = await params;
    const item = await getContribution(prIdOrSlug);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string; prIdOrSlug: string }> }) {
  try {
    const { prIdOrSlug } = await params;
    const item = await getContribution(prIdOrSlug);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    const updated = await prisma.openSource.update({
      where: { id: item.id },
      data: { title: body.title, description: body.description, repoUrl: body.repoUrl, prUrl: body.prUrl, type: body.type, techStack: body.techStack, date: body.date, status: body.status, image: body.image || null },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ idOrSlug: string; repoIdOrSlug: string; prIdOrSlug: string }> }) {
  try {
    const { prIdOrSlug } = await params;
    const item = await getContribution(prIdOrSlug);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.openSource.delete({ where: { id: item.id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
