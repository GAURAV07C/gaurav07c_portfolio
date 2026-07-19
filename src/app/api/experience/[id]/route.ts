import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company: body.company,
        href: body.href,
        badges: body.badges || JSON.stringify([]),
        location: body.location,
        title: body.title,
        logoUrl: body.logoUrl,
        start: body.start,
        end: body.end,
        description: body.description
      }
    });
    return NextResponse.json(experience, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Experience deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
