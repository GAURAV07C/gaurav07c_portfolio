"use client";

import React from "react";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";

interface ProjectContentProps {
  description: string;
  results: string;
  techStack: string;
  features?: string;
  challenges?: string;
  outcomes?: string;
  tags?: string;
  skills?: { title: string }[];
}

function parseMarkdownList(value: string): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed.split("\n").map(line => line.replace(/^[-•*]\s+/, "").trim()).filter(Boolean);
}

function getTechItems(value: string): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed.split("\n").map(line => line.replace(/^[-•*]\s+/, "").trim()).filter(Boolean);
}

export function ProjectContent({
  description,
  results,
  techStack,
  features,
  challenges,
  outcomes,
  tags,
  skills,
}: ProjectContentProps) {
  const parsedResults = parseMarkdownList(results);
  const parsedTechStack = getTechItems(techStack);
  const parsedFeatures = parseMarkdownList(features || "");
  const parsedChallenges = parseMarkdownList(challenges || "");
  const parsedOutcomes = parseMarkdownList(outcomes || "");
  const parsedTags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const skillTitles = Array.isArray(skills) ? skills.map((s) => s.title).filter(Boolean) : [];

  const allTechItems = [
    ...parsedTechStack,
    ...skillTitles.filter((title) => !parsedTechStack.includes(title)),
  ];

  return (
    <>
      {description && (
        <div id="description" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Description</h2>
          <MarkdownPreview content={description} className="text-white/70 text-lg leading-relaxed" />
        </div>
      )}

      {parsedFeatures.length > 0 && (
        <div id="features" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Key Features</h2>
          <ul className="flex flex-col gap-1">
            {parsedFeatures.map((item, i) => (
              <li key={i} className="text-white/70 text-base leading-relaxed">
                <MarkdownPreview content={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsedChallenges.length > 0 && (
        <div id="challenges" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Challenges</h2>
          <ul className="flex flex-col gap-1">
            {parsedChallenges.map((item, i) => (
              <li key={i} className="text-white/70 text-base leading-relaxed">
                <MarkdownPreview content={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsedOutcomes.length > 0 && (
        <div id="outcomes" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Outcomes</h2>
          <ul className="flex flex-col gap-1">
            {parsedOutcomes.map((item, i) => (
              <li key={i} className="text-white/70 text-base leading-relaxed">
                <MarkdownPreview content={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsedResults.length > 0 && (
        <div id="results" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Key Results</h2>
          <ul className="flex flex-col gap-1">
            {parsedResults.map((item, i) => (
              <li key={i} className="text-white/70 text-base leading-relaxed">
                <MarkdownPreview content={item} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {allTechItems.length > 0 && (
        <div id="tech-stack" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {allTechItems.map((title, i) => (
              <span
                key={title + i}
                className="inline-flex items-center rounded-lg font-semibold font-mono px-4 py-2 text-sm outline outline-2 outline-white/10 text-black bg-white tracking-wider"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {parsedTags.length > 0 && (
        <div id="tags" className="mb-10">
          <h2 className="text-2xl font-serif text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {parsedTags.map((tag, i) => (
              <span
                key={tag + i}
                className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-300 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
