"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";

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
  icon: string;
  description: string;
  pages: DocPage[];
}

interface DocsSidebarProps {
  topic: DocTopic;
  currentPageSlug: string;
  sidebarOpen: boolean;
  onClose: () => void;
}

export function DocsSidebar({ topic, currentPageSlug, sidebarOpen, onClose }: DocsSidebarProps) {
  return (
    <>
      <button
        onClick={() => onClose()}
        className="lg:hidden mb-4 flex items-center gap-2 text-white/70 hover:text-emerald-300 transition-colors"
      >
        {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        <span>Table of Contents</span>
      </button>

      <aside
        className={`
          fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg lg:relative lg:bg-transparent lg:backdrop-blur-none
          lg:w-60 lg:flex-shrink-0 lg:block lg:z-auto
          transition-all duration-300
          ${sidebarOpen ? "block p-6" : "hidden"}
        `}
      >
        <div className="lg:sticky lg:top-28">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-6 text-sm"
            onClick={onClose}
          >
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Docs</span>
          </Link>

          <nav className="space-y-1">
            {topic.pages.map((page) => (
              <Link
                key={page.id}
                href={`/docs/${topic.slug}/${page.slug}`}
                onClick={onClose}
                className={`
                  block px-3 py-2 rounded-lg text-sm transition-all
                  ${
                    page.slug === currentPageSlug
                      ? "bg-emerald-300/10 text-emerald-300 font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
