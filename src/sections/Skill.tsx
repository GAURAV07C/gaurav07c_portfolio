"use client";

import BlurFade from "@/components/BlurFade";
import SectionHeader from "@/components/SectionHeader";
import { useEffect, useState } from "react";

const BLUR_FADE_DELAY = 0.04;

const Skill = () => {
  const [skills, setSkills] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container w-[50%] py-16" id="skill" >
      <div className="py-3 container">
        <SectionHeader eyebrow="Skills" title="" description="" />
      </div>
      <div className="flex items-center justify-center ">
        <ul className="flex flex-row justify-center   items-center gap-2 md:px-6  px-0 -ml-6  rounded-full  absolute lg:-ml-10 mt-2 py-5 lg:w-[70%] flex-wrap md:flex-wrap mx-auto">
          {skills.map((skill, index) => (
            <BlurFade
              delay={BLUR_FADE_DELAY * 10 + index * 0.5}
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
