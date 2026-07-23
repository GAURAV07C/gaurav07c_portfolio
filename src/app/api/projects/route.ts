import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api";

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
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

    let baseSlug = (body.slug || body.title || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
    if (!baseSlug) {
      baseSlug = `project-${Date.now()}`;
    }

    const existing = await prisma.project.findFirst({
      where: { slug: { equals: baseSlug, mode: "insensitive" } },
      select: { id: true },
    });

    let slug = baseSlug;
    if (existing) {
      const suffix = Math.floor(Math.random() * 9000 + 1000);
      slug = `${baseSlug}-${suffix}`;
    }

    const newProject = await prisma.project.create({
      data: {
        company: body.company,
        year: body.year,
        title: body.title,
        slug,
        description: body.description || "",
        results: body.results || "",
        features: body.features || "",
        challenges: body.challenges || "",
        outcomes: body.outcomes || "",
        techStack: body.techStack || "",
        tags: body.tags || "",
        liveLink: body.liveLink,
        sourceLink: body.sourceLink,
        demoLink: body.demoLink,
        image: body.image || "/images/project.png",
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
  } catch (error) {
    console.error("POST /api/projects error:", error);
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const skillTitles = Array.isArray(body.skills) ? body.skills : [];
    const id = body.id || new URL(request.url).pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        company: body.company,
        year: body.year,
        title: body.title,
        slug: body.slug,
        description: body.description || "",
        results: body.results || "",
        features: body.features || "",
        challenges: body.challenges || "",
        outcomes: body.outcomes || "",
        techStack: body.techStack || "",
        tags: body.tags || "",
        liveLink: body.liveLink,
        sourceLink: body.sourceLink,
        demoLink: body.demoLink,
        image: body.image || "/images/project.png",
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
