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
        { name: "Instagram", href: "https://www.instagram.com/gaurav07cc/" },
      ]),
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
      date: "July 12, 2026",
      excerpt: "A deep dive into how React Server Components are changing the way we build web applications. We'll explore the benefits and trade-offs.",
      content: "React Server Components (RSC) introduce a new way of building React applications. By allowing components to render exclusively on the server, we can significantly reduce the amount of JavaScript sent to the client. This leads to faster page loads and improved SEO. In this post, we explore the core concepts behind RSC, how they differ from traditional Server-Side Rendering (SSR), and practical examples of when to use them.",
      link: "/blog/1",
      image: "/images/ai-notes.png"
    },
    {
      title: "Mastering Tailwind CSS in 2026",
      date: "June 25, 2026",
      excerpt: "Tips and tricks for building scalable and maintainable design systems with Tailwind CSS, leveraging the latest features.",
      content: "Tailwind CSS has become the go-to utility-first CSS framework. In 2026, with the introduction of new features and better integration with component libraries like Shadcn UI, mastering Tailwind is more important than ever. We'll cover advanced configuration, creating reusable design tokens, and avoiding common pitfalls when working with large teams.",
      link: "/blog/2",
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

  console.log("Seeded all data successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
