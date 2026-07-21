"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DocPage {
  id: string;
  title: string;
  slug: string;
  order: number;
}

interface DocTopic {
  slug: string;
  pages: DocPage[];
}

interface DocsPageNavProps {
  topic: DocTopic;
  currentPageSlug: string;
}

export function DocsPageNav({ topic, currentPageSlug }: DocsPageNavProps) {
  const currentIndex = topic.pages.findIndex((p) => p.slug === currentPageSlug);
  const prevPage = currentIndex > 0 ? topic.pages[currentIndex - 1] : null;
  const nextPage = currentIndex < topic.pages.length - 1 ? topic.pages[currentIndex + 1] : null;

  return (
    <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
      {prevPage ? (
        <Link
          href={`/docs/${topic.slug}/${prevPage.slug}`}
          className="group flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <div>
            <div className="text-xs text-white/40 mb-1">Previous</div>
            <div className="text-sm font-medium">{prevPage.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextPage ? (
        <Link
          href={`/docs/${topic.slug}/${nextPage.slug}`}
          className="group flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors text-right"
        >
          <div>
            <div className="text-xs text-white/40 mb-1">Next</div>
            <div className="text-sm font-medium">{nextPage.title}</div>
          </div>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
