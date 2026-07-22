"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  repo: { name: string; url: string; slug: string };
}

export default function OpenSourcePRPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const repoSlug = params.repoSlug as string;
  const prSlug = params.prSlug as string;
  const [item, setItem] = useState<Contribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgSlug || !repoSlug || !prSlug) return;
    fetch(`/api/public/opensource/org/${encodeURIComponent(orgSlug)}/repo/${encodeURIComponent(repoSlug)}/pr/${encodeURIComponent(prSlug)}`)
      .then(res => res.ok ? res.json() : null)
      .then((data) => { setItem(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orgSlug, repoSlug, prSlug]);

  if (loading) return <div className="text-center py-20 text-white/50">Loading...</div>;
  if (!item) return <div className="text-center py-20 text-white/50">Contribution not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="mb-4">
            <Link href={`/opensource/${orgSlug}/${repoSlug}`} className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
              ← Back to {item.repo.name}
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
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
            <span className="text-xs text-white/40 font-mono ml-auto">{item.date}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-white mb-6">
            {item.title}
          </h1>

          <p className="text-white/60 leading-relaxed mb-8 whitespace-pre-wrap">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {item.repo.url && (
              <a href={item.repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-white hover:border-emerald-300/40 hover:text-emerald-300 transition-colors">
                View Repository
              </a>
            )}
            {item.prUrl && (
              <a href={item.prUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-300/10 border border-emerald-300/20 rounded-xl px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-300/20 transition-colors">
                View Pull Request
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
