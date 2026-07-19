"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<{ aboutMe: string; socialLinks: string; introductionWords: string } | null>(null);
  const [formData, setFormData] = useState({
    aboutMe: "",
    socialLinks: "",
    introductionWords: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setFormData({
          aboutMe: data.aboutMe || "",
          socialLinks: data.socialLinks || "[]",
          introductionWords: data.introductionWords || "[]",
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
        setMessage({ type: "success", text: "Settings updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update settings" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <div className="text-white/50">Loading settings...</div>;

  const tabs = [
    { id: "about", label: "About Me", icon: "📝" },
    { id: "intro", label: "Introduction", icon: "👋" },
    { id: "social", label: "Social Links", icon: "🔗" },
  ];

  const parseJson = (json: string): unknown[] => {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const links = parseJson(formData.socialLinks) as { name: string; href: string }[];
    links[index] = { ...links[index], [field]: value };
    setFormData({ ...formData, socialLinks: JSON.stringify(links) });
  };

  const addSocialLink = () => {
    const links = parseJson(formData.socialLinks);
    links.push({ name: "New Link", href: "https://" });
    setFormData({ ...formData, socialLinks: JSON.stringify(links) });
  };

  const removeSocialLink = (index: number) => {
    const links = parseJson(formData.socialLinks);
    links.splice(index, 1);
    setFormData({ ...formData, socialLinks: JSON.stringify(links) });
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-4xl font-serif mb-3 text-white">Site Settings</h1>
        <p className="text-white/60 text-lg">
          Manage your portfolio content and appearance. All changes are reflected instantly on the homepage.
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

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gray-900 text-emerald-300 border-b-2 border-emerald-300"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === "about" && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">About Me</h2>
              <p className="text-white/60 text-sm">
                This text appears in the About Me section of your portfolio.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">About Me Text</label>
              <textarea
                value={formData.aboutMe}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
                rows={8}
                required
              />
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Social Links</h2>
              <p className="text-white/60 text-sm">
                These links appear in the footer and other sections of your portfolio.
              </p>
            </div>
            <div className="space-y-3">
              {(parseJson(formData.socialLinks) as { name: string; href: string }[]).map((link, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-950 border border-white/10 rounded-xl p-4">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-300 transition"
                      placeholder="Platform name, e.g. Twitter"
                      required
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-300 transition font-mono text-sm"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2.5 rounded-lg transition text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className="w-full py-3 border-2 border-dashed border-white/20 hover:border-emerald-300/50 text-white/60 hover:text-emerald-300 rounded-xl transition font-medium"
              >
                + Add Link
              </button>
            </div>
          </div>
        )}

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
                aboutMe: settings?.aboutMe || "",
                socialLinks: settings?.socialLinks || "[]",
                introductionWords: settings?.introductionWords || "[]",
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
