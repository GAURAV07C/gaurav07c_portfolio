"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function BlogOutline({ headings, activeId, onNavigate }: { headings: TocItem[]; activeId: string; onNavigate: (id: string) => void }) {
  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors text-sm mb-4"
        >
          <ArrowLeft className="size-4 rotate-180" />
          <span>Back to Blogs</span>
        </Link>

        <div className="relative">
          <span className="absolute left-[6px] top-0 bottom-0 w-px bg-white/10" />
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => onNavigate(heading.id)}
                className={`
                  group flex items-center gap-3 w-full text-left text-sm transition-all py-0.5 pr-2
                  ${activeId === heading.id ? "text-emerald-300" : "text-white/50 hover:text-white/80"}
                `}
              >
                <span
                  className={`
                    flex-shrink-0 rounded-full border-2 transition-all duration-200 z-10
                    ${activeId === heading.id
                      ? "bg-emerald-300 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-gray-900 border-white/20 group-hover:border-white/40"
                    }
                  `}
                  style={{ width: heading.level === 3 ? 10 : 12, height: heading.level === 3 ? 10 : 12 }}
                />
                <span className="truncate">{heading.text}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
