"use client";

import memojiImage from "@/assets/images/memoji-computer.png";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import grainImage from "@/assets/images/grain.jpg";
import Image from "next/image";

import StarIcon from "@/assets/icons/star.svg";
import HeroOrbit from "./HeroOrbit";

import SparkleIcon from "@/assets/icons/sparkle.svg";
import BlurFade from "@/components/BlurFade";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export const HeroSection = () => {
  const words = [
    {
      text: "Building",
      className: "text-white text-3xl md:text-5xl font-serif",
    },
    {
      text: "Exceptional",
      className: "text-white text-3xl md:text-5xl font-serif",
    },
    { text: "User", className: "text-white text-3xl md:text-5xl font-serif" },
    {
      text: "Experience",
      className: "text-white text-3xl md:text-5xl font-serif",
    },
  ];

  return (
    <BlurFade>
      <div className="py-32 md:py-48 lg:py-60 z-0 overflow-x-clip relative">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
          <div
            className="absolute inset-0 -z-30 opacity-5"
            style={{
              backgroundImage: `url(${grainImage.src})`,
            }}
          ></div>
          <div className="size-[620px] hero-ring"></div>
          <div className="size-[820px] hero-ring"></div>
          <div className="size-[1020px] hero-ring"></div>
          <div className="size-[1220px] hero-ring"></div>

          <HeroOrbit
            size={430}
            orbitdSpin
            rotation={-14}
            spinDuration="30s"
            starSpin
            starDuration="3s"
          >
            <SparkleIcon className="size-8 text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={440}
            rotation={79}
            orbitdSpin
            spinDuration="32s"
            starSpin
            starDuration="3s"
          >
            <SparkleIcon className="size-5 text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={520}
            rotation={-41}
            orbitdSpin
            spinDuration="34s"
            starSpin
            starDuration="6s"
          >
            <SparkleIcon className="size-2 rounded-full text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={530}
            rotation={178}
            orbitdSpin
            spinDuration="36s"
            starSpin
            starDuration="3s"
          >
            <SparkleIcon className="size-10 text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={550}
            rotation={20}
            orbitdSpin
            spinDuration="38s"
            starSpin
            starDuration="6s"
          >
            <StarIcon className="size-12 text-emerald-300" />
          </HeroOrbit>

          <HeroOrbit
            size={590}
            rotation={98}
            orbitdSpin
            spinDuration="40s"
            starSpin
            starDuration="3s"
          >
            <StarIcon className="size-8 text-emerald-300" />
          </HeroOrbit>

          <HeroOrbit
            size={650}
            rotation={-5}
            orbitdSpin
            spinDuration="42s"
            starSpin
            starDuration="6s"
          >
            <SparkleIcon className="size-2 rounded-full text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={710}
            rotation={144}
            orbitdSpin
            spinDuration="44s"
            starSpin
            starDuration="3s"
          >
            <SparkleIcon className="size-14 text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={720}
            rotation={85}
            orbitdSpin
            spinDuration="46s"
            starSpin
            starDuration="6s"
          >
            <SparkleIcon className="size-3 rounded-full text-emerald-300/20" />
          </HeroOrbit>

          <HeroOrbit
            size={800}
            rotation={-72}
            orbitdSpin
            spinDuration="48s"
            starSpin
            starDuration="6s"
          >
            <StarIcon className="size-28 text-emerald-300" />
          </HeroOrbit>
        </div>

        <div className="container">
          <div className="flex flex-col items-center">
            <Image
              src={memojiImage}
              className="size-[100px]"
              alt="Person Peeking from behind laptop"
            />
            <div className="bg-gray-950 border border-gray-800 px-4 py-1.5 inline-flex items-center gap-4 rounded-lg">
              <div className="bg-green-500 size-2.5 rounded-full relative">
                <div className="bg-green-500 absolute inset-0 rounded-full animate-ping-large"></div>
              </div>
              <div className="text-sm font-medium">
                Available for new Project
              </div>
            </div>
          </div>
          <div className="max-w-lg mx-auto">
            <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide">
              <TypewriterEffect
                words={words}
                className="text-center mt-8 tracking-wide"
              />
            </h1>
            <p className="mt-4 text-center text-white/60 md:text-lg">
              <TextGenerateEffect
                words="I specialize in transforming designs into functional,
              high-performing web applications. Let&lsquo;s discuss your next
              project."
              />
            </p>
          </div>
          <div className="flex justify-center flex-col md:flex-row items-center mt-8 gap-4 ">
            <button
              onClick={() => {
                document
                  .getElementById("project")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 border border-white/15 hover:text-white/35 px-6 h-12 rounded-xl z-30"
            >
              <span className="font-semibold">Explore My Work</span>
              <ArrowDown className="size-4" />
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 border border-white bg-white hover:bg-white/65 text-gray-900 h-12 px-6 rounded-xl z-30"
            >
              <span>👌</span>
              <span className="font-">Let&#39;s Connect</span>
            </button>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};
