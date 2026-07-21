"use client";

import React from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import BlurFade from "@/components/BlurFade";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsPageNav } from "@/components/docs/DocsPageNav";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import Link from "next/link";
import { CommentSection } from "@/components/CommentSection";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
}

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  pages: DocPage[];
}

interface DocsTopicPageClientProps {
  topic: DocTopic;
  page: DocPage;
}

export function DocsTopicPageClient({ topic, page }: DocsTopicPageClientProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [headings, setHeadings] = React.useState<TocItem[]>([]);
  const { activeId, scrollTo } = useTableOfContents(headings);

  const handleHeadingsChange = (newHeadings: TocItem[]) => {
    setHeadings(newHeadings);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-20 lg:pt-24">
        {/* Topic Header */}
        <div className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="flex items-center gap-5">
              <span className="text-4xl lg:text-5xl leading-none">{topic.icon || "📄"}</span>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1.5 leading-tight">
                  {topic.title}
                </h1>
                <p className="text-white/50 text-base lg:text-lg leading-relaxed">
                  {topic.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Docs Layout */}
        <div className="flex pl-4 lg:pl-8">
          <DocsSidebar
            topic={topic}
            currentPageSlug={page.slug}
            sidebarOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="flex gap-8 lg:gap-16">
                <div className="flex-1 min-w-0">
                  <BlurFade>
                    <article>
                      <div className="flex items-center gap-2 text-sm font-medium mb-6">
                        <Link
                          href={`/docs/${topic.slug}`}
                          className="text-emerald-300 hover:text-emerald-400 transition-colors"
                        >
                          {topic.title}
                        </Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white/60">{page.title}</span>
                      </div>

                      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
                        {page.title}
                      </h1>

                      <div className="text-white/70 text-lg leading-relaxed prose prose-invert max-w-none">
                        <MarkdownPreview content={page.content} onHeadingsChange={handleHeadingsChange} />
                      </div>

                      <DocsPageNav topic={topic} currentPageSlug={page.slug} />

                      <CommentSection docPageId={page.id} />
                    </article>
                  </BlurFade>
                </div>

                <TableOfContents headings={headings} activeId={activeId} onNavigate={scrollTo} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
