"use client";

import React, { useEffect, useState, use } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { MarkdownPreview, TocItem } from "@/components/admin/MarkdownPreview";
import BlurFade from "@/components/BlurFade";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsPageNav } from "@/components/docs/DocsPageNav";
import { DocsNotFound } from "@/components/docs/DocsNotFound";
import { CommentSection } from "@/components/CommentSection";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import Link from "next/link";

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

interface DocsTopicPageProps {
  params: Promise<{ topic: string; pageSlug: string }>;
}

export default function DocsTopicPage({ params }: DocsTopicPageProps) {
  const resolvedParams = use(params);
  const [currentTopic, setCurrentTopic] = useState<DocTopic | null>(null);
  const [currentPage, setCurrentPage] = useState<DocPage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { activeId, scrollTo } = useTableOfContents(headings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/docs");
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data: DocTopic[] = await res.json();

        const topic = data.find((t) => t.slug === resolvedParams.topic) || null;
        setCurrentTopic(topic);

        if (topic) {
          const page = topic.pages.find((p) => p.slug === resolvedParams.pageSlug) || null;
          setCurrentPage(page);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resolvedParams.topic, resolvedParams.pageSlug]);

  const handleHeadingsChange = (newHeadings: TocItem[]) => {
    setHeadings(newHeadings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-3xl text-center text-white/50">Loading documentation...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentTopic || !currentPage) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <DocsNotFound />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-20 lg:pt-24">
        {/* Topic Header */}
        <div className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="flex items-center gap-5">
              <span className="text-4xl lg:text-5xl leading-none">{currentTopic.icon || "📄"}</span>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1.5 leading-tight">
                  {currentTopic.title}
                </h1>
                <p className="text-white/50 text-base lg:text-lg leading-relaxed">
                  {currentTopic.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Docs Layout: Sidebar | Content | TOC */}
        <div className="flex pl-4 lg:pl-8">
          <DocsSidebar
            topic={currentTopic}
            currentPageSlug={currentPage.slug}
            sidebarOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="flex gap-8 lg:gap-16">
                <div className="flex-1 min-w-0">
                  <BlurFade>
                    <article>
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-sm font-medium mb-6">
                        <Link
                          href={`/docs/${currentTopic.slug}`}
                          className="text-emerald-300 hover:text-emerald-400 transition-colors"
                        >
                          {currentTopic.title}
                        </Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white/60">{currentPage.title}</span>
                      </div>

                      {/* Page Title */}
                      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
                        {currentPage.title}
                      </h1>

                      {/* Content */}
                      <div className="text-white/70 text-lg leading-relaxed prose prose-invert max-w-none">
                        <MarkdownPreview content={currentPage.content} onHeadingsChange={handleHeadingsChange} />
                      </div>

                      {/* Prev/Next Navigation */}
                      <DocsPageNav topic={currentTopic} currentPageSlug={currentPage.slug} />

                      {/* Comments */}
                      <CommentSection docPageId={currentPage.id} />
                    </article>
                  </BlurFade>
                </div>

                {/* Right TOC */}
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
