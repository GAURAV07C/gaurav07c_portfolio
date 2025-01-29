"use client";
import { motion } from "framer-motion";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import grainImage from "@/assets/images/grain.jpg";
import Link from "next/link";
export const ContactSection = () => {
  return (
    <div id='contact' className="py-16 pt-12 lg:py-24 lg:pt-20">
      <div className="container">
        <div className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 py-8 px-10 rounded-3xl text-center md:text-left relative overflow-hidden z-0">
          <div
            className="absolute inset-0 opacity-5 -z-10"
            style={{
              backgroundImage: `url(${grainImage.src})`,
            }}
          ></div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="">
              <h2 className="font-serif text-2xl md:text-3xl">
                Let&apos;s create something together
              </h2>
              <p className="text-sm md:text-base mt-2 ">
                Ready to bring your next project to life? Let&apos;s connect and
                disscuss how I can help you achieve your goals.Just shoot me a{" "}
                <Link href="https://x.com/gaurav07c">
                  <span className="text-purple-700 font-semibold font-serif">
                    {" "}
                    dm with a direct question on twitter
                  </span>
                </Link>{" "}
                and I&apos;ll respond whenever I can
              </p>
            </div>
            <div>
              <motion.button
                whileTap={{
                  scale: 1.2,
                  
                }}
                className="text-white bg-gray-900 inline-flex items-center px-6 h-12 rounded-xl gap-2 w-max border border-gray-950"
              >
                <Link href={"mailto:gaurav07c@gmail.com"}>
                  <span className="font-semibold">Contact Me</span>
                </Link>

                <ArrowUpRightIcon className="size-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
