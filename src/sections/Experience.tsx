"use client";
import BlurFade from "@/components/BlurFade";
import Card from "@/components/Card";
import { ResumeCard } from "@/components/resume-card";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";
import React from "react";
import { useEffect, useState } from "react";

const Experience = () => {
  const [experiences, setExperiences] = useState<{ id: string; company: string; href: string; badges: string; location: string; title: string; logoUrl: string; start: string; end: string; description: string }[]>([]);

  useEffect(() => {
    fetch("/api/experience")
      .then(res => res.json())
      .then(data => setExperiences(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="py-24">
      <div>
        <SectionHeader eyebrow="Experience" title="" description="" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-5">
          {experiences.map((work, id) => (
            <BlurFade
              key={work.id}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <Card>
                <ResumeCard
                  key={work.id}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={JSON.parse(work.badges || "[]")}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Experience;
