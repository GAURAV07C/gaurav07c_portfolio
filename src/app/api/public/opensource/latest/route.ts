import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contributions = await prisma.openSource.findMany({
      where: { repoId: { not: null } },
      include: { repo: { include: { organisation: true } } },
      orderBy: { date: "desc" },
      take: 3,
    });
    return NextResponse.json(contributions.filter(c => c.repo));
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
