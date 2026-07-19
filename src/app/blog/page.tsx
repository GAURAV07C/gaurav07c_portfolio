"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import SectionHeader from "@/components/SectionHeader";
import BlogCard from "@/components/BlogCard";
import BlurFade from "@/components/BlurFade";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<{ id: string; title: string; date: string; excerpt: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container">
          <SectionHeader
            eyebrow="My Journal"
            title="Latest Insights"
            description="Thoughts, learnings, and technical deep-dives from my journey in web development."
          />
          
          {loading ? (
            <div className="mt-20 text-center text-white/50">Loading blogs...</div>
          ) : (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <BlurFade key={blog.id} delay={0.1 * index}>
                  <BlogCard 
                    id={blog.id}
                    title={blog.title}
                    date={blog.date}
                    excerpt={blog.excerpt}
                    image={blog.image}
                  />
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
