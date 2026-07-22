"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import BlurFade from "@/components/BlurFade";

interface Contribution {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  status: string;
  type: string;
  prUrl?: string;
  image?: string;
  views: number;
}

interface RepoPageData {
  org: { name: string; slug: string };
  repo: { name: string; url: string; slug: string };
  contributions: Contribution[];
}

export default function OpenSourceRepoPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const repoSlug = params.repoSlug as string;
  const [data, setData] = useState<RepoPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgSlug || !repoSlug) return;
    fetch(`/api/public/opensource/org/${encodeURIComponent(orgSlug)}/repo/${encodeURIComponent(repoSlug)}`)
      .then(res => res.ok ? res.json() : null)
      .then((data) => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orgSlug, repoSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="py-16 lg:py-24">
          <div className="container max-w-4xl">
            <div className="mb-6">
              <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
            </div>
            <div className="mb-10 space-y-3">
              <div className="h-8 bg-white/10 rounded w-64 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-48 animate-pulse" />
            </div>
            <div className="mt-12 md:mt-20 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-[#0a111f] p-5 md:p-6 animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 bg-white/10 rounded-full w-16" />
                    <div className="h-5 bg-white/10 rounded-full w-20" />
                    <div className="h-4 bg-white/5 rounded w-24" />
                  </div>
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
  if (!data) return <div className="text-center py-20 text-white/50">Repository not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Link href={`/opensource/${orgSlug}`} className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
              <svg className="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              Back to {data.org.name}
            </Link>
          </div>

          <div className="mb-10">
            <SectionHeader
              eyebrow="Repository"
              title={`${data.org.name} / ${data.repo.name}`}
              description={data.repo.url || ""}
            />
          </div>

          {data.contributions.length === 0 ? (
            <div className="text-center py-20 text-white/50">No contributions yet.</div>
          ) : (
            <div className="mt-12 md:mt-20 flex flex-col gap-4">
              {data.contributions.map((item, index) => (
                <BlurFade key={item.slug} delay={index * 0.05}>
                  <Link href={`/opensource/${orgSlug}/${repoSlug}/${item.slug}`} className="block group/card">
                    <div className="relative rounded-2xl border border-white/10 bg-gray-900/50 p-5 md:p-6 transition-all duration-300 hover:border-emerald-300/40 hover:bg-gray-900/80 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            item.status === "merged" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300" :
                            item.status === "pending" ? "border-amber-300/30 bg-amber-300/10 text-amber-300" :
                            "border-red-300/30 bg-red-300/10 text-red-300"
                          }`}>
                            {item.status}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/60">
                            {item.type}
                          </span>
                          <span className="text-xs text-white/40 font-mono">{item.date}</span>
                        </div>
                        <h3 className="text-base md:text-lg text-white group-hover/card:text-emerald-300 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/50 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
