"use client";
import BlurFade from "@/components/BlurFade";
import Card from "@/components/Card";
import { ResumeCard } from "@/components/resume-card";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";
import React from "react";
import { useEffect, useState } from "react";

const Education = () => {
  const [education, setEducation] = useState<{ id: string; school: string; href: string; degree: string; logoUrl: string; start: string; end: string }[]>([]);

  useEffect(() => {
    fetch("/api/education")
      .then(res => res.json())
      .then(data => setEducation(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="-mt-16 py-16" id='education'>
      <div>
        <SectionHeader eyebrow="Education" title="" description="" />
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col  gap-5">
          {education.map((education, id) => (
            <BlurFade
              key={education.id}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <Card>
                <ResumeCard
                  key={education.id}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                />
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
