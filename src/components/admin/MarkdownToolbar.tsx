"use client";

import React from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}

export function ToolbarButton({ onClick, title, children, active }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition text-xs font-medium ${
        active
          ? "bg-white/20 text-white"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

interface ToolbarSeparatorProps {
  className?: string;
}

export function ToolbarSeparator({ className = "" }: ToolbarSeparatorProps) {
  return <div className={`w-px h-4 bg-white/10 mx-1 ${className}`} />;
}
