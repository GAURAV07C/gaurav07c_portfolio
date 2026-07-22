"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import Link from "next/link";

interface Repo {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  _count?: { contributions: number };
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

  if (loading) return <div className="text-center py-20 text-white/50">Loading...</div>;
  if (!data) return <div className="text-center py-20 text-white/50">Organisation not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-4">
            <Link href="/opensource" className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors">
              ← Back to all organisations
            </Link>
          </div>
          <SectionHeader
            eyebrow="Organisation"
            title={data.name}
            description={data.description || ""}
          />

          {data.repos.length === 0 ? (
            <div className="text-center py-20 text-white/50">No repositories yet.</div>
          ) : (
            <div className="mt-12 md:mt-20 flex flex-col gap-6">
              {data.repos.map((repo) => (
                <Link key={repo.slug} href={`/opensource/${orgSlug}/${repo.slug}`}>
                  <Card className="p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                          {repo.name}
                        </h2>
                        <p className="text-white/50 text-sm mt-2 line-clamp-2">
                          {repo.description || "No description"}
                        </p>
                        {repo.url && (
                          <p className="text-xs text-white/40 mt-2 font-mono">
                            {repo.url}
                          </p>
                        )}
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
