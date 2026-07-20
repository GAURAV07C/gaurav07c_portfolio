"use client";
import { motion } from "framer-motion";

import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import ToolBoxItem from "@/components/ToolBoxItem";
import { useRef } from "react";

import JavaScriptIcon from "@/assets/icons/square-js.svg";
import HTMLIcon from "@/assets/icons/html5.svg";
import CssIcon from "@/assets/icons/css3.svg";
import ReactIcon from "@/assets/icons/react.svg";
import ChromeIcon from "@/assets/icons/chrome.svg";
import GitubIcon from "@/assets/icons/github.svg";
import Node from "@/assets/icons/node-js.svg";
import NextJs from "@/assets/icons/nextjs.svg";
import Zustand from "@/assets/icons/zustand.svg";
import PostGress from "@/assets/icons/postgreSQL.svg";
import MongoDb from "@/assets/icons/mongoDB.svg";
import Redux from "@/assets/icons/redux.svg";
import Redis from "@/assets/icons/redis.svg";
import PrismaIcon from "@/assets/icons/prisma.svg";
import WebSocketIcon from "@/assets/icons/websocket.svg";
import { useCachedFetch } from "@/hooks/useCachedFetch";

const iconMap: Record<string, React.ElementType> = {
  "JavaScript": JavaScriptIcon,
  "HTMLIcon": HTMLIcon,
  "CssIcon": CssIcon,
  "ReactIcon": ReactIcon,
  "ChromeIcon": ChromeIcon,
  "GitubIcon": GitubIcon,
  "Node": Node,
  "NextJs": NextJs,
  "Zustand": Zustand,
  "PostGress": PostGress,
  "MongoDb": MongoDb,
  "Redux": Redux,
  "Redis": Redis,
  "Prisma": PrismaIcon,
  "WebSocket": WebSocketIcon,
};

export const AboutSection = () => {
  const constraintRef = useRef(null);
  const { data: toolsRaw = [] } = useCachedFetch<{ title: string; iconName: string }[]>({
    key: "tools",
    fetchFn: () => fetch("/api/tools").then(res => res.json()),
  });
  const { data: hobbiesRaw = [] } = useCachedFetch<{ id: string; title: string; emoji: string; left: string; top: string }[]>({
    key: "hobbies",
    fetchFn: () => fetch("/api/hobbies").then(res => res.json()),
  });

  const tools = Array.isArray(toolsRaw) ? toolsRaw : [];
  const hobbies = Array.isArray(hobbiesRaw) ? hobbiesRaw : [];

  const mappedTools = tools.map((tool: { title: string; iconName: string }) => ({
    title: tool.title,
    iconsType: iconMap[tool.iconName] || JavaScriptIcon,
  }));

  return (
    <div id="about" className="py-2 lg:py-2">
      <div className="container">
        <div className="mt-20 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8 ">
            <div className="md:col-span-2 lg:col-span-1">
            </div>
            <div className="md:col-span-3 lg:col-span-2 ">
              <Card className="h-[280px] md:h-[320px]">
                <CardHeader
                  title="My Toolbox"
                  description="Explore the technologies and tools I use to craft exceptional
                digital experiences."
                />
                <ToolBoxItem
                  items={mappedTools}
                  direction="left"
                  moveValue="50%"
                />

                <ToolBoxItem
                  items={mappedTools}
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
              <Card className="h-[280px] md:h-[320px] p-0 flex flex-col">
                <CardHeader
                  title="Beyond the Code"
                  description=" Explore the my intrests and hobbies beyond the digital realm ."
                  className="px-6 py-6"
                />

                <div className="relative flex-1" ref={constraintRef}>
                  {hobbies.map((hobbie) => (
                    <motion.div
                      key={hobbie.id}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
