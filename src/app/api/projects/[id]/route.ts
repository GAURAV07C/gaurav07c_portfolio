import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const skillTitles = Array.isArray(body.skills) ? body.skills : [];
    
    const updatedProject = await prisma.project.update({
      where: { id },
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
