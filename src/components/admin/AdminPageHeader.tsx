"use client";

import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-3 text-white">{title}</h1>
          <p className="text-white/60 text-lg">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
