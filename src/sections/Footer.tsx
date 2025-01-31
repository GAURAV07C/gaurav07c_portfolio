import Link from "next/link";

import BlurFade from "@/components/BlurFade";
const footerlinks = [
  {
    title: "X",
    href: "https://x.com/gaurav07c",
  },
  {
    title: "G",
    href: "https://github.com/GAURAV07C/",
  },
  {
    title: "L",
    href: "https://www.linkedin.com/in/gaurav07c/",
  },
  {
    title: "I",
    href: "https://www.instagram.com/gaurav07cc/",
  },
];

export const Footer = () => {
  return (
    <footer className="relative -z-10 overflow-x-clip ">
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10 "></div>
      <BlurFade>
        <div className="container">
          <div className="border-t border-white/15 py-5 text-sm flex flex-col md:flex-row md:justify-between  items-center gap-8">
            <div className="text-white/40">Made with ❤️ by Gaurav</div>
            <nav className="flex flex-row md:flex-row items-center gap-8">
              {footerlinks.map((links) => (
                <Link
                  key={links.title}
                  href={links.href}
                  className="inline-flex items-center gap-1.5"
                >
                  <span className="font-semibold">{links.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </BlurFade>
    </footer>
  );
};
