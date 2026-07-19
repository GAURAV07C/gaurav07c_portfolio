"use client";

import { useEffect, useState } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

interface Project {
  id: string;
  title: string;
  image: string;
  company: string;
  year: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10">
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Home</span>
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">All Projects</h1>
          <p className="text-white/60 text-lg mb-12">
            Explore my recent work and side projects.
          </p>

          {loading ? (
            <div className="text-center text-white/50">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-white/50 py-20">
              <p className="text-xl mb-2">No projects yet</p>
              <p className="text-sm">Check back soon for new work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
