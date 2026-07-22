"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import CheakCircleIcon from "@/assets/icons/check-circle.svg";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { useCachedFetch } from "@/hooks/useCachedFetch";

export const ProjectsSection = () => {
  const { data: projects = [] } = useCachedFetch<{ id: string; company: string; year: string; title: string; results: string; techStack: string; liveLink?: string; sourceLink?: string; demoLink?: string; image: string; description?: string; isRecent?: boolean; slug?: string }[]>({
    key: "projects",
    fetchFn: () => fetch("/api/projects").then(res => res.json()),
  });

  const recent = Array.isArray(projects) ? projects.filter((p) => p.isRecent === true) : [];
  const displayProjects = recent.length > 0 ? recent : (Array.isArray(projects) ? projects.slice(0, 3) : []);

  if (displayProjects.length === 0) {
    return null;
  }

  return (
    <section id="project" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Real-world Results"
          title="My Recent work"
          description="See how I transform concepts into engaging digital experiences."
        />

        <motion.div
          whileHover={{
            scale: 1.1,
          }}
          className="flex flex-col mt-10 md:mt-20 gap-10 md:gap-16"
        >
          {displayProjects.map((project, index) => (
            <div
              key={project.id}
              className="md:sticky"
              style={{
                top: `calc(64px + ${index * 20}px)`,
              }}
            >
              <Link href={`/project/${project.slug || project.id}`} className="block">
                <Card className="overflow-hidden cursor-pointer hover:border-emerald-300/30 transition-all group">
                  <div className="lg:grid lg:grid-cols-2 gap-0">
                    <div className="p-6 md:p-8 lg:p-10 lg:py-12 flex flex-col justify-center">
                      <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-xs md:text-sm text-transparent bg-clip-text">
                        <span>{project.company}</span>
                        <span>&bull;</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="font-serif text-xl md:text-2xl mt-2 md:mt-4">
                        {project.title}
                      </h3>
                      <ul className="flex flex-col gap-3 mt-4 md:mt-5">
                        {(Array.isArray(project.results) ? project.results : JSON.parse(project.results || "[]")).map((result: string | { title?: string }, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-white/50">
                            <CheakCircleIcon className="size-4 md:size-5 shrink-0 mt-0.5" />
                            <span> {typeof result === "string" ? result : result.title ?? ""}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                          <span>View Project</span>
                          <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        {project.demoLink && (
                          <Link
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-emerald-300 border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
                          >
                            ▶ Watch Demo
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="relative min-h-[240px] md:min-h-[320px] lg:min-h-0">
                      {project.image && (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent lg:block hidden" />
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-white text-gray-950 font-semibold px-6 h-10 rounded-lg hover:bg-white/80 transition-colors text-sm"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};
