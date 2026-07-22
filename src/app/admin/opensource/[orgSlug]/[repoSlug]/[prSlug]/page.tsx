"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Contribution {
  id: string;
  title: string;
  slug: string;
  description: string;
  repoUrl: string;
  prUrl?: string;
  type: string;
  techStack: string;
  date: string;
  status: string;
  image?: string;
  views: number;
  repo: { id: string; name: string; url: string };
}

export default function AdminOpenSourcePRPage() {
  const params = useParams();
  const prSlug = params.prSlug as string;
  const orgSlug = params.orgSlug as string;
  const repoSlug = params.repoSlug as string;
  const [item, setItem] = useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prSlug || !orgSlug || !repoSlug) return;
    fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${encodeURIComponent(prSlug)}`)
      .then((res) => res.json())
      .then((data) => { setItem(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [prSlug, orgSlug, repoSlug]);

  if (loading) return <div className="text-white/50">Loading...</div>;
  if (!item) return <div className="text-white/50">Not found</div>;

  const techStack = JSON.parse(item.techStack || "[]") as string[];

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={item.title}
        description={`${item.type} contribution • ${item.status} • ${item.date}`}
      />

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            item.status === "merged" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300" :
            item.status === "pending" ? "border-amber-300/30 bg-amber-300/10 text-amber-300" :
            "border-red-300/30 bg-red-300/10 text-red-300"
          }`}>
            {item.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-white/70 uppercase tracking-wider">
            {item.type}
          </span>
        </div>
        <span className="text-xs text-white/40 font-mono ml-auto">
          {(item.views ?? 0).toLocaleString()} views
        </span>
      </div>

      <BlurFade>
        <div className="bg-[#0a111f] border border-white/10 rounded-3xl p-6 md:p-10 space-y-8">
          <div>
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Description</h2>
            <p className="text-white/70 leading-[1.8] whitespace-pre-wrap text-[15px]">
              {item.description}
            </p>
          </div>

          {techStack.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <span key={i} className="text-xs text-white/60 font-mono border border-white/10 bg-white/5 px-3 py-1.5 rounded-lg hover:border-emerald-300/30 hover:text-emerald-300 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-sm font-medium text-white hover:border-emerald-300/40 hover:text-emerald-300 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-7-1-7-1" />
                </svg>
                View Repository
              </a>
              {item.prUrl && (
                <a
                  href={item.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-300/10 border border-emerald-300/20 rounded-xl px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-300/20 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                  View Pull Request
                </a>
              )}
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
