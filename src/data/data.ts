import devaAurasion from "@/assets/images/DevaAurasion.png";
import Portfolio from "@/assets/images/Portfolio.png";
import Aisas from "@/assets/images/ai-startup-landing-page.png";
import ProjectHub from "@/assets/images/projectHub.png";
import ainotes from "@/assets/images/ai-notes.png";
// import lightSaasLandingPage from "@/assets/images/light-saas-landing-page.png";

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

import Prisma from "@/assets/icons/prisma.svg";

import WebSocket from "@/assets/icons/websocket.svg";

export const BLUR_FADE_DELAY = 0.04;

export const portfolioProjects = [
  {
    company: "April ",
    year: "2025 ",
    title: " Mini AI-Powered Notes App ",
    results: [
      {
        title:
          "Developed an amazing AI-Powered Notes App, a full-stack application that allows users to create, edit, and delete notes. The app uses gemai  API to summarize notes based on user input. I implemented Next.js for a fast and seamless experience, Tanstack Query for efficient data fetching, and Supabase for secure authentication and database management. This app is perfect for students and professionals who want to keep their notes organized and easily accessible.",
      },
    ],
    techStack: [
      {
        title: "Next.js",
      },
      {
        title: "Tanstack Query",
      },
      {
        title: "Typescript",
      },
      {
        title: "gemnai",
      },
      {
        title: "Shadcn UI",
      },
      {
        title: "Postgres SQL",
      },
      {
        title: "Supabase",
      },
    ],
    link: "https://ai-notes-app-azure.vercel.app/",
    source: "https://github.com/GAURAV07C/ai-notes-app",
    image: ainotes,
  },
  {
    company: "Feb ",
    year: "2025 ",
    title: "Project Hub ",
    results: [
      {
        title:
          "Developed an amazing Project Hub platform, a full-stack social platform where students can showcase their projects, discuss ideas, and collaborate. 🚀 I implemented Next.js for a fast and seamless experience, Tailwind CSS and ShadCN UI for a modern and intuitive design, and Auth.js for secure authentication, including two-factor authentication. This platform allows students to share their work, get feedback, and engage with a like-minded community. 🔥",
      },
    ],
    techStack: [
      {
        title: "Next.js",
      },
      {
        title: "React.js",
      },
      {
        title: "Typescript",
      },
      {
        title: "TailwindCSS",
      },
      {
        title: "Shadcn UI",
      },
      {
        title: "Postgres SQL",
      },
      {
        title: "Auth Js",
      },
    ],
    link: "https://project-hub-rho.vercel.app/",
    source: "https://github.com/GAURAV07C/ProjectHub",
    image: ProjectHub,
  },
  {
    company: "DevAurasion",
    year: "2024",
    title: "DevAurasion Landing Page",
    results: [
      {
        title:
          "Developed a stunning landing page for DevaAurasion Community, built with Next.js, React.js, Tailwind CSS, and Framer Motion, offers a highly responsive and visually engaging experience. Designed with a strong focus on aesthetics and fluid animations, it provides a seamless user interface across all devices, ensuring a captivating first impression for visitors.",
      },
    ],
    techStack: [
      {
        title: "Next.js",
      },
      {
        title: "React.js",
      },
      {
        title: "Typescript",
      },
      {
        title: "TailwindCSS",
      },
      {
        title: "Shadcn UI",
      },
    ],
    link: "https://devaurasion.vercel.app/",
    source: "https://github.com/GAURAV07C/DevAurasion",
    image: devaAurasion,
  },
  {
    company: "Jan",
    year: "2025",
    title: "Portfolio ",
    results: [
      {
        title:
          "Developed an amazing Portfolio to showase my work to potentiol recruiters. I used latest web desiging techniques like TailwindCSS and Shadcn UI to make it look good and Next.js to make it fast.",
      },
    ],
    techStack: [
      {
        title: "Next.js",
      },
      {
        title: "React.js",
      },
      {
        title: "Typescript",
      },
      {
        title: "TailwindCSS",
      },
      {
        title: "Shadcn UI",
      },
    ],
    link: "https://gaurav07c.vercel.app/",
    source: "https://github.com/GAURAV07C/gaurav07c_portfolio",
    image: Portfolio,
  },
  {
    company: "Dec",
    year: "2024",
    title: "AI Landing Page",
    results: [
      {
        title:
          "Developed a stunning landing page, built with Next.js, React.js, Tailwind CSS, and Framer Motion, offers a highly responsive and visually engaging experience. Designed with a strong focus on aesthetics and fluid animations, it provides a seamless user interface across all devices, ensuring a captivating first impression for visitors.",
      },
    ],
    techStack: [
      {
        title: "Next.js",
      },
      {
        title: "React.js",
      },
      {
        title: "Typescript",
      },
      {
        title: "TailwindCSS",
      },
      {
        title: "Shadcn UI",
      },
    ],
    link: "https://ai-landing-page-virid.vercel.app/",
    source: "https://github.com/GAURAV07C/AI-Landing_Page",
    image: Aisas,
  },

  // {
  //   company: "",
  //   year: "",
  //   title: "Dark Saas Landing Page",
  //   results: [
  //     { title: "Enhanced user experience by 40%" },
  //     { title: "Improved site speed by 50%" },
  //     { title: "Increased mobile traffic by 35%" },
  //   ],
  //   techStack: [
  //     {
  //       title: "Next.js",
  //     },
  //     {
  //       title: "React.js",
  //     },
  //     {
  //       title: "Typescript",
  //     },
  //     {
  //       title: "TailwindCSS",
  //     },
  //     {
  //       title: "Shadcn UI",
  //     },
  //   ],
  //   link: "",
  //   source: "",
  //   image: darkSaasLandingPage,
  // },
  // {
  //   company: "",
  //   year: "",
  //   title: "Light Saas Landing Page",
  //   results: [
  //     { title: "Boosted sales by 20%" },
  //     { title: "Expanded customer reach by 35%" },
  //     { title: "Increased brand awareness by 15%" },
  //   ],
  //   techStack: [
  //     {
  //       title: "Next.js",
  //     },
  //     {
  //       title: "React.js",
  //     },
  //     {
  //       title: "Typescript",
  //     },
  //     {
  //       title: "TailwindCSS",
  //     },
  //     {
  //       title: "Shadcn UI",
  //     },
  //   ],
  //   link: "",
  //   source: "",
  //   image: lightSaasLandingPage,
  // },
  // {
  //   company: "",
  //   year: "",
  //   title: "AI Startup Landing Page",
  //   results: [
  //     {
  //       title:
  //         "Developed a stunning landing page, built with Next.js, React.js, Tailwind CSS, and Framer Motion, offers a highly responsive and visually engaging experience. Designed with a strong focus on aesthetics and fluid animations, it provides a seamless user interface across all devices, ensuring a captivating first impression for visitors.",
  //     },
  //   ],
  //   techStack: [
  //     {
  //       title: "Next.js",
  //     },
  //     {
  //       title: "React.js",
  //     },
  //     {
  //       title: "Typescript",
  //     },
  //     {
  //       title: "TailwindCSS",
  //     },
  //     {
  //       title: "Shadcn UI",
  //     },
  //   ],
  //   link: "",
  //   source: "",
  //   image: aiStartupLandingPage,
  // },
];

export const toolsBoxItem = [
  {
    title: "JavaScript",
    iconsType: JavaScriptIcon,
  },
  {
    title: "HTML5",
    iconsType: HTMLIcon,
  },
  {
    title: "CSS3",
    iconsType: CssIcon,
  },
  {
    title: "React",
    iconsType: ReactIcon,
  },

  {
    title: "Chrome",
    iconsType: ChromeIcon,
  },
  {
    title: "Github",
    iconsType: GitubIcon,
  },
  {
    title: "Zustand",
    iconsType: Zustand,
  },
  {
    title: "Redux",
    iconsType: Redux,
  },
  {
    title: "Node.js",
    iconsType: Node,
  },
  {
    title: "Next.js",
    iconsType: NextJs,
  },
  {
    title: "Redis",
    iconsType: Redis,
  },
  {
    title: "MongoDB",
    iconsType: MongoDb,
  },
  {
    title: "Prisma",
    iconsType: Prisma,
  },
  {
    title: "PostgresSQL",
    iconsType: PostGress,
  },
  {
    title: "WebSocket",
    iconsType: WebSocket,
  },
];

export const hobbies = [
  {
    title: "Photography",
    emoji: "📷",
    left: "50%",
    top: "5%",
  },

  {
    title: "Gaming",
    emoji: "🎮",
    left: "10%",
    top: "35%",
  },
  {
    title: "Music",
    emoji: "🎶",
    left: "70%",
    top: "45%",
  },
  {
    title: "Fitness",
    emoji: "🏋️",
    left: "5%",
    top: "65%",
  },
  {
    title: "Reading",
    emoji: "📚",
    left: "45%",
    top: "70%",
  },
];

export const words = [
  "Performant",
  "Accesssible",
  "Secure",
  "Interactive",
  "Scalable",
  "User Friendly",
  "Responsive",
  "Maintainable",
  "Search Optimized",
  "Usable",
  "Reliable",
];

export const herOrbit = [
  {
    size: 430,
    rotation: -14,
    spinDuration: "30s",

    starType: "sparkle",
    starDuration: "3s",
    className: "size-8 text-emerald-300/20",
  },
];
