import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ prSlug: string }> }) {
  try {
    const { prSlug } = await params;
    const item = await prisma.openSource.findUnique({
      where: { slug: prSlug },
      include: { repo: true },
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ prSlug: string }> }) {
  try {
    const { prSlug } = await params;
    const body = await request.json();
    const item = await prisma.openSource.update({
      where: { slug: prSlug },
      data: {
        title: body.title,
        description: body.description,
        repoUrl: body.repoUrl,
        prUrl: body.prUrl,
        type: body.type,
        techStack: body.techStack,
        date: body.date,
        status: body.status,
        image: body.image || null,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ prSlug: string }> }) {
  try {
    const { prSlug } = await params;
    await prisma.openSource.delete({ where: { slug: prSlug } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
