import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topics = await prisma.docTopic.findMany({
      orderBy: { order: "asc" },
      include: {
        pages: {
          orderBy: { order: "asc" },
        },
      },
    });
    return NextResponse.json(topics, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doc topics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = await prisma.docTopic.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || "",
        icon: body.icon || "",
        order: body.order || 0,
      },
    });
    return NextResponse.json(topic, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create doc topic" }, { status: 500 });
  }
}
