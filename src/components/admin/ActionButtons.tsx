"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editTitle?: string;
  deleteTitle?: string;
}

export function ActionButtons({ onEdit, onDelete, editTitle = "Edit", deleteTitle = "Delete" }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          title={editTitle}
        >
          <Pencil className="size-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-white/60 hover:text-red-400 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
          title={deleteTitle}
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
