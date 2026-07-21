"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

interface ProjectHeaderProps {
  backHref: string;
  backLabel: string;
  project: {
    company: string;
    year: string;
    title: string;
    image: string;
  };
}

export function ProjectHeader({ backHref, backLabel, project }: ProjectHeaderProps) {
  return (
    <>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10"
      >
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
      </article>
    </>
  );
}
