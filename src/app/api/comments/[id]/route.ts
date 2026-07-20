import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { replies: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await prisma.comment.deleteMany({
      where: { parentId: id },
    });

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
