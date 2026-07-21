"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import SectionHeader from "@/components/SectionHeader";
import BlurFade from "@/components/BlurFade";
import { DocsTopicCard } from "@/components/docs/DocsTopicCard";

interface DocPage {
  id: string;
  title: string;
  slug: string;
  order: number;
}

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  pages: DocPage[];
}

export default function DocsHomePage() {
  const [topics, setTopics] = useState<DocTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/docs");
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setTopics(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container">
          <SectionHeader
            eyebrow="Documentation"
            title="Docs"
            description="Explore topics and learn step-by-step guides, references, and best practices."
          />

          {loading ? (
            <div className="mt-20 text-center text-white/50">Loading topics...</div>
          ) : topics.length === 0 ? (
            <div className="mt-20 text-center text-white/50">No docs available yet.</div>
          ) : (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topics.map((topic, index) => (
                <BlurFade key={topic.id} delay={0.1 * index}>
                  <DocsTopicCard topic={topic} />
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
