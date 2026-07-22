import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ orgSlug: string }> }) {
  try {
    const { orgSlug } = await params;
    const org = await prisma.organisation.findUnique({
      where: { slug: orgSlug },
      include: { repos: true },
    });
    if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
