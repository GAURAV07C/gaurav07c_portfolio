import BlurFade from "@/components/BlurFade";
import SectionHeader from "@/components/SectionHeader";
import { BLUR_FADE_DELAY } from "@/data/data";

import React from "react";

const skillData = [
  { id: 1, title: "Next.js" },
  { id: 2, title: "React" },
  { id: 3, title: "JavaScript" },
  { id: 4, title: "TypeScript" },
  { id: 5, title: "Node.js" },
  { id: 7, title: "Git" },
  { id: 8, title: "MongoDB" },
  { id: 9, title: "Postgres" },
  { id: 10, title: "Docker" },
  { id: 12, title: "Linux" },
  { id: 13, title: "GitHub Actions" },
  { id: 14, title: "Prisma" },
  { id: 16, title: "MonoRepo" },
  { id: 17, title: "WebSocket" },
  { id: 20, title: "Redis" },
  { id: 21, title: "GraphQL" },
  { id: 24, title: "CI/CD" },
];

const Skill = () => {
  return (
    <div className="container w-[50%] py-16">
      <div className="py-3 container">
        <SectionHeader eyebrow="Skills" title="" description="" />
      </div>
      <div className="flex items-center justify-center ">
        <ul className="flex flex-row justify-center   items-center gap-2 md:px-6  px-0 -ml-6  rounded-full  absolute lg:-ml-10 mt-2 py-5 lg:w-[70%] flex-wrap md:flex-wrap mx-auto">
          {skillData.map((skill) => (
            <BlurFade
              delay={BLUR_FADE_DELAY * 10 + skill.id * 0.5}
              key={skill.id}
              className="inline-flex  items-center rounded-lg  justify-center
                            font-semibold  font-mono 
                            
                            px-2
                            py-0 text-[13px] 
                            
                            outline outline-2 outline-white/10 text-black bg-white tracking-wider   "
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
