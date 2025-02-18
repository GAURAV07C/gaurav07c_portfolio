import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import BlurFade from "@/components/BlurFade";

const footerlinks = [
  {
    title: <Twitter />,
    href: "https://x.com/gaurav07c",
  },
  {
    title: <Github />,
    href: "https://github.com/GAURAV07C/",
  },
  {
    title: <Linkedin />,
    href: "https://www.linkedin.com/in/gaurav07c/",
  },
  {
    title: <Instagram />,
    href: "https://www.instagram.com/gaurav07cc/",
  },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-x-clip z-10">
      {" "}
      {/* Remove -z-10 */}
      {/* Background effect with pointer-events-none */}
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] pointer-events-none"></div>
      <BlurFade>
        <div className="container">
          <div className="border-t border-white/15 py-5 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8 relative">
            <div className="text-white/60">Made with ❤️ by Gaurav</div>
            <nav className="flex flex-row md:flex-row items-center gap-8 z-50 relative">
              {footerlinks.map((link, id) => (
                <Link
                  key={id}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-white hover:text-gray-400 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </BlurFade>
    </footer>
  );
};
