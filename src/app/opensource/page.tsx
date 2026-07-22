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
            <div className="mt-12 md:mt-20 flex flex-col gap-6">
              {orgsList.map((org) => (
                <Link key={org.slug} href={`/opensource/${org.slug}`}>
                  <Card className="p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                          {org.name}
                        </h2>
                        <p className="text-white/50 text-sm mt-2 line-clamp-2">
                          {org.description || "No description"}
                        </p>
                        <p className="text-xs text-white/40 mt-2">
                          {org.repos.length} {org.repos.length === 1 ? "repository" : "repositories"}
                        </p>
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
