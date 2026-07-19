import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hobbies = await prisma.hobby.findMany({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(hobbies, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch hobbies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hobby = await prisma.hobby.create({
      data: {
        title: body.title,
        emoji: body.emoji,
        left: body.left,
        top: body.top
      }
    });
    return NextResponse.json(hobby, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create hobby" }, { status: 500 });
  }
}
