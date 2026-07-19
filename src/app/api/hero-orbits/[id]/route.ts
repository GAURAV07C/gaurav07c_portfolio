import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const orbit = await prisma.heroOrbit.update({
      where: { id },
      data: {
        size: body.size,
        rotation: body.rotation,
        spinDuration: body.spinDuration,
        starType: body.starType,
        starDuration: body.starDuration,
        className: body.className
      }
    });
    return NextResponse.json(orbit, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update hero orbit" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.heroOrbit.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Hero orbit deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete hero orbit" }, { status: 500 });
  }
}
