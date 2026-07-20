import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api";


export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMessage = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
      }
    });
    return ok(newMessage, 201);
  } catch {
    return serverError("Failed to create message");
  }
}
