import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const { topicSlug } = await params;
    const body = await request.json();

    const topic = await prisma.docTopic.findUnique({
      where: { slug: topicSlug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const page = await prisma.docPage.create({
      data: {
        topicId: topic.id,
        title: body.title,
        slug: body.slug,
        content: body.content || "",
        order: body.order || 0,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
