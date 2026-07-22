"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import Link from "next/link";

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

  if (loading) return <div className="text-center py-20 text-white/50">Loading...</div>;
  if (!data) return <div className="text-center py-20 text-white/50">Repository not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-4">
            <Link href={`/opensource/${orgSlug}`} className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
              ← Back to {data.org.name}
            </Link>
          </div>
          <SectionHeader
            eyebrow="Repository"
            title={`${data.org.name} / ${data.repo.name}`}
            description={data.repo.url || ""}
          />

          {data.contributions.length === 0 ? (
            <div className="text-center py-20 text-white/50">No contributions yet.</div>
          ) : (
            <div className="mt-12 md:mt-20 flex flex-col gap-4">
              {data.contributions.map((item) => (
                <Link key={item.slug} href={`/opensource/${orgSlug}/${repoSlug}/${item.slug}`}>
                  <Card className="p-5 md:p-6 hover:border-emerald-300/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "merged" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300" :
                        item.status === "pending" ? "border-amber-300/30 bg-amber-300/10 text-amber-300" :
                        "border-red-300/30 bg-red-300/10 text-red-300"
                      }`}>
                        {item.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/60">
                        {item.type}
                      </span>
                      <span className="text-xs text-white/40 font-mono">{item.date}</span>
                    </div>
                    <h3 className="text-base md:text-lg text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
