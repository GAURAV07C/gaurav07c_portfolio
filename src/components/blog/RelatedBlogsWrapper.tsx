"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { ViewCount } from "@/components/common/ViewCount";

interface RelatedBlogsWrapperProps {
  currentBlogId: string;
  currentTags: string[];
}

interface RelatedBlog {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  slug?: string;
  views?: number;
}

export function RelatedBlogsWrapper({ currentBlogId, currentTags }: RelatedBlogsWrapperProps) {
  const [blogs, setBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
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
      <div className="mt-24">
        <div className="text-2xl font-serif text-white mb-8">Related Posts</div>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-24">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-white">Related Posts</h2>
        <Link
          href="/blog"
          className="text-emerald-300 hover:text-emerald-400 font-medium inline-flex items-center gap-2 transition-colors text-sm"
        >
          View All Posts
          <ArrowLeft className="size-4 rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {blogs.map((blog) => {
          const blogSlug = blog.slug || blog.id;
          return (
            <Link
              key={blog.id}
              href={`/blog/${blogSlug}`}
              className="group block h-full"
            >
              <div className="h-full bg-[#0a111f] border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-300/40 transition-all duration-300">
                <div className="md:grid md:grid-cols-2 gap-0">
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                        {blog.date}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors mb-3">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <ViewCount id={blog.id} type="blog" />
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      <span>Read Article</span>
                      <svg className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 7l0 10" />
                        <path d="M17 7l-10 10" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative min-h-[220px] md:min-h-[260px]">
                    {blog.image && (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a111f]/60 to-transparent md:block hidden" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
