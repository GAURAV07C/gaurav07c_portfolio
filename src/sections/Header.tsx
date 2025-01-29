"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [highlightPosition, setHighlightPosition] = useState({
    left: 0,
    width: 0,
  });
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleLinkClick = (link: string, index: number) => {
    setActiveLink(link);
    const linkElement = linkRefs.current[index];
    if (linkElement) {
      const { offsetLeft, clientWidth } = linkElement;
      setHighlightPosition({ left: offsetLeft, width: clientWidth });
    }
  };

  // Array of navigation links
  const navLinks = useMemo(
    () => [
      { title: "Home", href: "#home" },
      { title: "Project", href: "#project" },
      { title: "About", href: "#about" },
      { title: "Contact", href: "#contact" },
    ],
    []
  );

  const linkVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
  };

  useEffect(() => {
    // Set initial highlight position for the active link
    const activeIndex = navLinks.findIndex(
      (link) => link.title.toLowerCase() === activeLink
    );
    if (activeIndex !== -1) {
      const linkElement = linkRefs.current[activeIndex];
      if (linkElement) {
        const { offsetLeft, clientWidth } = linkElement;
        setHighlightPosition({ left: offsetLeft, width: clientWidth });
      }
    }
  }, [activeLink, navLinks]);

  return (
    <div className="flex justify-center items-center fixed top-3 w-full z-10">
      <nav className="relative flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur">
        <motion.div
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            left: highlightPosition.left,
            width: highlightPosition.width,
            height: "100%",
            backgroundColor: "white",
            borderRadius: "9999px",
            zIndex: -1,
          }}
        />
        {navLinks.map((link, index) => (
          <motion.div
            key={link.title}
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
            ref={(el) => {
              linkRefs.current[index] = el;
            }}
          >
            <Link
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                activeLink === link.title.toLowerCase()
                  ? "text-gray-900"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              href={link.href}
              onClick={() => handleLinkClick(link.title.toLowerCase(), index)}
            >
              {link.title}
            </Link>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};
