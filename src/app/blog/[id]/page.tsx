"use client";

import React from "react";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { CommentSection } from "@/components/CommentSection";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

interface BlogDetailPageClientProps {
  blog: {
    id: string;
    title: string;
    date: string;
    content: string;
    image: string;
    tags: string;
    slug?: string;
  };
}

function RelatedBlogsWrapper({ currentBlogId, currentTags }: { currentBlogId: string; currentTags: string[] }) {
  const [blogs, setBlogs] = React.useState<{ id: string; title: string; date: string; excerpt: string; image: string; slug?: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const fetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) return;
        const data = await res.json();
        const allBlogs = Array.isArray(data) ? data : [];
        
        let related = allBlogs.filter((b: { id: string }) => b.id !== currentBlogId);
        
        const currentTagSet = new Set(currentTags);
        
        if (currentTagSet.size > 0) {
          related = related
            .map((b: { id: string; tags: string }) => {
              const blogTags = (() => {
                try {
                  return JSON.parse(b.tags || "[]");
                } catch {
                  return [];
                }
              })();
              const matchingTags = blogTags.filter((t: string) => currentTagSet.has(t));
              return { ...b, matchCount: matchingTags.length };
            })
            .filter((b: { matchCount?: number }) => (b.matchCount || 0) > 0)
            .sort((a: { matchCount?: number }, b: { matchCount?: number }) => (b.matchCount || 0) - (a.matchCount || 0));
        }
        
        const fallback = allBlogs.filter((b: { id: string }) => b.id !== currentBlogId).slice(0, 3);
        const display = related.length > 0 ? related.slice(0, 3) : fallback;
        
        setBlogs(display);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentBlogId, currentTags]);

  if (loading) {
    return (
      <div className="mt-20">
        <div className="text-xl font-serif text-white mb-6">Related Posts</div>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-white">Related Posts</h2>
        <Link
          href="/blog"
          className="text-emerald-300 hover:text-emerald-400 font-medium inline-flex items-center gap-2 transition-colors"
        >
          View All Posts
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => {
          const blogSlug = blog.slug || blog.id;
          return (
            <Link
              key={blog.id}
              href={`/blog/${blogSlug}`}
              className="group block bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-300/30 transition-all"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-950">
                {blog.image && (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="text-xs text-emerald-300 font-mono mb-2">{blog.date}</div>
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-white/50 text-sm mt-2 line-clamp-2">{blog.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogDetailPageClient({ blog }: BlogDetailPageClientProps) {
  const blogSlug = blog.slug || blog.id;
  const blogLink = `/blog/${blogSlug}`;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-3xl">
          <Link href={blogLink} className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10">
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Blogs</span>
          </Link>
          
          <article>
            <div className="text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-4">
              {blog.date}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              {blog.title}
            </h1>
            
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

            <RelatedBlogsWrapper currentBlogId={blog.id} currentTags={(() => {
              try {
                return JSON.parse(blog.tags || "[]");
              } catch {
                return [];
              }
            })()} />
            <CommentSection blogId={blog.id} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
