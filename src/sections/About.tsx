"use client";
import { motion } from "framer-motion";

import Card from "@/components/Card";
// import SectionHeader from "@/components/SectionHeader";
// import myBookImage from "@/assets/images/book-cover.png";
// import Image from "next/image";

// import mapImage from "@/assets/images/map.png";
// import smileMemoji from "@/assets/images/memoji-smile.png";
import CardHeader from "@/components/CardHeader";
import ToolBoxItem from "@/components/ToolBoxItem";
import { useRef } from "react";
import { toolsBoxItem, hobbies } from "@/data/data";

export const AboutSection = () => {
  const constraintRef = useRef(null);
  return (
    <div id="about" className="py-2 lg:py-2">
      <div className="container">
        {/* <SectionHeader
          eyebrow="About Me"
          title="A Glismpse Into My world"
          description="Learn more about who I am , waht I do,what Inspires me."
        /> */}
        <div className="mt-20 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8 ">
            <div className="md:col-span-2 lg:col-span-1">
              {/* <Card className="h-[320px]   ">
                <CardHeader
                  title="My Reads"
                  description="Explore the books my perspectives."
                  className=""
                />

                <div className="w-40 mx-auto mt-2 md:mt-0">
                  <Image src={myBookImage} alt="book-cover" />
                </div>
              </Card> */}
            </div>
            <div className="md:col-span-3 lg:col-span-2 ">
              <Card className="h-[320px] ">
                <CardHeader
                  title="My Toolbox"
                  description="Explore the technologies and tools I use to craft exceptional
                digital experiences."
                />
                <ToolBoxItem
                  items={toolsBoxItem}
                  direction="left"
                  moveValue="50%"
                />

                <ToolBoxItem
                  items={toolsBoxItem}
                  direction="right"
                  className="mt-6  "
                  moveValue="50%"
                  itemWraperClassName="-translate-x-1/2"
                />
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8  ">
            <div className="md:col-span-3 lg:col-span-2 ">
              <Card className="h-[320px] p-0 flex flex-col ">
                <CardHeader
                  title="Beyond the Code"
                  description=" Explore the my intrests and hobbies beyond the digital realm ."
                  className="px-6 py-6"
                />

                <div className="relative flex-1" ref={constraintRef}>
                  {hobbies.map((hobbie) => (
                    <motion.div
                      key={hobbie.title}
                      className="inline-flex items-center gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute"
                      style={{
                        left: hobbie.left,
                        top: hobbie.top,
                      }}
                      drag
                      dragConstraints={constraintRef}
                    >
                      <span className="font-medium text-gray-950">
                        {hobbie.title}
                      </span>
                      <span>{hobbie.emoji}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              {/* <Card className="h-[320px] p-0   ">
                <Image
                  src={mapImage}
                  alt="map"
                  className="h-full w-full object-cover  object-left-top"
                /> */}
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full  after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-gray-950/30">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400"></div>
                  <Image
                    src={smileMemoji}
                    alt="smiling memoji"
                    className="size-20"
                  />
                </div> */}
              {/* </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
