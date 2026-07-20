"use client";

import React, { useState, useEffect } from "react";

interface CommentUserModalProps {
  isOpen: boolean;
  onSave: (name: string, email: string) => void;
}

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("commentUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredUser(name: string, email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("commentUser", JSON.stringify({ name, email }));
}

export function CommentUserModal({ isOpen, onSave }: CommentUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredUser();
      if (stored) {
        setName(stored.name);
        setEmail(stored.email);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Please enter both name and email");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setStoredUser(trimmedName, trimmedEmail);
    onSave(trimmedName, trimmedEmail);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-serif font-semibold text-white mb-2">Welcome!</h2>
        <p className="text-white/60 text-sm mb-6">
          Enter your name and email to join the discussion. This info will be saved in your browser for future comments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-300/20"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-300/20"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-semibold text-sm py-2.5 rounded-lg transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
