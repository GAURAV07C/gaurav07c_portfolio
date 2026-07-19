import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const education = await prisma.education.update({
      where: { id },
      data: {
        school: body.school,
        href: body.href,
        degree: body.degree,
        logoUrl: body.logoUrl,
        start: body.start,
        end: body.end
      }
    });
    return NextResponse.json(education, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.education.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Education deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
