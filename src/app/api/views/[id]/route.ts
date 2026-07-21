import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (type === "blog") {
      const blog = await prisma.blog.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      return NextResponse.json({ views: blog.views });
    } else if (type === "project") {
      const project = await prisma.project.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      return NextResponse.json({ views: project.views });
    } else if (type === "doc") {
      const docPage = await prisma.docPage.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      return NextResponse.json({ views: docPage.views });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to increment view" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "blog") {
      const blog = await prisma.blog.findUnique({
        where: { id },
        select: { views: true },
      });
      return NextResponse.json({ views: blog?.views || 0 });
    } else if (type === "project") {
      const project = await prisma.project.findUnique({
        where: { id },
        select: { views: true },
      });
      return NextResponse.json({ views: project?.views || 0 });
    } else if (type === "doc") {
      const docPage = await prisma.docPage.findUnique({
        where: { id },
        select: { views: true },
      });
      return NextResponse.json({ views: docPage?.views || 0 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
  }
}
