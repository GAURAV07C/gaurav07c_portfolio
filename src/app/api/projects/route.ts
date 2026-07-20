import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { year: 'desc' }
    });
    return NextResponse.json(projects, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const skillTitles = Array.isArray(body.skills) ? body.skills : [];

    const newProject = await prisma.project.create({
      data: {
        company: body.company,
        year: body.year,
        title: body.title,
        description: body.description || "",
        results: body.results || "[]",
        features: body.features || "[]",
        challenges: body.challenges || "[]",
        outcomes: body.outcomes || "[]",
        techStack: body.techStack || "[]",
        liveLink: body.liveLink,
        sourceLink: body.sourceLink,
        demoLink: body.demoLink,
        image: body.image,
        isRecent: body.isRecent === true || body.isRecent === "true",
        skills: {
          connectOrCreate: skillTitles.map((title: string) => ({
            where: { title },
            create: { title, iconsType: "JavaScript" }
          }))
        }
      },
      include: { skills: true }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const skillTitles = Array.isArray(body.skills) ? body.skills : [];
    
    const updatedProject = await prisma.project.update({
      where: { id: body.id },
      data: {
        company: body.company,
        year: body.year,
        title: body.title,
        description: body.description || "",
        results: body.results || "[]",
        techStack: body.techStack || "[]",
        liveLink: body.liveLink,
        sourceLink: body.sourceLink,
        demoLink: body.demoLink,
        image: body.image,
        isRecent: body.isRecent === true || body.isRecent === "true",
        skills: {
          set: [],
          connectOrCreate: skillTitles.map((title: string) => ({
            where: { title },
            create: { title, iconsType: "JavaScript" }
          }))
        }
      },
      include: { skills: true }
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
