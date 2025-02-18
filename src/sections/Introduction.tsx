"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const Introduction = () => {
  const words = [
    { text: "Hi", className: "text-white text-6xl" },
    { text: "I'm", className: "text-white text-6xl" },
    { text: "Gaurav", className: "text-white text-6xl" },
  ];

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-6 md:flex-row md:w-[80%] lg:w-[65%]">
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
          <TextGenerateEffect words="Tech Enthusiast turned Software Engineer. I love building things and helping people. Very active on Twitter." />
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 md:mt-0 md:ml-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/mypic.png"
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
