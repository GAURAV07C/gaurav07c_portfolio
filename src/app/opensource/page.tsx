"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { useCachedFetch } from "@/hooks/useCachedFetch";

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

  if (loading) return <div className="text-center py-20 text-white/50">Loading...</div>;

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
              {orgsList.map((org) => (
                <Link key={org.slug} href={`/opensource/${org.slug}`}>
                  <Card className="h-full p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer flex flex-col">
                    <div className="flex-1">
                      <h2 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors mb-2">
                        {org.name}
                      </h2>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">
                        {org.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{org.repos.length} {org.repos.length === 1 ? "repository" : "repositories"}</span>
                        <span className="text-emerald-300 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
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
