"use client";

import { useCachedFetch } from "@/hooks/useCachedFetch";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

interface Project {
  id: string;
  title: string;
  image: string;
  company: string;
  year: string;
}

export const RecentProjects = () => {
  const { data: projectsRaw = [] } = useCachedFetch<Project[]>({
    key: "projects",
    fetchFn: () => fetch("/api/projects").then(res => res.json()),
  });
  const projects = Array.isArray(projectsRaw) ? projectsRaw.slice(0, 3) : [];

  return (
    <section className="py-16 lg:py-24">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <SectionHeader
          eyebrow="Portfolio"
          title="Recent Projects"
          description="A selection of my latest work and experiments."
        />

        {projects.length === 0 ? (
          <div className="text-center text-white/40 py-16">
            <p className="text-lg">No projects yet</p>
            <p className="text-sm mt-2">Check back soon for new work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 md:mt-16">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects`}
                className="group block bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-300/30 transition-all"
              >
                <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-950">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-emerald-300 font-mono mb-2">
                    {project.company} &bull; {project.year}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-white text-gray-950 font-semibold px-8 h-12 rounded-xl hover:bg-white/80 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
