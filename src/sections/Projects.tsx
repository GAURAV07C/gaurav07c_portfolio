"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import CheakCircleIcon from "@/assets/icons/check-circle.svg";
import SourceIcon from "@/assets/icons/source.svg";
import GithubIcon from "@/assets/icons/github.svg";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { useEffect, useState } from "react";

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<{ id: string; company: string; year: string; title: string; results: string; techStack: string; liveLink?: string; sourceLink?: string; demoLink?: string; image: string }[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    <section id="project" className="pb-16 lg:py-24">
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
          className="flex flex-col mt-10 md:mt-20 gap-20 "
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="md:sticky"
              style={{
                top: `calc(64px + ${index * 20}px)`,
              }}
            >
              <Card className="px-8 pt-8 md:pt-12 md:px-12 lg:pt-16 lg:px-20 ">
                <div className="lg:grid lg:grid-cols-2 gap-16">
                  <div className="lg:pb-16">
                    <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-serif text-2xl mt-2 md:mt-5 md:text-4xl">
                      {project.title}
                    </h3>
                    <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                    <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                      {JSON.parse(project.results || "[]").map((result: { title: string }, i: number) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm md:text-base text-white/50"
                        >
                          <CheakCircleIcon className="size-5 md:size-6" />
                          <span> {result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-5">
                      {JSON.parse(project.techStack || "[]").map((tech: { title: string }, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-lg font-semibold font-mono px-2 py-1 text-xs md:text-sm outline outline-2 outline-white/10 text-black bg-white tracking-wider"
                        >
                          {tech.title}
                        </span>
                      ))}
                    </div>
                    <div className="mt-10 flex flex-wrap gap-4 py-7 -ml-5 sm:-ml-0">
                      {project.liveLink && (
                        <div className="">
                          <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80">
                              <SourceIcon className="size-4" />
                              <span>Live</span>
                            </button>
                          </Link>
                        </div>
                      )}
                      {project.sourceLink && (
                        <div>
                          <Link href={project.sourceLink} target="_blank" rel="noopener noreferrer">
                            <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80">
                              <GithubIcon className="size-4" />
                              <span>Source</span>
                            </button>
                          </Link>
                        </div>
                      )}
                      {project.demoLink && (
                        <div>
                          <Link href={project.demoLink} target="_blank" rel="noopener noreferrer">
                            <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80">
                              <SourceIcon className="size-4" />
                              <span>Demo</span>
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={600}
                        className="mt-8 pb-0 -mb-4 md:mb-0 lg:mt-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none"
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
