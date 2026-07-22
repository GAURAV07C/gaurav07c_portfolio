"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import BlurFade from "@/components/BlurFade";
import Image from "next/image";

interface Repo {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
}

interface OrgData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  repos: Repo[];
}

export default function OpenSourceOrgPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const [data, setData] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgSlug) return;
    fetch(`/api/public/opensource/org/${encodeURIComponent(orgSlug)}`)
      .then(res => res.ok ? res.json() : null)
      .then((data) => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orgSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="mb-6">
              <Link href="/opensource" className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
                ← Back to all organisations
              </Link>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              <div className="space-y-3">
                <div className="h-6 bg-white/10 rounded w-48 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-64 animate-pulse" />
              </div>
            </div>
            <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-[#0a111f] p-6 h-full animate-pulse">
                  <div className="space-y-3">
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
  if (!data) return <div className="text-center py-20 text-white/50">Organisation not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-6">
            <Link href="/opensource" className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
              ← Back to all organisations
            </Link>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950">
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white/30">
                    {data.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <SectionHeader
                eyebrow="Organisation"
                title={data.name}
                description={data.description || ""}
              />
            </div>
          </div>

          {data.repos.length === 0 ? (
            <div className="text-center py-20 text-white/50">No repositories yet.</div>
          ) : (
            <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.repos.map((repo, index) => (
                <BlurFade key={repo.slug} delay={index * 0.05}>
                  <Link href={`/opensource/${orgSlug}/${repo.slug}`}>
                    <Card className="h-full p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer flex flex-col">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors mb-2 truncate">
                          {repo.name}
                        </h2>
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">
                          {repo.description || "No description"}
                        </p>
                        {repo.url && (
                          <p className="text-xs text-white/40 font-mono mb-3 truncate">
                            {repo.url}
                          </p>
                        )}
                        <div className="flex items-center justify-end text-xs text-emerald-300">
                          <span className="group-hover:translate-x-1 transition-transform">View contributions →</span>
                        </div>
                      </div>
                    </Card>
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
