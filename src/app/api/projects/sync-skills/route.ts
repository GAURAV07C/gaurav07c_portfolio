import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const projects = await prisma.project.findMany();
    const skills = await prisma.skill.findMany();
    const existingSkills = new Set(skills.map(s => s.title));

    for (const project of projects) {
      if (project.techStack) {
        try {
          const techStack = JSON.parse(project.techStack);
          for (const tech of techStack) {
            if (tech.title && !existingSkills.has(tech.title)) {
              await prisma.skill.create({
                data: { title: tech.title, iconsType: "JavaScript" }
              });
              existingSkills.add(tech.title);
            }
          }
        } catch (e) {
          console.error("Failed to parse tech stack for project:", project.id, e);
        }
      }
    }

    return NextResponse.json({ message: "Skills synced successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to sync skills" }, { status: 500 });
  }
}
