import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.organisation.findMany({
      include: { repos: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const baseSlug = body.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
    let slug = (body.slug && body.slug.trim()) || baseSlug;
    const existing = await prisma.organisation.count({ where: { slug } });
    if (existing > 0) {
      let i = 1;
      while (await prisma.organisation.count({ where: { slug: `${slug}-${i}` } })) {
        i++;
      }
      slug = `${slug}-${i}`;
    }
    const item = await prisma.organisation.create({
      data: {
        name: body.name.trim(),
        slug,
        description: body.description || "",
        image: body.image || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/organisations error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
