import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const hobby = await prisma.hobby.update({
      where: { id },
      data: {
        title: body.title,
        emoji: body.emoji,
        left: body.left,
        top: body.top
      }
    });
    return NextResponse.json(hobby, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update hobby" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.hobby.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Hobby deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete hobby" }, { status: 500 });
  }
}
