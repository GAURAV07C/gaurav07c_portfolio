"use client";

import { useEffect, useState } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";

import BlurFade from "@/components/BlurFade";
import { ArrowLeft, ArrowUpRightIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  image: string;
  company: string;
  year: string;
  results: string;
  techStack: string;
  liveLink?: string;
  sourceLink?: string;
  demoLink?: string;
  slug?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects", { next: { revalidate: 3600 } })
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10">
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">All Projects</h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Explore my recent work and side projects. Each project represents a unique challenge and learning experience.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white/50 py-20">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-white/50 py-20">
              <p className="text-xl mb-2">No projects yet</p>
              <p className="text-sm">Check back soon for new work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {projects.map((project, index) => {
                const projectSlug = project.slug || project.id;
                return (
                  <BlurFade key={project.id} delay={index * 0.05}>
                    <Link href={`/project/${projectSlug}`} className="group block h-full">
                      <div className="h-full bg-gray-900 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-300/30 transition-all duration-300">
                        <div className="lg:grid lg:grid-cols-2 gap-0">
                          <div className="p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                                {project.company}
                              </span>
                              <span className="text-white/20">•</span>
                              <span className="text-xs text-white/40">{project.year}</span>
                            </div>

                            <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors mb-3">
                              {project.title}
                            </h3>

                            <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(project.results || "[]");
                                  return Array.isArray(parsed) && parsed[0]?.title ? parsed[0].title : "";
                                } catch {
                                  return "";
                                }
                              })()}
                            </p>

                            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                              <span>View Project</span>
                              <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                          <div className="relative min-h-[220px] md:min-h-[260px]">
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
                      </div>
                    </Link>
                  </BlurFade>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
