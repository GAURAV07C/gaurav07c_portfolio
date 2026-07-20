"use client";

import React, { useEffect, useState, use } from "react";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<{ id: string; title: string; date: string; content: string; image: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
      } catch {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [resolvedParams.id]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10">
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Blogs</span>
          </Link>
          
          {loading ? (
            <div className="text-center text-white/50">Loading article...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : blog ? (
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
            </article>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
