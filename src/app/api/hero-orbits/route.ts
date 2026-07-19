import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orbits = await prisma.heroOrbit.findMany({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(orbits, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero orbits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orbit = await prisma.heroOrbit.create({
      data: {
        size: body.size,
        rotation: body.rotation,
        spinDuration: body.spinDuration,
        starType: body.starType,
        starDuration: body.starDuration,
        className: body.className
      }
    });
    return NextResponse.json(orbit, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create hero orbit" }, { status: 500 });
  }
}
