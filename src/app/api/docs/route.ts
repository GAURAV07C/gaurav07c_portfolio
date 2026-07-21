import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
};

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
    return NextResponse.json(topics, { status: 200, headers: CACHE_HEADERS });
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
