import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const { topicSlug } = await params;
    const topic = await prisma.docTopic.findUnique({
      where: { slug: topicSlug },
      include: {
        pages: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic, { status: 200, headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const { topicSlug } = await params;
    const body = await request.json();

    const updatedTopic = await prisma.docTopic.update({
      where: { slug: topicSlug },
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order,
      },
    });

    return NextResponse.json(updatedTopic, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const { topicSlug } = await params;
    await prisma.docTopic.delete({
      where: { slug: topicSlug },
    });
    return NextResponse.json({ message: "Topic deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
