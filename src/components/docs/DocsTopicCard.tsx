"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  pages: {
    id: string;
    title: string;
    slug: string;
    order: number;
  }[];
}

interface DocsTopicCardProps {
  topic: DocTopic;
}

export function DocsTopicCard({ topic }: DocsTopicCardProps) {
  const firstPageSlug = topic.pages[0]?.slug || "";

  return (
    <Link
      href={`/docs/${topic.slug}/${firstPageSlug}`}
      className="group block bg-gray-800/50 border border-white/10 rounded-2xl p-6 hover:border-emerald-300/30 transition-all"
    >
      <div className="text-3xl mb-4">{topic.icon || "📄"}</div>
      <h3 className="text-xl font-serif text-white mb-2 group-hover:text-emerald-300 transition-colors">
        {topic.title}
      </h3>
      <p className="text-white/60 text-sm mb-4 line-clamp-2">
        {topic.description || `Documentation for ${topic.title}`}
      </p>
      <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium">
        <span>{topic.pages.length} {topic.pages.length === 1 ? "page" : "pages"}</span>
        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
