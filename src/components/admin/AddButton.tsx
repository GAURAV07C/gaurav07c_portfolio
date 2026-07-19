"use client";

import React from "react";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export function AddButton({ onClick, label = "+ Add New" }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20"
    >
      {label}
    </button>
  );
}
