"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SectionItem {
  id: string;
  text: string;
}

export function ProjectOutline({ sections, currentSection }: { sections: SectionItem[]; currentSection?: string }) {
  return (
    <aside className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-28 space-y-6">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Projects</span>
          </Link>

          <div className="relative">
            <span className="absolute left-[6px] top-0 bottom-0 w-px bg-white/10" />
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const el = document.getElementById(section.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`
                    group flex items-center gap-3 w-full text-left text-sm transition-all py-0.5 pr-2
                    ${currentSection === section.id ? "text-emerald-300" : "text-white/50 hover:text-white/80"}
                  `}
                >
                  <span
                    className={`
                      flex-shrink-0 rounded-full border-2 transition-all duration-200 z-10
                      ${currentSection === section.id
                        ? "bg-emerald-300 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-900 border-white/20 group-hover:border-white/40"
                      }
                    `}
                    style={{ width: 10, height: 10 }}
                  />
                  <span className="truncate">{section.text}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
