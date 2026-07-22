"use client";

import React from "react";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function AddButton({ onClick, label = "+ Add New", loading, disabled }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading && <span className="animate-spin">⏳</span>}
      {label}
    </button>
  );
}
