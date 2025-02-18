import Link from "next/link";
import { Github, Twitter, LinkedinIcon, InstagramIcon } from "lucide-react";
import BlurFade from "@/components/BlurFade";
const footerlinks = [
  {
    title: Twitter,
    href: "https://x.com/gaurav07c",
  },
  {
    title: Github,
    href: "https://github.com/GAURAV07C/",
  },
  {
    title: LinkedinIcon,
    href: "https://www.linkedin.com/in/gaurav07c/",
  },
  {
    title: InstagramIcon,
    href: "https://www.instagram.com/gaurav07cc/",
  },
];

export const Footer = () => {
  return (
    <footer className="relative -z-10 overflow-x-clip ">
      
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10 "></div>
      <BlurFade>
        <div className="container z-30">
          <div className="border-t border-white/15 py-5 text-sm flex flex-col md:flex-row md:justify-between  items-center gap-8">
            <div className="text-white/60">Made with ❤️ by Gaurav</div>
            <nav className="flex flex-row md:flex-row items-center gap-8 z-50">
              {footerlinks.map((links, id) => (
                <button key={id}>
                  <Link
                    key={id}
                    href={links.href}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span className="font-semibold">{<links.title />}</span>
                  </Link>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </BlurFade>
    </footer>
  );
};
