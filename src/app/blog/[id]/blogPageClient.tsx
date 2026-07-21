"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { CommentSection } from "@/components/CommentSection";
import { RelatedBlogsWrapper } from "@/components/blog/RelatedBlogsWrapper";
import { BlogOutline } from "@/components/blog/BlogOutline";
import { ViewCount } from "@/components/common/ViewCount";
import { ShareButtons } from "@/components/common/ShareButtons";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogPageClientProps {
  blog: {
    id: string;
    title: string;
    date: string;
    content: string;
    image: string;
    tags: string[];
    slug?: string;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/[#*_\-\[\]\(\)>`]/g, "").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function BlogPageClient({ blog }: BlogPageClientProps) {
  const blogSlug = blog.slug || blog.id;
  const blogLink = `/blog/${blogSlug}`;
  const readingTime = estimateReadingTime(blog.content);

  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!blog.content) return;
    const lines = blog.content.split("\n");
    const items: TocItem[] = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        const text = trimmed.slice(2);
        const id = slugify(text);
        if (id) items.push({ id, text, level: 1 });
      } else if (trimmed.startsWith("## ")) {
        const text = trimmed.slice(3);
        const id = slugify(text);
        if (id) items.push({ id, text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.slice(4);
        const id = slugify(text);
        if (id) items.push({ id, text, level: 3 });
      }
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    items.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [blog.content]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-16 lg:py-40">
      <div className="container">
        <div className="flex gap-8 lg:gap-16">
          <div className="flex-1 min-w-0">
            <div className="max-w-3xl">
              <Link
                href={blogLink}
                className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10"
              >
                <ArrowLeft className="size-4 rotate-180" />
                <span>Back to Blogs</span>
              </Link>

              <article>
                <div className="text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-4">
                  {blog.date}
                </div>
                <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-300 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/60">
                  <span>{readingTime} min read</span>
                  <span className="text-white/20">•</span>
                  <ViewCount id={blog.id} type="blog" />
                </div>

                <div className="flex items-center justify-between mb-12">
                  <ShareButtons url={blogLink} title={blog.title} />
                </div>

                <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-white/70 text-lg leading-relaxed">
                  <MarkdownPreview content={blog.content} />
                </div>

                <RelatedBlogsWrapper currentBlogId={blog.id} currentTags={blog.tags} />
                <CommentSection blogId={blog.id} />
              </article>
            </div>
          </div>

          <BlogOutline headings={headings} activeId={activeId} onNavigate={scrollTo} />
        </div>
      </div>
    </main>
  );
}
