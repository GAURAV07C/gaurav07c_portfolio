import BlurFade from "@/components/BlurFade";
import Card from "@/components/Card";
import { ResumeCard } from "@/components/resume-card";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";
import React from "react";

const Education = () => {
  const education = [
    {
      school: "100xDevs",
      href: "https://app.100xdevs.com",
      degree: "Full Stack Web Development, DevOps & Web3 Bootcamp",
      logoUrl: "/100xDevs.png",
      start: "2023",
      end: "2024",
    },
    {
      school: "Kalasalingam University",
      href: "https://www.kalasalingam.ac.in/",
      degree: "Bachelor's Degree of Engineering",
      logoUrl: "/kalsalingam.jpeg",
      start: "2022",
      end: "2026",
    },
  ];
  return (
    <div className="-mt-16 py-16">
      <div>
        <SectionHeader eyebrow="Education" title="" description="" />
      </div>
      <div className="w-[85%] mx-auto">
        <div className="flex flex-col  gap-5">
          {education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <Card>
                <ResumeCard
                  key={education.school}
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
