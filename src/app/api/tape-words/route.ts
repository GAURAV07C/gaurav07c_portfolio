import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const words = await prisma.tapeWord.findMany({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(words, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch words" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const word = await prisma.tapeWord.create({
      data: { word: body.word }
    });
    return NextResponse.json(word, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create word" }, { status: 500 });
  }
}
