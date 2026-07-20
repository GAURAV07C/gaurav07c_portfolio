"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "loaderSeen";

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "reveal">("idle");

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) {
      setReady(true);
      return;
    }

    let revealTimer: ReturnType<typeof setTimeout>;

    // Fixed 10 second debug timer
    setPhase("loading");

    revealTimer = setTimeout(() => {
      setPhase("reveal");
      revealTimer = setTimeout(() => {
        setReady(true);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 1500);
    }, 8500);

    return () => {
      clearTimeout(revealTimer);
    };
  }, []);

  if (ready) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-8">
        {/* Spinning ring */}
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #10b981, #06b6d4, #10b981)",
              animation: "loaderSpin 1.5s linear infinite",
              filter: "blur(3px)",
              opacity: 0.8,
            }}
          />
          
          {/* Photo */}
          <div className="relative size-36 md:size-44 rounded-full overflow-hidden border-4 border-gray-950 z-10">
            <Image
              src="/mypic.png"
              alt="Gaurav Kumar"
              width={500}
              height={500}
              priority
              unoptimized
              className="size-full object-cover object-top"
              style={{
                filter: phase === "reveal" ? "blur(0px)" : "blur(6px)",
                transition: "filter 1.2s ease-out",
              }}
            />
          </div>
        </div>

        {/* Text - always visible during loading */}
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-2">
            Gaurav Kumar
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-emerald-300 font-medium">Loading</span>
            <span className="flex gap-1">
              <span
                className="size-2 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-2 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-2 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loaderSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
