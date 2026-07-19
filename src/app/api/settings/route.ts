import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" }
    });
    return NextResponse.json(settings, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: body,
      create: {
        id: "global",
        ...body
      }
    });
    return NextResponse.json(updatedSettings, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
