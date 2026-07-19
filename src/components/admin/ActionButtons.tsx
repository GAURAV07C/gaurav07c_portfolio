"use client";

import React from "react";

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
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition text-sm"
          title={editTitle}
        >
          ✏️
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg transition text-sm"
          title={deleteTitle}
        >
          🗑️
        </button>
      )}
    </div>
  );
}
