"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import BlurFade from "@/components/BlurFade";
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  repos: { id: string; name: string }[];
}

export const OpenSourceSection = () => {
  const { data: orgs = [], loading } = useCachedFetch<Organisation[]>({
    key: "public_opensource_orgs_home",
    fetchFn: () => fetch("/api/public/opensource").then(res => res.json()),
  });

  const display = Array.isArray(orgs) ? orgs.slice(0, 3) : [];

  if (loading) {
    return (
      <section id="opensource" className="py-16 lg:py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Community Contributions"
            title="Open Source Work"
            description="My contributions to open source projects across different organisations."
          />
          <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-gray-900/50 p-6 h-full animate-pulse">
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
    );
  }

  if (display.length === 0) {
    return null;
  }

  return (
    <section id="opensource" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Community Contributions"
          title="Open Source Work"
          description="My contributions to open source projects across different organisations."
        />

        <motion.div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {display.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/opensource/${org.slug}`} className="block h-full">
                <Card className="p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer h-full">
                   <div className="flex items-center gap-5 mb-5">
                     <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950 flex items-center justify-center">
                       {org.image ? (
                         <img
                           src={org.image}
                           alt={org.name}
                           className="w-full h-full object-contain p-1"
                         />
                       ) : (
                         <span className="text-xl font-bold text-white/30">
                           {org.name.charAt(0).toUpperCase()}
                         </span>
                       )}
                     </div>
                     <div className="min-w-0">
                      <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-emerald-300 transition-colors truncate">
                        {org.name}
                      </h3>
                      <p className="text-white/40 text-xs font-mono mt-1">
                        {org.repos.length} {org.repos.length === 1 ? "repository" : "repositories"}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                    {org.description || "Open source organisation"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-5 font-medium">
                    <span>View organisations</span>
                    <svg className="size-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/opensource"
            className="inline-flex items-center gap-2 bg-white text-gray-950 font-semibold px-6 h-10 rounded-lg hover:bg-white/80 transition-colors text-sm"
          >
            View All Organisations
          </Link>
        </div>
      </div>
    </section>
  );
};
