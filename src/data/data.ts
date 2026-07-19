import devaAurasion from "@/assets/images/DevaAurasion.png";
import Portfolio from "@/assets/images/Portfolio.png";
import Aisas from "@/assets/images/ai-startup-landing-page.png";
import ProjectHub from "@/assets/images/projectHub.png";
import ainotes from "@/assets/images/ai-notes.png";
import watchTogether from "@/assets/images/watch-together.png";

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

export const siteConfig = {
  hero: {
    words: [
      { text: "Building", className: "text-white text-3xl md:text-5xl font-serif" },
      { text: "Exceptional", className: "text-white text-3xl md:text-5xl font-serif" },
      { text: "User", className: "text-white text-3xl md:text-5xl font-serif" },
      { text: "Experience", className: "text-white text-3xl md:text-5xl font-serif" },
    ],
    description: "I specialize in transforming designs into functional, high-performing web applications. Let's discuss your next project."
  },
  aboutMe: "I’m a passionate pre-final year undergrad with a deep love for coding and technology. My journey has led me to develop a strong foundation in Web development and the emerging world of Web3. I thrive on building innovative products. Always eager to expand my skills and tackle new challenges, I’m actively seeking lucrative opportunities to leverage my tech expertise and drive impactful projects. Whether it’s through creating seamless web experiences or exploring the future of decentralized applications, I’m excited to contribute to the tech landscape and grow alongside it."
};

export const socialLinks = [
  { name: "Twitter", href: "https://x.com/gaurav07c" },
  { name: "Github", href: "https://github.com/GAURAV07C/" },
  { name: "Linkedin", href: "https://www.linkedin.com/in/gaurav07c/" },
  { name: "Instagram", href: "https://www.instagram.com/gaurav07cc/" },
];

export const portfolioProjects = [
  {
    company: "Dec",
    year: "2025",
    title: "Watch Together App",
    results: [
      {
        title:
          "Developed a real-time Watch Together platform that allows multiple users to watch YouTube videos in sync while chatting. Implemented WebSocket-based signaling for room management and playback synchronization, ensuring minimal latency and a smooth shared viewing experience using WebRTC and React.",
      },
    ],
    techStack: [
      { title: "React" },
      { title: "WebRTC" },
      { title: "WebSockets" },
      { title: "Node.js" },
      { title: "JavaScript" },
    ],
    liveLink: "https://watchtogetherstream.onrender.com/",
    sourceLink: "https://github.com/GAURAV07C/WatchTogetherStream.git",
    demoLink: "",
    image: watchTogether,
  },
  {
    company: "April",
    year: "2025",
    title: "Mini AI-Powered Notes App",
    results: [
      {
        title:
          "Developed an amazing AI-Powered Notes App, a full-stack application that allows users to create, edit, and delete notes. The app uses Gemini API to summarize notes based on user input. I implemented Next.js for a fast and seamless experience, Tanstack Query for efficient data fetching, and Supabase for secure authentication and database management. This app is perfect for students and professionals who want to keep their notes organized and easily accessible.",
      },
    ],
    techStack: [
      { title: "Next.js" },
      { title: "Tanstack Query" },
      { title: "Typescript" },
      { title: "Gemini API" },
      { title: "Shadcn UI" },
      { title: "PostgreSQL" },
      { title: "Supabase" },
    ],
    liveLink: "https://ai-notes-app-azure.vercel.app/",
    sourceLink: "https://github.com/GAURAV07C/ai-notes-app",
    demoLink: "",
    image: ainotes,
  },
  {
    company: "Feb",
    year: "2025",
    title: "Project Hub",
    results: [
      {
        title:
          "Developed an amazing Project Hub platform, a full-stack social platform where students can showcase their projects, discuss ideas, and collaborate. 🚀 I implemented Next.js for a fast and seamless experience, Tailwind CSS and ShadCN UI for a modern and intuitive design, and Auth.js for secure authentication, including two-factor authentication. This platform allows students to share their work, get feedback, and engage with a like-minded community. 🔥",
      },
    ],
    techStack: [
      { title: "Next.js" },
      { title: "React.js" },
      { title: "Typescript" },
      { title: "TailwindCSS" },
      { title: "Shadcn UI" },
      { title: "PostgreSQL" },
      { title: "Auth.js" },
    ],
    liveLink: "https://project-hub-rho.vercel.app/",
    sourceLink: "https://github.com/GAURAV07C/ProjectHub",
    demoLink: "",
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
      { title: "Next.js" },
      { title: "React.js" },
      { title: "Typescript" },
      { title: "TailwindCSS" },
      { title: "Shadcn UI" },
    ],
    liveLink: "https://devaurasion.vercel.app/",
    sourceLink: "https://github.com/GAURAV07C/DevAurasion",
    demoLink: "",
    image: devaAurasion,
  },
  {
    company: "Jan",
    year: "2025",
    title: "Portfolio",
    results: [
      {
        title:
          "Developed an amazing Portfolio to showcase my work to potential recruiters. I used latest web desiging techniques like TailwindCSS and Shadcn UI to make it look good and Next.js to make it fast.",
      },
    ],
    techStack: [
      { title: "Next.js" },
      { title: "React.js" },
      { title: "Typescript" },
      { title: "TailwindCSS" },
      { title: "Shadcn UI" },
    ],
    liveLink: "https://gaurav07c.vercel.app/",
    sourceLink: "https://github.com/GAURAV07C/gaurav07c_portfolio",
    demoLink: "",
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
      { title: "Next.js" },
      { title: "React.js" },
      { title: "Typescript" },
      { title: "TailwindCSS" },
      { title: "Shadcn UI" },
    ],
    liveLink: "https://ai-landing-page-virid.vercel.app/",
    sourceLink: "https://github.com/GAURAV07C/AI-Landing_Page",
    demoLink: "",
    image: Aisas,
  },
];

export const blogs = [
  {
    id: "1",
    title: "Understanding React Server Components",
    date: "July 12, 2026",
    excerpt: "A deep dive into how React Server Components are changing the way we build web applications. We'll explore the benefits and trade-offs.",
    content: "React Server Components (RSC) introduce a new way of building React applications. By allowing components to render exclusively on the server, we can significantly reduce the amount of JavaScript sent to the client. This leads to faster page loads and improved SEO. In this post, we explore the core concepts behind RSC, how they differ from traditional Server-Side Rendering (SSR), and practical examples of when to use them.",
    link: "/blog/1",
    image: ainotes
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS in 2026",
    date: "June 25, 2026",
    excerpt: "Tips and tricks for building scalable and maintainable design systems with Tailwind CSS, leveraging the latest features.",
    content: "Tailwind CSS has become the go-to utility-first CSS framework. In 2026, with the introduction of new features and better integration with component libraries like Shadcn UI, mastering Tailwind is more important than ever. We'll cover advanced configuration, creating reusable design tokens, and avoiding common pitfalls when working with large teams.",
    link: "/blog/2",
    image: ProjectHub
  }
];

export const toolsBoxItem = [
  { title: "JavaScript", iconsType: JavaScriptIcon },
  { title: "HTML5", iconsType: HTMLIcon },
  { title: "CSS3", iconsType: CssIcon },
  { title: "React", iconsType: ReactIcon },
  { title: "Chrome", iconsType: ChromeIcon },
  { title: "Github", iconsType: GitubIcon },
  { title: "Zustand", iconsType: Zustand },
  { title: "Redux", iconsType: Redux },
  { title: "Node.js", iconsType: Node },
  { title: "Next.js", iconsType: NextJs },
  { title: "Redis", iconsType: Redis },
  { title: "MongoDB", iconsType: MongoDb },
  { title: "Prisma", iconsType: Prisma },
  { title: "PostgresSQL", iconsType: PostGress },
  { title: "WebSocket", iconsType: WebSocket },
];

export const hobbies = [
  { title: "Photography", emoji: "📷", left: "50%", top: "5%" },
  { title: "Gaming", emoji: "🎮", left: "10%", top: "35%" },
  { title: "Music", emoji: "🎶", left: "70%", top: "45%" },
  { title: "Fitness", emoji: "🏋️", left: "5%", top: "65%" },
  { title: "Reading", emoji: "📚", left: "45%", top: "70%" },
];

export const words = [
  "Performant", "Accesssible", "Secure", "Interactive", "Scalable", 
  "User Friendly", "Responsive", "Maintainable", "Search Optimized", 
  "Usable", "Reliable"
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
