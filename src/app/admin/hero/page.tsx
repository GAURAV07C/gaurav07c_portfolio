"use client";

import React, { useEffect, useState } from "react";

export default function HeroAdminPage() {
  const [settings, setSettings] = useState<{ heroWords: string; heroDesc: string } | null>(null);
  const [formData, setFormData] = useState({
    heroWords: "",
    heroDesc: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setFormData({
          heroWords: data.heroWords || "[]",
          heroDesc: data.heroDesc || "",
        });
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Hero section updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update hero section" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const parseJson = (json: string) => {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const updateWord = (index: number, field: string, value: string) => {
    const words = parseJson(formData.heroWords);
    words[index] = { ...words[index], [field]: value };
    setFormData({ ...formData, heroWords: JSON.stringify(words) });
  };

  const addWord = () => {
    const words = parseJson(formData.heroWords);
    words.push({ text: "New Word", className: "text-white text-3xl md:text-5xl font-serif" });
    setFormData({ ...formData, heroWords: JSON.stringify(words) });
  };

  const removeWord = (index: number) => {
    const words = parseJson(formData.heroWords);
    words.splice(index, 1);
    setFormData({ ...formData, heroWords: JSON.stringify(words) });
  };

  if (!settings) return <div className="text-white/50">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-serif mb-3 text-white">Hero Section</h1>
        <p className="text-white/60 text-lg">
          Manage the hero section content that appears at the top of your portfolio.
        </p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl border ${
          message.type === "success" 
            ? "bg-emerald-300/10 border-emerald-300/30 text-emerald-300" 
            : "bg-red-300/10 border-red-300/30 text-red-300"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{message.type === "success" ? "✓" : "✕"}</span>
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Typewriter Words</h2>
            <p className="text-white/60 text-sm">
              These words appear in the typewriter animation on the hero section. Each word is displayed sequentially.
            </p>
          </div>
          <div className="space-y-3">
            {parseJson(formData.heroWords).map((word: { text: string; className: string }, index: number) => (
              <div key={index} className="flex gap-3 items-start bg-gray-950 border border-white/10 rounded-xl p-4">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={word.text}
                    onChange={(e) => updateWord(index, "text", e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-300 transition"
                    placeholder="Word text"
                    required
                  />
                  <input
                    type="text"
                    value={word.className}
                    onChange={(e) => updateWord(index, "className", e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-300 transition font-mono text-sm"
                    placeholder='CSS classes, e.g. "text-white text-3xl md:text-5xl font-serif"'
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeWord(index)}
                  className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWord}
              className="w-full py-3 border-2 border-dashed border-white/20 hover:border-emerald-300/50 text-white/60 hover:text-emerald-300 rounded-xl transition font-medium"
            >
              + Add Word
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Hero Description</h2>
            <p className="text-white/60 text-sm">
              The subtitle text displayed below the typewriter animation.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">Description</label>
            <textarea
              value={formData.heroDesc}
              onChange={(e) => setFormData({ ...formData, heroDesc: e.target.value })}
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3.5 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                heroWords: settings?.heroWords || "[]",
                heroDesc: settings?.heroDesc || "",
              });
              setMessage(null);
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3.5 px-8 rounded-xl transition-all border border-white/10"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
