"use client";

import React, { useEffect, useState } from "react";

interface ViewCountProps {
  id: string;
  type: "blog" | "project" | "doc";
}

export function ViewCount({ id, type }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const incrementView = async () => {
      try {
        const res = await fetch(`/api/views/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });
        if (res.ok) {
          const data = await res.json();
          setViews(data.views);
        }
      } catch {
        // silently fail
      }
    };

    incrementView();
  }, [id, type, isClient]);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-2 text-white/50 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
