"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, FileText } from "lucide-react";
import BlurFade from "@/components/BlurFade";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Twitter,
  Github,
  Linkedin,
  Resume: FileText,
};

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<{ name: string; href: string }[]>([]);
  const [resume, setResume] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(settings => {
        if (settings?.socialLinks) {
          setSocialLinks(JSON.parse(settings.socialLinks));
        }
        if (settings?.resume) {
          setResume(settings.resume);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="relative overflow-x-clip">
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/20 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] pointer-events-none" />
      <BlurFade>
        <div className="container">
          <div className="border-t border-white/10 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center md:items-start gap-2">
                <Link href="/" className="font-serif text-2xl tracking-tight text-white">
                  Gaurav<span className="text-emerald-300">.</span>
                </Link>
                <p className="text-white/40 text-sm">
                  Built with precision and passion.
                </p>
              </div>

              <nav className="flex items-center gap-6">
                {resume && (
                  <Link
                    href={resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-emerald-300 hover:border-emerald-300/30 hover:bg-emerald-300/10 transition-all"
                    aria-label="Resume"
                  >
                    <FileText className="size-5" />
                  </Link>
                )}
                {socialLinks.map((link, id) => {
                  const Icon = iconMap[link.name];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={id}
                      href={link.href}
                      className="inline-flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-emerald-300 hover:border-emerald-300/30 hover:bg-emerald-300/10 transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      <Icon className="size-5" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/30 text-xs">
                &copy; {new Date().getFullYear()} Gaurav Kumar. All rights reserved.
              </p>
              <p className="text-white/30 text-xs">
                Designed & Developed with ❤️
              </p>
            </div>
          </div>
        </div>
      </BlurFade>
    </footer>
  );
};
