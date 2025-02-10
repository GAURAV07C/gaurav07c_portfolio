import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import React from "react";

const Introduction = () => {
  const words = [
    {
      text: "Hi",
      className: "text-white text-6xl",
    },
    {
      text: "I'm",
      className: "text-white text-6xl",
    },
    {
      text: "Gaurav",
      className: "text-white text-6xl",
    },
  ];
  return (
    
    <div>
      <div className="container w-[65%] flex items-center justify-center">
        <div className="flex justify-between gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-6xl leading-8 text-white">
              <TypewriterEffect words={words} />
            </h1>
            {/* Fixed the invalid nesting */}
            <div className="text-white">
              <TextGenerateEffect
                words="Tech Enthusiast turned Software Engineer. I love building things
                and helping people. Very active on Twitter."
              />
            </div>
          </div>
          <div>
            <Image src={"/mypic.jpg"} alt="my-pic" width={150} height={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
