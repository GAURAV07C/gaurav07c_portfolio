import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { start: "desc" }
    });
    return NextResponse.json(education, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const education = await prisma.education.create({
      data: {
        school: body.school,
        href: body.href,
        degree: body.degree,
        logoUrl: body.logoUrl,
        start: body.start,
        end: body.end
      }
    });
    return NextResponse.json(education, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}
