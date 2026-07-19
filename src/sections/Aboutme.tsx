"use client";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";
import { useEffect, useState } from "react";

const Aboutme = () => {
  const [aboutMe, setAboutMe] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(settings => {
        if (settings) {
          setAboutMe(settings.aboutMe);
          setProfileImage(settings.profileImage || "");
        }
      })
      .catch(console.error);
  }, []);

  if (!aboutMe && !profileImage) return null;

  return (
    <div className="pb-16 lg:py-24" id="about">
      <div className="container">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-white/20 relative z-0 overflow-hidden text-center md:text-left">
          <SectionHeader
            eyebrow="About Me"
            title="Know who am I"
            description="My journey in few words"
          />
          <div className="mt-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
            {profileImage && (
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-300/30">
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={192}
                  height={192}
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="text-white/70 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {aboutMe}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutme;
