import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(tools, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tool = await prisma.tool.create({
      data: {
        title: body.title,
        iconName: body.iconName
      }
    });
    return NextResponse.json(tool, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
  }
}
