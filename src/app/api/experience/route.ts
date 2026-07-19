import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { start: "desc" }
    });
    return NextResponse.json(experiences, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        href: body.href,
        badges: body.badges || JSON.stringify([]),
        location: body.location,
        title: body.title,
        logoUrl: body.logoUrl,
        start: body.start,
        end: body.end,
        description: body.description
      }
    });
    return NextResponse.json(experience, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
