"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { useCachedFetch } from "@/hooks/useCachedFetch";

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
  repo: { name: string; url: string; slug: string; organisation: { name: string; slug: string } };
}

export const OpenSourceSection = () => {
  const { data: contributions = [] } = useCachedFetch<Contribution[]>({
    key: "public_opensource_latest",
    fetchFn: () => fetch("/api/public/opensource/latest").then(res => res.json()),
  });

  const display = Array.isArray(contributions) ? contributions.slice(0, 3) : [];

  if (display.length === 0) {
    return null;
  }

  return (
    <section id="opensource" className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Community Contributions"
          title="Open Source Work"
          description="A selection of my contributions to open source projects."
        />

        <motion.div className="flex flex-col mt-10 md:mt-20 gap-6">
          {display.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/opensource/${item.repo.organisation.slug}/${item.repo.slug}/${item.slug}`} className="block">
                <Card className="p-6 md:p-8 hover:border-emerald-300/30 transition-all group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-emerald-300 font-semibold uppercase tracking-widest">
                          {item.repo.organisation.name} / {item.repo.name}
                        </span>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-xs text-white/40">{item.date}</span>
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm mt-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-4 flex-wrap">
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
                        {item.prUrl && (
                          <span className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors">
                            View PR →
                          </span>
                        )}
                      </div>
                    </div>
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
            View All Contributions
          </Link>
        </div>
      </div>
    </section>
  );
};
