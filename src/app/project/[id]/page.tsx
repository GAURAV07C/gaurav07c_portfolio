"use client";

import React, { useEffect, useState, use } from "react";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import SourceIcon from "@/assets/icons/source.svg";
import GithubIcon from "@/assets/icons/github.svg";

interface Project {
  description: string;
  id: string;
  company: string;
  year: string;
  title: string;
  results: string;
  techStack: string;
  liveLink?: string;
  sourceLink?: string;
  demoLink?: string;
  image: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backHref, setBackHref] = useState("/#project");
  const [backLabel, setBackLabel] = useState("Back to Projects");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setProject(data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const all = Array.isArray(data) ? data : [];
        const filtered = all.filter((p: Project) => p.id !== resolvedParams.id);
        setRecentProjects(filtered.slice(0, 3));
      } catch {
        // ignore
      }
    };

    const determineBackLink = () => {
      if (typeof window !== "undefined") {
        const referrer = document.referrer;
        const searchParams = new URLSearchParams(window.location.search);
        const fromParam = searchParams.get("from");

        if (fromParam === "admin" || referrer.includes("/admin")) {
          setBackHref("/admin");
          setBackLabel("Back to Dashboard");
          return;
        }

        if (referrer.includes("/projects")) {
          setBackHref("/projects");
          setBackLabel("Back to Projects");
          return;
        }
      }

      setBackHref("/#project");
      setBackLabel("Back to Projects");
    };

    fetchProject();
    fetchRecent();
    determineBackLink();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-4xl">
            <div className="text-center text-white/50">Loading project...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-4xl">
            <div className="text-center text-red-400">{error || "Project not found"}</div>
            <Link href="/#project" className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 transition-colors mt-4">
              <ArrowLeft className="size-4 rotate-180" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const results = (() => {
    if (!project.results) return [];
    const trimmed = project.results.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.includes("title")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fall through
      }
    }
    return trimmed.split("\n").filter(line => line.trim());
  })();

  const techStack = (() => {
    try {
      return JSON.parse(project.techStack || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-4xl">
          <Link href={backHref} className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10">
            <ArrowLeft className="size-4 rotate-180" />
            <span>{backLabel}</span>
          </Link>

          <article>
            <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text mb-4">
              <span>{project.company}</span>
              <span>&bull;</span>
              <span>{project.year}</span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              {project.title}
            </h1>

            {project.image && (
              <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {project.description && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-white mb-6">Description</h2>
                <MarkdownPreview content={project.description} className="text-white/70 text-lg leading-relaxed" />
              </div>
            )}

            {results.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-white mb-6">Key Results</h2>
                <MarkdownPreview content={project.results} className="text-white/70 text-lg leading-relaxed" />
              </div>
            )}

            {techStack.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-white mb-6">Tech Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech: { title: string }, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-lg font-semibold font-mono px-4 py-2 text-sm outline outline-2 outline-white/10 text-black bg-white tracking-wider"
                    >
                      {tech.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {project.liveLink && (
                <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
                    <SourceIcon className="size-4" />
                    <span>Live</span>
                  </button>
                </Link>
              )}
              {project.sourceLink && (
                <Link href={project.sourceLink} target="_blank" rel="noopener noreferrer">
                  <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
                    <GithubIcon className="size-4" />
                    <span>Source</span>
                  </button>
                </Link>
              )}
              {project.demoLink && (
                <Link href={project.demoLink} target="_blank" rel="noopener noreferrer">
                  <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
                    <SourceIcon className="size-4" />
                    <span>Demo</span>
                  </button>
                </Link>
              )}
            </div>
          </article>

          {recentProjects.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif text-white">Recent Work</h2>
                <Link
                  href="/projects"
                  className="text-emerald-300 hover:text-emerald-400 font-medium inline-flex items-center gap-2 transition-colors"
                >
                  View All Projects
                  <ArrowLeft className="size-4 rotate-180" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentProjects.map((recentProject) => (
                  <Link
                    key={recentProject.id}
                    href={`/project/${recentProject.id}?from=${backHref === "/admin" ? "admin" : "home"}`}
                    className="group block bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-300/30 transition-all"
                  >
                    <div className="relative w-full h-48 overflow-hidden bg-gray-950">
                      {recentProject.image && (
                        <Image
                          src={recentProject.image}
                          alt={recentProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-emerald-300 font-mono mb-2">
                        {recentProject.company} &bull; {recentProject.year}
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {recentProject.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
