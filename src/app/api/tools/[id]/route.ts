import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        title: body.title,
        iconName: body.iconName
      }
    });
    return NextResponse.json(tool, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.tool.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Tool deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
  }
}
