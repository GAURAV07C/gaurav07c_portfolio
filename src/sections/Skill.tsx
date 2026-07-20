"use client";

import BlurFade from "@/components/BlurFade";
import SectionHeader from "@/components/SectionHeader";
import { useCachedFetch } from "@/hooks/useCachedFetch";

const BLUR_FADE_DELAY = 0.04;

const Skill = () => {
  const { data: skillsRaw = [] } = useCachedFetch<{ id: string; title: string }[]>({
    key: "skills",
    fetchFn: () => fetch("/api/skills").then(res => res.json()),
  });
  const skills = Array.isArray(skillsRaw) ? skillsRaw : [];

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4 md:px-6" id="skill">
      <div className="py-3">
        <SectionHeader eyebrow="Skills" title="" description="" />
      </div>
      <div className="flex justify-center">
        <ul className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 w-full max-w-3xl md:max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <BlurFade
              delay={BLUR_FADE_DELAY * 10 + index * 0.5}
              key={skill.id}
              className="inline-flex items-center rounded-lg justify-center font-semibold font-mono px-2 md:px-3 py-1 text-xs md:text-sm outline outline-2 outline-white/10 text-black bg-white tracking-wider"
            >
              <p className="bg-white text-black">{skill.title}</p>
            </BlurFade>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Skill;
