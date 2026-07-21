"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import BlurFade from "@/components/BlurFade";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  slug?: string;
  views?: number;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a111f] flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10"
          >
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">All Blogs</h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Thoughts, learnings, and technical deep-dives from my journey in web development.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white/50 py-20">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-white/50 py-20">
              <p className="text-xl mb-2">No blogs yet</p>
              <p className="text-sm">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {blogs.map((blog, index) => {
                const blogSlug = blog.slug || blog.id;
                return (
                  <BlurFade key={blog.id} delay={index * 0.05}>
                    <Link href={`/blog/${blogSlug}`} className="group block h-full">
                      <div className="h-full bg-[#0a111f] border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-300/30 transition-all duration-300">
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
                              <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                {(blog.views ?? 0).toLocaleString()} views
                              </span>
                            </div>

                            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 group-hover:text-emerald-200 transition-colors">
                              <span>Read Article</span>
                              <svg
                                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
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
                  </BlurFade>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
