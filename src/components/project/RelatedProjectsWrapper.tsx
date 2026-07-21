"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { ViewCount } from "@/components/common/ViewCount";

interface RelatedProjectsWrapperProps {
  currentProjectId: string;
  currentSkills?: { title: string }[];
}

interface RelatedProject {
  id: string;
  company: string;
  year: string;
  title: string;
  image: string;
  slug?: string;
  views?: number;
}

export function RelatedProjectsWrapper({ currentProjectId, currentSkills = [] }: RelatedProjectsWrapperProps) {
  const [projects, setProjects] = useState<RelatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        const allProjects = Array.isArray(data) ? data : [];

        let related = allProjects.filter((p: { id: string }) => p.id !== currentProjectId);

        const currentSkillTitles = new Set(currentSkills.map((s) => s.title));

        if (currentSkillTitles.size > 0) {
          related = related
            .map((p: { id: string; skills?: { title: string }[] }) => {
              const projectSkills = (p.skills || []).map((s: { title: string }) => s.title);
              const matchingSkills = projectSkills.filter((s: string) => currentSkillTitles.has(s));
              return { ...p, matchCount: matchingSkills.length };
            })
            .filter((p: { matchCount?: number }) => (p.matchCount || 0) > 0)
            .sort((a: { matchCount?: number }, b: { matchCount?: number }) => (b.matchCount || 0) - (a.matchCount || 0));
        }

        const fallback = allProjects
          .filter((p: { id: string }) => p.id !== currentProjectId)
          .slice(0, 3);
        const display = related.length > 0 ? related.slice(0, 3) : fallback;

        setProjects(display);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentProjectId, currentSkills]);

  if (loading) {
    return (
      <div className="mt-24">
        <div className="text-2xl font-serif text-white mb-8">Related Projects</div>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mt-24">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-white">Related Projects</h2>
        <Link
          href="/projects"
          className="text-emerald-300 hover:text-emerald-400 font-medium inline-flex items-center gap-2 transition-colors text-sm"
        >
          View All Projects
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {projects.map((project) => {
          const projectSlug = project.slug || project.id;
          return (
            <Link
              key={project.id}
              href={`/project/${projectSlug}`}
              className="group block h-full"
            >
              <div className="h-full bg-[#0a111f] border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-300/40 transition-all duration-300">
                <div className="md:grid md:grid-cols-2 gap-0">
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

                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <ViewCount id={project.id} type="project" />
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
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a111f]/60 to-transparent md:block hidden" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
