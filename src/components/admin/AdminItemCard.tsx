"use client";

import React from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface AdminItemCardProps {
  title: string;
  subtitle?: string | React.ReactNode;
  image?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

function isImageSrc(src?: string): boolean {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
}

export function AdminItemCard({ title, subtitle, image, onView, onEdit, onDelete, children }: AdminItemCardProps) {
  const showImage = isImageSrc(image);

  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 hover:border-emerald-300/30 transition-all group flex gap-4">
      {showImage && image ? (
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : image ? (
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950 flex items-center justify-center text-3xl">
          {image}
        </div>
      ) : null}
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
              className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              title="View"
            >
              <Eye className="size-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-white/60 hover:text-red-400 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
