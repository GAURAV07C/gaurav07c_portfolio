"use client";

import React from "react";
import Link from "next/link";
import SourceIcon from "@/assets/icons/source.svg";
import GithubIcon from "@/assets/icons/github.svg";

interface ProjectLinksProps {
  liveLink?: string | null;
  sourceLink?: string | null;
  demoLink?: string | null;
}

export function ProjectLinks({ liveLink, sourceLink, demoLink }: ProjectLinksProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {liveLink && (
        <Link href={liveLink} target="_blank" rel="noopener noreferrer">
          <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
            <SourceIcon className="size-4" />
            <span>Live</span>
          </button>
        </Link>
      )}
      {sourceLink && (
        <Link href={sourceLink} target="_blank" rel="noopener noreferrer">
          <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
            <GithubIcon className="size-4" />
            <span>Source</span>
          </button>
        </Link>
      )}
      {demoLink && (
        <Link href={demoLink} target="_blank" rel="noopener noreferrer">
          <button className="bg-white text-gray-950 h-12 px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 hover:bg-white/80 transition">
            <span>▶ Watch Demo</span>
          </button>
        </Link>
      )}
    </div>
  );
}
