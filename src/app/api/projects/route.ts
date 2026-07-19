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
        results: body.results,
        techStack: body.techStack,
        liveLink: body.liveLink,
        sourceLink: body.sourceLink,
        demoLink: body.demoLink,
        image: body.image,
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
    const { id, skills, ...updateData } = body;
    const skillTitles = Array.isArray(skills) ? skills : [];

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
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
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
