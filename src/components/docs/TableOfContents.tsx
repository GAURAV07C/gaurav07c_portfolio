"use client";

import React from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function TableOfContents({ headings, activeId, onNavigate }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-28">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
          On This Page
        </h3>
        <nav className="relative">
          <span className="absolute left-[6px] top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-3">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <button
                  key={heading.id}
                  onClick={() => onNavigate(heading.id)}
                  className={`
                    group flex items-center gap-3 w-full text-left text-sm transition-all py-0.5 pr-2
                    ${isActive ? "text-emerald-300" : "text-white/50 hover:text-white/80"}
                  `}
                >
                  <span
                    className={`
                      flex-shrink-0 rounded-full border-2 transition-all duration-200 z-10
                      ${isActive
                        ? "bg-emerald-300 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-900 border-white/20 group-hover:border-white/40"
                      }
                    `}
                    style={{ width: heading.level === 3 ? 10 : 12, height: heading.level === 3 ? 10 : 12 }}
                  />
                  <span className="truncate">{heading.text}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
