"use client";

import React from "react";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";

interface ProjectContentProps {
  description: string;
  results: string;
  techStack: string;
}

export function ProjectContent({ description, results, techStack }: ProjectContentProps) {
  const parsedResults = (() => {
    if (!results) return [];
    const trimmed = results.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.includes("title")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fall through
      }
    }
    return trimmed.split("\n").filter((line) => line.trim());
  })();

  const parsedTechStack = (() => {
    try {
      return JSON.parse(techStack || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <>
      {description && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-white mb-6">Description</h2>
          <MarkdownPreview content={description} className="text-white/70 text-lg leading-relaxed" />
        </div>
      )}

      {parsedResults.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-white mb-6">Key Results</h2>
          <MarkdownPreview content={results} className="text-white/70 text-lg leading-relaxed" />
        </div>
      )}

      {parsedTechStack.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-white mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {parsedTechStack.map((tech: { title: string }, i: number) => (
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
    </>
  );
}
