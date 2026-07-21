import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { ProjectPageClient } from "./pageClient";

export const revalidate = 60;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true, id: true },
  });

  return projects.map((project) => ({
    id: project.slug || project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Project`,
    description: project.description || `Project by ${project.company}`,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: { skills: true },
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-4xl">
            <div className="text-center text-red-400">Project not found</div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 transition-colors mt-4"
            >
              <ArrowLeft className="size-4 rotate-180" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const backHref = `/projects`;
  const backLabel = "Back to Projects";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <ProjectPageClient project={{
        id: project.id,
        company: project.company,
        year: project.year,
        title: project.title,
        image: project.image,
        tags: project.tags,
        description: project.description,
        results: project.results,
        features: project.features,
        challenges: project.challenges,
        outcomes: project.outcomes,
        techStack: project.techStack,
        tagsField: project.tags,
        skills: project.skills,
        liveLink: project.liveLink,
        sourceLink: project.sourceLink,
        demoLink: project.demoLink,
      }} />
      <Footer />
    </div>
  );
}
