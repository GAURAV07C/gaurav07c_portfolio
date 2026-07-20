"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

interface Project {
  id: string;
  company: string;
  year: string;
  title: string;
  image: string;
  techStack: string;
  skills?: { title: string }[];
}

interface RelatedProjectsProps {
  currentProjectId: string;
  currentSkills?: { title: string }[];
}

export function RelatedProjects({ currentProjectId, currentSkills = [] }: RelatedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        const allProjects = Array.isArray(data) ? data : [];
        
        let related = allProjects.filter((p: Project) => p.id !== currentProjectId);
        
        const currentSkillTitles = new Set(currentSkills.map(s => s.title));
        
        if (currentSkillTitles.size > 0) {
          related = related
            .map((p: Project) => {
              const projectSkills = (p.skills || []).map((s: { title: string }) => s.title);
              const matchingSkills = projectSkills.filter((s: string) => currentSkillTitles.has(s));
              return { ...p, matchCount: matchingSkills.length };
            })
            .filter((p: Project & { matchCount: number }) => p.matchCount > 0)
            .sort((a: Project & { matchCount: number }, b: Project & { matchCount: number }) => b.matchCount - a.matchCount);
        }
        
        const fallback = allProjects.filter((p: Project) => p.id !== currentProjectId).slice(0, 3);
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
      <div className="mt-20">
        <div className="text-xl font-serif text-white mb-6">Related Projects</div>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-white">Related Projects</h2>
        <Link
          href="/projects"
          className="text-emerald-300 hover:text-emerald-400 font-medium inline-flex items-center gap-2 transition-colors"
        >
          View All Projects
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group block bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-300/30 transition-all"
          >
            <div className="relative w-full h-48 overflow-hidden bg-gray-950">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <div className="p-5">
              <div className="text-xs text-emerald-300 font-mono mb-2">
                {project.company} &bull; {project.year}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                {project.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
