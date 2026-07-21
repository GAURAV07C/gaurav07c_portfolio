"use client";

import React from "react";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectContent } from "@/components/project/ProjectContent";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { RelatedProjectsWrapper } from "@/components/project/RelatedProjectsWrapper";
import { CommentSection } from "@/components/CommentSection";
import { ProjectOutline } from "@/components/project/ProjectOutline";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import { ViewCount } from "@/components/common/ViewCount";
import { ShareButtons } from "@/components/common/ShareButtons";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function ProjectPageClient({
  project,
}: {
  project: {
    id: string;
    company: string;
    year: string;
    title: string;
    image: string;
    tags?: string;
    description: string;
    results: string;
    features: string;
    challenges: string;
    outcomes: string;
    techStack: string;
    tagsField?: string;
    skills: { title: string }[];
    liveLink?: string | null;
    sourceLink?: string | null;
    demoLink?: string | null;
  };
}) {
  function estimateReadingTime(content: string): number {
    const text = content.replace(/[#*_\-\[\]\(\)>`]/g, "").replace(/\s+/g, " ").trim();
    const words = text.split(" ").filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  const readingTime = estimateReadingTime(
    [project.description, project.features, project.challenges, project.outcomes, project.results]
      .filter(Boolean)
      .join(" ")
  );
  const hasDescription = !!project.description;
  const hasFeatures = project.features && project.features.trim() !== "[]";
  const hasChallenges = project.challenges && project.challenges.trim() !== "[]";
  const hasOutcomes = project.outcomes && project.outcomes.trim() !== "[]";
  const hasResults = project.results && project.results.trim() !== "[]";
  const hasTechStack = project.techStack && project.techStack.trim() !== "[]";

  const sections = [
    hasDescription && { id: "description", text: "Description" },
    hasFeatures && { id: "features", text: "Key Features" },
    hasChallenges && { id: "challenges", text: "Challenges" },
    hasOutcomes && { id: "outcomes", text: "Outcomes" },
    hasResults && { id: "results", text: "Key Results" },
    hasTechStack && { id: "tech-stack", text: "Tech Stack" },
  ].filter(Boolean) as { id: string; text: string }[];

  // All headings from ProjectContent's MarkdownPreview + section titles
  const allHeadings: TocItem[] = [
    ...sections.map(s => ({ id: s.id, text: s.text, level: 2 })),
  ];

  const { activeId } = useTableOfContents(allHeadings);

  return (
    <main className="flex-grow pt-32 pb-16 lg:py-40">
      <div className="container">
        <div className="flex gap-8 lg:gap-16">
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl">
              <ProjectHeader
                backHref="/projects"
                backLabel="Back to Projects"
                project={{
                  company: project.company,
                  year: project.year,
                  title: project.title,
                  image: project.image,
                  tags: project.tags,
                }}
              />

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>{readingTime} min read</span>
                  <span className="text-white/20">•</span>
                  <ViewCount id={project.id} type="project" />
                </div>
                <ShareButtons url={`/project/${project.id}`} title={project.title} />
              </div>

              <ProjectContent
                description={project.description}
                results={project.results}
                techStack={project.techStack}
                features={project.features}
                challenges={project.challenges}
                outcomes={project.outcomes}
                tags={project.tagsField}
                skills={project.skills}
              />

              <ProjectLinks
                liveLink={project.liveLink}
                sourceLink={project.sourceLink}
                demoLink={project.demoLink}
              />

              <RelatedProjectsWrapper
                currentProjectId={project.id}
                currentSkills={project.skills}
              />
              <CommentSection projectId={project.id} />
            </div>
          </div>

          <ProjectOutline sections={sections} currentSection={activeId} />
        </div>
      </div>
    </main>
  );
}
