import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized - no token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: token.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: token.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    const updateData: { email?: string; password?: string } = {};

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, NOT: { id: token.id } },
      });
      if (existingUser) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
      updateData.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }
      if (user.password !== currentPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      updateData.password = newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: token.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Account updated successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
