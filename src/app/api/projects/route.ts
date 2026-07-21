import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { year: 'desc' },
      include: { skills: true }
    });
    return NextResponse.json(projects, { status: 200, headers: CACHE_HEADERS });
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
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: body.description || "",
        results: body.results || "[]",
        features: body.features || "[]",
        challenges: body.challenges || "[]",
        outcomes: body.outcomes || "[]",
        techStack: body.techStack || "[]",
        tags: body.tags || "[]",
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

    return ok(newProject, 201);
  } catch {
    return serverError("Failed to create project");
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
        slug: body.slug,
        description: body.description || "",
        results: body.results || "[]",
        techStack: body.techStack || "[]",
        tags: body.tags || "[]",
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

    return ok(updatedProject, 200);
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return serverError("Failed to update project");
  }
}
