import BlurFade from "@/components/BlurFade";
import Card from "@/components/Card";
import { ResumeCard } from "@/components/resume-card";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";
import React from "react";

const Experience = () => {
  const work = [
    {
      company: "DevAurasion Community ",
      href: "",
      badges: [],
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "2024",
      end: "Present",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
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
