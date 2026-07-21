import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string; pageSlug: string }> }
) {
  try {
    const { topicSlug, pageSlug } = await params;

    const topic = await prisma.docTopic.findUnique({
      where: { slug: topicSlug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const page = await prisma.docPage.findFirst({
      where: {
        topicId: topic.id,
        slug: pageSlug,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page, { status: 200, headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string; pageSlug: string }> }
) {
  try {
    const { topicSlug, pageSlug } = await params;
    const body = await request.json();

    const topic = await prisma.docTopic.findUnique({
      where: { slug: topicSlug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const existingPage = await prisma.docPage.findFirst({
      where: {
        topicId: topic.id,
        slug: pageSlug,
      },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const updatedPage = await prisma.docPage.update({
      where: { id: existingPage.id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        order: body.order,
      },
    });

    return NextResponse.json(updatedPage, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ topicSlug: string; pageSlug: string }> }
) {
  try {
    const { topicSlug, pageSlug } = await params;

    const topic = await prisma.docTopic.findUnique({
      where: { slug: topicSlug },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const page = await prisma.docPage.findFirst({
      where: {
        topicId: topic.id,
        slug: pageSlug,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    await prisma.docPage.delete({
      where: { id: page.id },
    });

    return NextResponse.json({ message: "Page deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
