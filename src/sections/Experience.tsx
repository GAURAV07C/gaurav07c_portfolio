import BlurFade from "@/components/BlurFade";
import Card from "@/components/Card";
import { ResumeCard } from "@/components/resume-card";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";
import React from "react";

const Experience = () => {
  const work = [
    {
      company: "Sprinpak Manufacturing LLP",
      href: "",
      badges: [],
      location: "Gurgon Bilaspur",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "JULY 2025",
      end: "PRESENT",
      description:
        "Developed automation-driven production planning tools and internal applications by designing user-friendly interfaces, streamlining production workflows, and integrating real-time data tracking, resulting in improved operational efficiency and smoother team collaboration.",
    },
    {
      company: "Save Rush",
      href: "",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "MARCH 2025",
      end: "JULY 2025",
      description:
        "Built scalable backend APIs for a real-time flash sale platform using Node.js, MongoDB, Redis, focusing on performance, concurrency, and seamless frontend integration.",
    },
    {
      company: "DevAurasion Community ",
      href: "",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "DEC 2024",
      end: "FEB 2025",
      description:
        "Built responsive and interactive user interfaces for a developer community platform, focusing on usability, performance, and seamless API integration.",
    },
  ];

  return (
    <div className="py-24">
      <div>
        <SectionHeader eyebrow="Experience" title="" description="" />
      </div>

      <div className="w-[85%] mx-auto">
        <div className="flex flex-col gap-5">
          {work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <Card>
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={work.badges}
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
