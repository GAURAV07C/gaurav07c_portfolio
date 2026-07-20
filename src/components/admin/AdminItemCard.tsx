"use client";

import React from "react";
import Image from "next/image";

interface AdminItemCardProps {
  title: string;
  subtitle?: string | React.ReactNode;
  image?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export function AdminItemCard({ title, subtitle, image, onView, onEdit, onDelete, children }: AdminItemCardProps) {
  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 hover:border-emerald-300/30 transition-all group flex gap-4">
      {image && (
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-white/40 font-mono mt-1">{subtitle}</div>
        )}
        {children && (
          <div className="mt-2 text-white/50 text-sm line-clamp-2">{children}</div>
        )}
      </div>
      {(onView || onEdit || onDelete) && (
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
          {onView && (
            <button
              onClick={onView}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition text-sm"
              title="View"
            >
              👁️
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition text-sm"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg transition text-sm"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
