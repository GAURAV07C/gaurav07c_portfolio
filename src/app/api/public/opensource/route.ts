import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orgs = await prisma.organisation.findMany({
      include: {
        repos: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(orgs);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
