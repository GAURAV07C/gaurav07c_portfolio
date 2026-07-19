"use client";

import React from "react";

interface AdminItemCardProps {
  title: string;
  subtitle?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export function AdminItemCard({ title, subtitle, onEdit, onDelete, children }: AdminItemCardProps) {
  return (
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-300/30 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-white/40 font-mono mt-1">{subtitle}</div>
          )}
          {children}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
}
