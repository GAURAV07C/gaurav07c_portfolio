import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const word = await prisma.tapeWord.update({
      where: { id },
      data: { word: body.word }
    });
    return NextResponse.json(word, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update word" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.tapeWord.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Word deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete word" }, { status: 500 });
  }
}
