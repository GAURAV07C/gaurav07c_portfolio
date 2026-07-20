"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "loaderSeen";

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "reveal">("idle");

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (seen) {
      setReady(true);
      return;
    }

    let minTimer: ReturnType<typeof setTimeout>;
    let revealTimer: ReturnType<typeof setTimeout>;

    const markReady = () => {
      setPhase("reveal");
      revealTimer = setTimeout(() => {
        setReady(true);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 700);
    };

    if (document.readyState === "complete") {
      minTimer = setTimeout(markReady, 1400);
    } else {
      setPhase("loading");
      window.addEventListener("load", () => {
        minTimer = setTimeout(markReady, 1400);
      });
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  if (ready) return <>{children}</>;

  const showStatic =
    phase === "idle" ||
    (phase === "loading" && document.readyState !== "complete");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="size-28 md:size-36 rounded-full p-[3px]"
            style={{
              background:
                "conic-gradient(from 0deg, #10b981, #06b6d4, #10b981)",
              filter: "blur(1px)",
              animation: "spin 2s linear infinite",
            }}
          />
          <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-950">
            {showStatic ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-300/20 animate-pulse" />
              </div>
            ) : (
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
                  transition: "filter 0.9s ease-out",
                }}
              />
            )}
          </div>
        </div>

        <div
          className="text-center transition-all duration-700 ease-out"
          style={{
            opacity: phase === "loading" ? 1 : phase === "reveal" ? 1 : 0,
            transform:
              phase === "loading" ? "translateY(0)" : "translateY(4px)",
          }}
        >
          <h2 className="font-serif text-xl md:text-2xl text-white mb-1">
            Gaurav Kumar
          </h2>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-white/40">Loading</span>
            <span className="flex gap-0.5">
              <span
                className="size-1 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="size-1 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="size-1 rounded-full bg-emerald-300 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
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
