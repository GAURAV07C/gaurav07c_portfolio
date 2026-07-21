"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

interface Blog {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string;
  slug?: string;
}

interface RelatedBlogsProps {
  currentBlogId: string;
  currentTags: string[];
}

export function RelatedBlogs({ currentBlogId, currentTags = [] }: RelatedBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) return;
        const data = await res.json();
        const allBlogs = Array.isArray(data) ? data : [];
        
        let related = allBlogs.filter((b: Blog) => b.id !== currentBlogId);
        
        const currentTagSet = new Set(currentTags);
        
        if (currentTagSet.size > 0) {
          related = related
            .map((b: Blog) => {
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
            .filter((b: Blog & { matchCount: number }) => b.matchCount > 0)
            .sort((a: Blog & { matchCount: number }, b: Blog & { matchCount: number }) => b.matchCount - a.matchCount);
        }
        
        const fallback = allBlogs.filter((b: Blog) => b.id !== currentBlogId).slice(0, 3);
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
