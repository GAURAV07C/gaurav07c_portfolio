"use client";

import React from "react";

interface MultiPointEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  emptyText?: string;
}

export function MultiPointEditor({ label, items, onChange, placeholder = "Add a new point...", emptyText = "No points added yet." }: MultiPointEditorProps) {
  const [newItem, setNewItem] = React.useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-3">{label}</label>

      <div className="space-y-2 mb-3">
        {items.length === 0 && (
          <div className="text-xs text-white/40 italic">{emptyText}</div>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-gray-950 border border-white/10 rounded-xl p-3 group"
          >
            <span className="text-emerald-300 mt-0.5 select-none">•</span>
            <span className="flex-1 text-sm text-white/80 break-words">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300 transition"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!newItem.trim()}
          className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  );
}
