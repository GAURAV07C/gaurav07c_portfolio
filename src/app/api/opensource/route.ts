import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.openSource.create({
      data: {
        repoId: body.repoId,
        organisation: body.organisation,
        title: body.title,
        slug: body.slug,
        description: body.description,
        repoUrl: body.repoUrl,
        prUrl: body.prUrl,
        type: body.type,
        techStack: body.techStack || "[]",
        date: body.date,
        status: body.status,
        image: body.image || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
