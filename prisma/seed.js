const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.tapeWord.deleteMany();
  await prisma.heroOrbit.deleteMany();
  await prisma.hobby.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.docTopic.deleteMany();

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "admin123"
    }
  });

  await prisma.siteSettings.create({
    data: {
      id: "global",
      heroWords: JSON.stringify([
        { text: "Building", className: "text-white text-3xl md:text-5xl font-serif" },
        { text: "Exceptional", className: "text-white text-3xl md:text-5xl font-serif" },
        { text: "User", className: "text-white text-3xl md:text-5xl font-serif" },
        { text: "Experience", className: "text-white text-3xl md:text-5xl font-serif" },
      ]),
      heroDesc: "I specialize in transforming designs into functional, high-performing web applications. Let's discuss your next project.",
      aboutMe: "I'm a passionate pre-final year undergrad with a deep love for coding and technology. My journey has led me to develop a strong foundation in Web development and the emerging world of Web3. I thrive on building innovative products. Always eager to expand my skills and tackle new challenges, I'm actively seeking lucrative opportunities to leverage my tech expertise and drive impactful projects. Whether it's through creating seamless web experiences or exploring the future of decentralized applications, I'm excited to contribute to the tech landscape and grow alongside it.",
      socialLinks: JSON.stringify([
        { name: "Twitter", href: "https://x.com/gaurav07c" },
        { name: "Github", href: "https://github.com/GAURAV07C/" },
        { name: "Linkedin", href: "https://www.linkedin.com/in/gaurav07c/" },
      ]),
      resume: "https://resume-lemon-rho.vercel.app/",
      introductionWords: JSON.stringify([
        { text: "Hi", className: "text-white text-6xl" },
        { text: "I'm", className: "text-white text-6xl" },
        { text: "Gaurav", className: "text-white text-6xl" },
      ])
    }
  });

  const projects = [
    {
      company: "Dec",
      year: "2025",
      title: "Watch Together App",
      slug: "watch-together-app",
      results: JSON.stringify([{ title: "Developed a real-time Watch Together platform that allows multiple users to watch YouTube videos in sync while chatting. Implemented WebSocket-based signaling for room management and playback synchronization, ensuring minimal latency and a smooth shared viewing experience using WebRTC and React." }]),
      techStack: JSON.stringify([{ title: "React" }, { title: "WebRTC" }, { title: "WebSockets" }, { title: "Node.js" }, { title: "JavaScript" }]),
      liveLink: "https://watchtogetherstream.onrender.com/",
      sourceLink: "https://github.com/GAURAV07C/WatchTogetherStream.git",
      demoLink: "",
      image: "/images/watch-together.png"
    },
    {
      company: "April",
      year: "2025",
      title: "Mini AI-Powered Notes App",
      slug: "ai-notes-app",
      results: JSON.stringify([{ title: "Developed an amazing AI-Powered Notes App, a full-stack application that allows users to create, edit, and delete notes. The app uses Gemini API to summarize notes based on user input. I implemented Next.js for a fast and seamless experience, Tanstack Query for efficient data fetching, and Supabase for secure authentication and database management. This app is perfect for students and professionals who want to keep their notes organized and easily accessible." }]),
      techStack: JSON.stringify([{ title: "Next.js" }, { title: "Tanstack Query" }, { title: "Typescript" }, { title: "Gemini API" }, { title: "Shadcn UI" }, { title: "PostgreSQL" }, { title: "Supabase" }]),
      liveLink: "https://ai-notes-app-azure.vercel.app/",
      sourceLink: "https://github.com/GAURAV07C/ai-notes-app",
      demoLink: "",
      image: "/images/ai-notes.png"
    },
    {
      company: "Feb",
      year: "2025",
      title: "Project Hub",
      slug: "project-hub",
      results: JSON.stringify([{ title: "Developed an amazing Project Hub platform, a full-stack social platform where students can showcase their projects, discuss ideas, and collaborate. I implemented Next.js for a fast and seamless experience, Tailwind CSS and ShadCN UI for a modern and intuitive design, and Auth.js for secure authentication, including two-factor authentication. This platform allows students to share their work, get feedback, and engage with a like-minded community." }]),
      techStack: JSON.stringify([{ title: "Next.js" }, { title: "React.js" }, { title: "Typescript" }, { title: "TailwindCSS" }, { title: "Shadcn UI" }, { title: "PostgreSQL" }, { title: "Auth.js" }]),
      liveLink: "https://project-hub-rho.vercel.app/",
      sourceLink: "https://github.com/GAURAV07C/ProjectHub",
      demoLink: "",
      image: "/images/projectHub.png"
    },
    {
      company: "DevAurasion",
      year: "2024",
      title: "DevAurasion Landing Page",
      slug: "devaurasion-landing-page",
      results: JSON.stringify([{ title: "Developed a stunning landing page for DevaAurasion Community, built with Next.js, React.js, Tailwind CSS, and Framer Motion, offers a highly responsive and visually engaging experience. Designed with a strong focus on aesthetics and fluid animations, it provides a seamless user interface across all devices, ensuring a captivating first impression for visitors." }]),
      techStack: JSON.stringify([{ title: "Next.js" }, { title: "React.js" }, { title: "Typescript" }, { title: "TailwindCSS" }, { title: "Shadcn UI" }]),
      liveLink: "https://devaurasion.vercel.app/",
      sourceLink: "https://github.com/GAURAV07C/DevAurasion",
      demoLink: "",
      image: "/images/DevaAurasion.png"
    },
    {
      company: "Jan",
      year: "2025",
      title: "Portfolio",
      slug: "portfolio-website",
      results: JSON.stringify([{ title: "Developed an amazing Portfolio to showcase my work to potential recruiters. I used latest web designing techniques like TailwindCSS and Shadcn UI to make it look good and Next.js to make it fast." }]),
      techStack: JSON.stringify([{ title: "Next.js" }, { title: "React.js" }, { title: "Typescript" }, { title: "TailwindCSS" }, { title: "Shadcn UI" }]),
      liveLink: "https://gaurav07c.vercel.app/",
      sourceLink: "https://github.com/GAURAV07C/gaurav07c_portfolio",
      demoLink: "",
      image: "/images/Portfolio.png"
    },
    {
      company: "Dec",
      year: "2024",
      title: "AI Landing Page",
      slug: "ai-landing-page",
      results: JSON.stringify([{ title: "Developed a stunning landing page, built with Next.js, React.js, Tailwind CSS, and Framer Motion, offers a highly responsive and visually engaging experience. Designed with a strong focus on aesthetics and fluid animations, it provides a seamless user interface across all devices, ensuring a captivating first impression for visitors." }]),
      techStack: JSON.stringify([{ title: "Next.js" }, { title: "React.js" }, { title: "Typescript" }, { title: "TailwindCSS" }, { title: "Shadcn UI" }]),
      liveLink: "https://ai-landing-page-virid.vercel.app/",
      sourceLink: "https://github.com/GAURAV07C/AI-Landing_Page",
      demoLink: "",
      image: "/images/ai-startup-landing-page.png"
    }
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  const blogs = [
    {
      title: "Understanding React Server Components",
      slug: "understanding-react-server-components",
      date: "July 12, 2026",
      excerpt: "A deep dive into how React Server Components are changing the way we build web applications. We'll explore the benefits and trade-offs.",
      content: "React Server Components (RSC) introduce a new way of building React applications. By allowing components to render exclusively on the server, we can significantly reduce the amount of JavaScript sent to the client. This leads to faster page loads and improved SEO. In this post, we explore the core concepts behind RSC, how they differ from traditional Server-Side Rendering (SSR), and practical examples of when to use them.",
      link: "/blog/understanding-react-server-components",
      image: "/images/ai-notes.png"
    },
    {
      title: "Mastering Tailwind CSS in 2026",
      slug: "mastering-tailwind-css-2026",
      date: "June 25, 2026",
      excerpt: "Tips and tricks for building scalable and maintainable design systems with Tailwind CSS, leveraging the latest features.",
      content: "Tailwind CSS has become the go-to utility-first CSS framework. In 2026, with the introduction of new features and better integration with component libraries like Shadcn UI, mastering Tailwind is more important than ever. We'll cover advanced configuration, creating reusable design tokens, and avoiding common pitfalls when working with large teams.",
      link: "/blog/mastering-tailwind-css-2026",
      image: "/images/projectHub.png"
    }
  ];

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }

  const tapeWords = [
    "Performant", "Accesssible", "Secure", "Interactive", "Scalable",
    "User Friendly", "Responsive", "Maintainable", "Search Optimized",
    "Usable", "Reliable"
  ];

  for (const word of tapeWords) {
    await prisma.tapeWord.create({ data: { word } });
  }

  const heroOrbits = [
    { size: 430, rotation: -14, spinDuration: "30s", starType: "sparkle", starDuration: "3s", className: "size-8 text-emerald-300/20" },
  ];

  for (const orbit of heroOrbits) {
    await prisma.heroOrbit.create({ data: orbit });
  }

  const hobbies = [
    { title: "Photography", emoji: "📷", left: "50%", top: "5%" },
    { title: "Gaming", emoji: "🎮", left: "10%", top: "35%" },
    { title: "Music", emoji: "🎶", left: "70%", top: "45%" },
    { title: "Fitness", emoji: "🏋️", left: "5%", top: "65%" },
    { title: "Reading", emoji: "📚", left: "45%", top: "70%" },
  ];

  for (const hobby of hobbies) {
    await prisma.hobby.create({ data: hobby });
  }

  const skills = [
    { title: "Next.js", iconsType: "NextJs" },
    { title: "React", iconsType: "ReactIcon" },
    { title: "JavaScript", iconsType: "JavaScript" },
    { title: "TypeScript", iconsType: "JavaScript" },
    { title: "Node.js", iconsType: "Node" },
    { title: "Git", iconsType: "GitubIcon" },
    { title: "MongoDB", iconsType: "MongoDb" },
    { title: "Postgres", iconsType: "PostGress" },
    { title: "Docker", iconsType: "ChromeIcon" },
    { title: "Linux", iconsType: "ChromeIcon" },
    { title: "GitHub Actions", iconsType: "GitubIcon" },
    { title: "Prisma", iconsType: "Prisma" },
    { title: "MonoRepo", iconsType: "ChromeIcon" },
    { title: "WebSocket", iconsType: "WebSocket" },
    { title: "Redis", iconsType: "Redis" },
    { title: "GraphQL", iconsType: "ChromeIcon" },
    { title: "CI/CD", iconsType: "ChromeIcon" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { title: skill.title },
      update: {},
      create: skill
    });
  }

  const tools = [
    { title: "JavaScript", iconName: "JavaScript" },
    { title: "HTML5", iconName: "HTMLIcon" },
    { title: "CSS3", iconName: "CssIcon" },
    { title: "React", iconName: "ReactIcon" },
    { title: "Chrome", iconName: "ChromeIcon" },
    { title: "Github", iconName: "GitubIcon" },
    { title: "Zustand", iconName: "Zustand" },
    { title: "Redux", iconName: "Redux" },
    { title: "Node.js", iconName: "Node" },
    { title: "Next.js", iconName: "NextJs" },
    { title: "Redis", iconName: "Redis" },
    { title: "MongoDB", iconName: "MongoDb" },
    { title: "Prisma", iconName: "Prisma" },
    { title: "PostgresSQL", iconName: "PostGress" },
    { title: "WebSocket", iconName: "WebSocket" },
  ];

  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }

  const education = [
    {
      school: "100xDevs",
      href: "https://app.100xdevs.com",
      degree: "Full Stack Web Development, DevOps & Web3 Bootcamp",
      logoUrl: "/100xDevs.png",
      start: "2023",
      end: "2024",
    },
    {
      school: "Kalasalingam University",
      href: "https://www.kalasalingam.ac.in/",
      degree: "Bachelor's Degree of Engineering",
      logoUrl: "/kalsalingam.jpeg",
      start: "2022",
      end: "2026",
    },
  ];

  for (const edu of education) {
    await prisma.education.create({ data: edu });
  }

  const experiences = [
    {
      company: "Sprinpak Manufacturing LLP",
      href: "",
      badges: JSON.stringify([]),
      location: "Gurgon Bilaspur",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "JULY 2025",
      end: "PRESENT",
      description: "Developed automation-driven production planning tools and internal applications by designing user-friendly interfaces, streamlining production workflows, and integrating real-time data tracking, resulting in improved operational efficiency and smoother team collaboration.",
    },
    {
      company: "Save Rush",
      href: "",
      badges: JSON.stringify([]),
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "MARCH 2025",
      end: "JULY 2025",
      description: "Built scalable backend APIs for a real-time flash sale platform using Node.js, MongoDB, Redis, focusing on performance, concurrency, and seamless frontend integration.",
    },
    {
      company: "DevAurasion Community",
      href: "",
      badges: JSON.stringify([]),
      location: "Remote",
      title: "Full Stack Developer",
      logoUrl: "/memoji.jpeg",
      start: "DEC 2024",
      end: "FEB 2025",
      description: "Built responsive and interactive user interfaces for a developer community platform, focusing on usability, performance, and seamless API integration.",
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  const testimonials = [
    {
      name: "Alex Turner",
      position: "Marketing Manager @ TechStartups",
      text: "Alex was instrumental in transforming our website into a powerful marketing tool. His attention to detail and ability to understand our brand is exceptional. We're thrilled with the results!",
      avatar: "/images/memoji-avatar-1.png",
    },
    {
      name: "Olivia Green",
      position: "Head of Design @ GreenLeaf",
      text: "Working with Alex was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
      avatar: "/images/memoji-avatar-2.png",
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }

  const reactTopic = await prisma.docTopic.create({
    data: {
      title: "React",
      slug: "react",
      description: "A comprehensive guide to React.js - from basics to advanced patterns and best practices.",
      icon: "⚛️",
      order: 1,
      pages: {
        create: [
          {
            title: "Introduction to React",
            slug: "introduction",
            content: "# Introduction to React\n\nReact is a **JavaScript library** for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called *components*.\n\n## Why React?\n\n- **Component-based**: Build encapsulated components that manage their own state\n- **Declarative**: Design simple views for each state in your application\n- **Learn Once, Write Anywhere**: You can use React for web, mobile, and desktop\n\n## Quick Start\n\n```bash\nnpm create vite@latest my-react-app -- --template react\ncd my-react-app\nnpm install\nnpm run dev\n```\n\n## Your First Component\n\n```jsx\nimport React from 'react';\n\nfunction Welcome() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default Welcome;\n```\n\n## Key Concepts\n\n1. **JSX**: A syntax extension that allows you to write HTML-like code in JavaScript\n2. **Components**: Reusable building blocks of your UI\n3. **Props**: Read-only data passed from parent to child components\n4. **State**: Mutable data that affects rendering\n5. **Effects**: Side effects like data fetching, subscriptions, or DOM manipulation",
            order: 1,
          },
          {
            title: "Components & Props",
            slug: "components-and-props",
            content: "# Components & Props\n\nComponents are the building blocks of React applications. They accept inputs called *props* and return React elements describing what should appear on screen.\n\n## Functional Components\n\nFunctional components are the simplest way to define a component in React.\n\n```jsx\nfunction Greeting({ name }) {\n  return <p>Hello, {name}!</p>;\n}\n\n// Using the component\n<Greeting name=\"Gaurav\" />\n```\n\n## Props\n\nProps are read-only and help you pass data from parent to child components.\n\n```jsx\nfunction UserCard({ user, age }) {\n  return (\n    <div>\n      <h2>{user}</h2>\n      <p>Age: {age}</p>\n    </div>\n  );\n}\n\n<UserCard user=\"Gaurav\" age={22} />\n```\n\n## Component Composition\n\nComponents can include other components for powerful composition.\n\n```jsx\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <MainContent />\n      <Footer />\n    </div>\n  );\n}\n```\n\n## Best Practices\n\n- Keep components small and focused\n- Use meaningful names\n- Extract reusable logic into custom hooks\n- Avoid deep nesting of components",
            order: 2,
          },
          {
            title: "Hooks in React",
            slug: "hooks",
            content: "# Hooks in React\n\nHooks let you use state and other React features without writing a class. They were introduced in React 16.8.\n\n## useState\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n```\n\n## useEffect\n\n```jsx\nimport { useEffect, useState } from 'react';\n\nfunction Example() {\n  const [width, setWidth] = useState(window.innerWidth);\n\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    \n    // Cleanup\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n\n  return <p>Window width: {width}px</p>;\n}\n```\n\n## useContext\n\n```jsx\nimport { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>I am styled thematically!</button>;\n}\n```\n\n## Custom Hooks\n\n```jsx\nfunction useWindowSize() {\n  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);\n  \n  useEffect(() => {\n    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  \n  return size;\n}\n```",
            order: 3,
          },
        ],
      },
    },
  });

  const nextjsTopic = await prisma.docTopic.create({
    data: {
      title: "Next.js",
      slug: "nextjs",
      description: "Learn Next.js framework - React framework for production with hybrid static & server rendering, TypeScript support, and more.",
      icon: "▲",
      order: 2,
      pages: {
        create: [
          {
            title: "Getting Started with Next.js",
            slug: "getting-started",
            content: "# Getting Started with Next.js\n\nNext.js is a **React framework** that gives you building blocks to create web applications. It handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations.\n\n## Installation\n\n```bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n```\n\n## Features\n\n- **File-system routing**: Define routes using folders and files\n- **Server-side rendering (SSR)**: Render pages on each request\n- **Static site generation (SSG)**: Render pages at build time\n- **API routes**: Build API endpoints as Node.js serverless functions\n- **Built-in CSS support**: Import CSS files and use CSS Modules\n- **Code splitting**: Automatically split code by pages\n\n## Project Structure\n\n```\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n│   └── globals.css\n├── public/\n│   └── favicon.ico\n├── next.config.ts\n└── package.json\n```\n\n## Your First Page\n\n```tsx\n// app/page.tsx\nexport default function Home() {\n  return (\n    <main>\n      <h1>Hello, Next.js!</h1>\n      <p>Welcome to your new Next.js application.</p>\n    </main>\n  );\n}\n```\n\n## Development Workflow\n\n1. Edit `app/page.tsx` and save\n2. The page automatically updates in the browser\n3. Navigate to `http://localhost:3000`\n\n## Production Build\n\n```bash\nnpm run build\nnpm run start\n```\n\nThis creates an optimized production build of your application.",
            order: 1,
          },
          {
            title: "Routing in Next.js",
            slug: "routing",
            content: "# Routing in Next.js\n\nNext.js uses a file-system based router where folders are used to define routes.\n\n## Basic Routing\n\n```\napp/\n  page.tsx       → /\n  about/\n    page.tsx     → /about\n  blog/\n    [slug]/\n      page.tsx   → /blog/:slug\n```\n\n## Dynamic Routes\n\nYou can create dynamic routes by wrapping the folder name in square brackets.\n\n```tsx\n// app/blog/[slug]/page.tsx\nexport default function BlogPost({ params }: { params: { slug: string } }) {\n  return <h1>Blog Post: {params.slug}</h1>;\n}\n```\n\n## Parallel Routes\n\nRender multiple pages in the same layout using parallel routes.\n\n```\napp/\n  @modal/\n    default.tsx\n    (.)login/\n      page.tsx\n  page.tsx\n```\n\n## Intercepting Routes\n\nIntercept routes allow you to load a route from another part of your application inside the current layout.\n\n```\napp/\n  feed/\n    page.tsx\n    @modal/\n      (.)photo/[id]/\n        page.tsx\n```\n\n## Navigation\n\nUse the `Link` component for client-side navigation:\n\n```tsx\nimport Link from 'next/link';\n\n<Link href=\"/about\">About</Link>\n```\n\n## Route Groups\n\nOrganize routes without affecting the URL structure:\n\n```\n(app)/\n  (marketing)/\n    about/\n      page.tsx\n    contact/\n      page.tsx\n  (shop)/\n    products/\n      page.tsx\n```",
            order: 2,
          },
          {
            title: "Data Fetching",
            slug: "data-fetching",
            content: "# Data Fetching in Next.js\n\nNext.js provides several ways to fetch data depending on your use case.\n\n## Server Components\n\nBy default, all components in the App Router are Server Components. You can fetch data directly in them:\n\n```tsx\nasync function getPosts() {\n  const res = await fetch('https://api.example.com/posts', {\n    next: { revalidate: 60 }\n  });\n  return res.json();\n}\n\nexport default async function Blog() {\n  const posts = await getPosts();\n  return posts.map(post => <Post key={post.id} {...post} />);\n}\n```\n\n## Caching Strategies\n\n- **force-static**: Always static, cached forever\n- **force-dynamic**: Always dynamic, never cached\n- **revalidate**: Revalidate after a time period\n\n```tsx\nfetch('https://api.example.com/data', {\n  cache: 'force-cache' // default\n})\n\nfetch('https://api.example.com/data', {\n  cache: 'no-store' // dynamic\n})\n\nfetch('https://api.example.com/data', {\n  next: { revalidate: 3600 } // revalidate every hour\n})\n```\n\n## Loading States\n\nUse loading files for instant loading states:\n\n```tsx\n// app/blog/loading.tsx\nexport default function Loading() {\n  return <div>Loading...</div>;\n}\n```\n\n## Error Handling\n\nUse error.tsx to handle errors in a route segment:\n\n```tsx\n// app/blog/error.tsx\n'use client';\n\nexport default function Error({ error, reset }) {\n  return (\n    <div>\n      <h2>Something went wrong!</h2>\n      <button onClick={() => reset()}>Try again</button>\n    </div>\n  );\n}\n```",
            order: 3,
          },
        ],
      },
    },
  });

  const nodejsTopic = await prisma.docTopic.create({
    data: {
      title: "Node.js",
      slug: "nodejs",
      description: "Node.js tutorial - build scalable network applications with JavaScript on the server. Learn the basics, Express.js, and advanced patterns.",
      icon: "🟢",
      order: 3,
      pages: {
        create: [
          {
            title: "Introduction to Node.js",
            slug: "introduction",
            content: "# Introduction to Node.js\n\nNode.js is an open-source, cross-platform JavaScript runtime environment. It allows you to run JavaScript outside of a web browser, enabling server-side scripting and building scalable network applications.\n\n## Key Features\n\n- **Asynchronous and Event-Driven**: Node.js never waits for an API to return data\n- **Single Threaded but Highly Scalable**: Uses event-driven, non-blocking I/O model\n- **Cross-platform**: Runs on Windows, Linux, Unix, Mac OS X, etc.\n- **NPM Ecosystem**: Access to thousands of reusable packages\n\n## Installation\n\n```bash\n# Using nvm (recommended)\nnvm install --lts\n\n# Verify installation\nnode --version\nnpm --version\n```\n\n## Your First Server\n\n```javascript\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/plain');\n  res.end('Hello from Node.js!');\n});\n\nconst PORT = process.env.PORT || 3000;\nserver.listen(PORT, () => {\n  console.log(`Server running at http://localhost:${PORT}/`);\n});\n```\n\n## Modules\n\nNode.js uses CommonJS modules by default:\n\n```javascript\n// math.js - export functionality\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports = { add };\n\n// app.js - import functionality\nconst { add } = require('./math.js');\nconsole.log(add(2, 3)); // 5\n```\n\n## Event Loop\n\nNode.js is single-threaded but uses an event loop to handle concurrent operations efficiently.",
            order: 1,
          },
          {
            title: "Express.js Framework",
            slug: "expressjs",
            content: "# Express.js Framework\n\nExpress.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.\n\n## Installation\n\n```bash\nnpm install express\n```\n\n## Basic Server\n\n```javascript\nconst express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(PORT, () => {\n  console.log(`Server is running on port ${PORT}`);\n});\n```\n\n## Routing\n\n```javascript\n// Route with parameters\napp.get('/users/:id', (req, res) => {\n  res.send(`User ID: ${req.params.id}`);\n});\n\n// Query parameters\napp.get('/search', (req, res) => {\n  const { q } = req.query;\n  res.send(`Search results for: ${q}`);\n});\n```\n\n## Middleware\n\n```javascript\n// Built-in middleware\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\n\n// Custom middleware\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n```\n\n## Error Handling\n\n```javascript\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Something went wrong!' });\n});\n```",
            order: 2,
          },
          {
            title: "Middleware in Express",
            slug: "middleware",
            content: "# Middleware in Express\n\nMiddleware functions have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.\n\n## Types of Middleware\n\n- **Application-level**: Bound to `app` object\n- **Router-level**: Bound to `express.Router()`\n- **Error-handling**: Takes four arguments\n- **Built-in**: Like `express.static`, `express.json()`\n- **Third-party**: Like `cors`, `helmet`, `morgan`\n\n## Basic Middleware\n\n```javascript\nconst express = require('express');\nconst app = express();\n\n// Logging middleware\napp.use((req, res, next) => {\n  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);\n  next();\n});\n```\n\n## Authentication Middleware\n\n```javascript\nfunction authMiddleware(req, res, next) {\n  const token = req.headers.authorization;\n  \n  if (!token) {\n    return res.status(401).json({ error: 'No token provided' });\n  }\n  \n  try {\n    const decoded = verifyToken(token);\n    req.user = decoded;\n    next();\n  } catch (err) {\n    return res.status(401).json({ error: 'Invalid token' });\n  }\n}\n\n// Protect routes\napp.get('/api/profile', authMiddleware, (req, res) => {\n  res.json({ user: req.user });\n});\n```\n\n## CORS Middleware\n\n```javascript\nconst cors = require('cors');\n\napp.use(cors());\napp.use(cors({ origin: 'https://example.com' }));\n```\n\n## Morgan (Logging)\n\n```javascript\nconst morgan = require('morgan');\napp.use(morgan('combined'));\n```\n\n## Best Practices\n\n- Keep middleware focused and single-purpose\n- Always call `next()` to pass control\n- Handle errors in error-handling middleware\n- Order matters - middleware runs in the order it's defined",
            order: 3,
          },
        ],
      },
    },
  });

  console.log("Seeded all data including docs successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
