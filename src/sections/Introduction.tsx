"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Introduction = () => {
  const [words, setWords] = useState<{ text: string; className: string }[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [introductionText, setIntroductionText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then((settings) => {
        if (settings?.introductionWords) {
          setWords(JSON.parse(settings.introductionWords));
        }
        if (settings?.introductionText) {
          setIntroductionText(settings.introductionText);
        }
        if (settings?.profileImage) {
          setProfileImage(settings.profileImage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 md:px-6 md:flex-row">
        <div className="text-white/40 text-lg">Loading...</div>
      </div>
    );
  }

  const imageSrc = profileImage || "/mypic.png";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 md:px-6 md:flex-row">
      <motion.div
        className="flex flex-col gap-4 text-center md:text-left"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl leading-tight text-white">
          <TypewriterEffect words={words} />
        </h1>
        <motion.div
          className="text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <TextGenerateEffect words={introductionText || "Tech Enthusiast turned Software Engineer. I love building things and helping people. Very active on Twitter."} />
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 md:mt-0 md:ml-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={imageSrc}
          alt="my-pic"
          width={150}
          height={200}
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};

export default Introduction;
