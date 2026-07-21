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
    tags?: string;
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
        <div className="text-emerald-300 font-bold uppercase tracking-wide text-xs md:text-sm mb-3">
          {project.company} • {project.year.trim()}
        </div>

        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-3 leading-tight">
          {project.title}
        </h1>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.split(",").map((tag, index) => {
              const cleanTag = tag.trim().replace(/["[\]]/g, "");
              if (!cleanTag) return null;
              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-300 tracking-wide"
                >
                  #{cleanTag}
                </span>
              );
            })}
          </div>
        )}

        {project.image && (
          <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 border border-white/10">
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
