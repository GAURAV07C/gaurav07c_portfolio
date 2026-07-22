"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import BlurFade from "@/components/BlurFade";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import Image from "next/image";

interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  repos: { id: string; name: string; slug: string; url: string; description: string }[];
}

export default function OpenSourcePage() {
  const { data: orgs = [], loading } = useCachedFetch<Organisation[]>({
    key: "public_opensource_orgs",
    fetchFn: () => fetch("/api/public/opensource").then(res => res.json()),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <section className="py-16 lg:py-24">
          <div className="container">
            <SectionHeader
              eyebrow="Community Contributions"
              title="Open Source Work"
              description="My contributions to open source projects across different organisations."
            />
            <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-[#0a111f] p-6 h-full animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const orgsList = Array.isArray(orgs) ? orgs : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Community Contributions"
            title="Open Source Work"
            description="My contributions to open source projects across different organisations."
          />

          {orgsList.length === 0 ? (
            <div className="text-center py-20 text-white/50">No organisations yet.</div>
          ) : (
            <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgsList.map((org, index) => (
                <BlurFade key={org.slug} delay={index * 0.05}>
                  <Link href={`/opensource/${org.slug}`} className="block h-full group/card">
                    <div className="relative h-full rounded-2xl border border-white/10 bg-gray-900/50 p-6 md:p-8 transition-all duration-300 hover:border-emerald-300/40 hover:bg-gray-900/80 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                      <div className="relative">
                        <div className="flex items-center gap-5 mb-5">
                          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950">
                            {org.image ? (
                              <Image
                                src={org.image}
                                alt={org.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white/30">
                                  {org.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h2 className="font-serif text-xl md:text-2xl text-white group-hover/card:text-emerald-300 transition-colors truncate">
                              {org.name}
                            </h2>
                            <p className="text-white/40 text-xs font-mono mt-1">
                              {org.repos.length} {org.repos.length === 1 ? "repository" : "repositories"}
                            </p>
                          </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-5">
                          {org.description || "No description"}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/40 mt-auto">
                          <span>Explore contributions</span>
                          <span className="text-emerald-300 group-hover/card:translate-x-1 transition-transform">→</span>
                        </div>
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
