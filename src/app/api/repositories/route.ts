import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.repository.create({
      data: {
        organisationId: body.organisationId,
        name: body.name,
        slug: body.slug,
        url: body.url,
        description: body.description,
        image: body.image || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
