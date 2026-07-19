"use client";
import SectionHeader from "@/components/SectionHeader";
import { useEffect, useState } from "react";

const Aboutme = () => {
  const [aboutMe, setAboutMe] = useState<string>("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(settings => {
        if (settings) {
          setAboutMe(settings.aboutMe);
        }
      })
      .catch(console.error);
  }, []);

  if (!aboutMe) return null;

  return (
    <div className="pb-16 lg:py-24" id="about">
      <div className="container">
        <div className="bg-gray-800 rounded-xl p-8 border border-white/20 relative z-0 overflow-hidden text-center md:text-left">
          <SectionHeader
            eyebrow="About Me"
            title="Know who am I"
            description="My journey in few words"
          />
          <div className="mt-20 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 ">
              <div className="md:col-span-2 lg:col-span-1 text-white/70">
                {aboutMe}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutme;
