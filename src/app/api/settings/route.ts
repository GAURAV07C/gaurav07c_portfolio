import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "global" }
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "global",
          heroWords: "[]",
          heroDesc: "",
          aboutMe: "",
          socialLinks: "[]",
          introductionWords: "[]",
          introductionText: "",
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Settings GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings", aboutMe: "", heroDesc: "", socialLinks: "[]", introductionWords: "[]", profileImage: "", resume: "" },
        { status: 500 }
      );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    let existing = await prisma.siteSettings.findUnique({
      where: { id: "global" }
    });

    if (!existing) {
      existing = await prisma.siteSettings.create({
        data: {
          id: "global",
          heroWords: "[]",
          heroDesc: "",
          aboutMe: "",
          socialLinks: "[]",
          introductionWords: "[]",
          introductionText: "",
        },
      });
    }

    const allowedFields = ["aboutMe", "socialLinks", "introductionWords", "profileImage", "heroWords", "heroDesc", "introductionText", "resume"];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: "global" },
      data: updateData,
    });

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
