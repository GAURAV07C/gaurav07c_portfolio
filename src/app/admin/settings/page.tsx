"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [settings, setSettings] = useState<{ aboutMe: string; socialLinks: string; introductionWords: string; introductionText: string; profileImage?: string; resume?: string } | null>(null);
  const [formData, setFormData] = useState({
    aboutMe: "",
    socialLinks: "",
    introductionWords: "",
    introductionText: "",
    profileImage: "",
    resume: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setFormData({
          aboutMe: data.aboutMe || "",
          socialLinks: data.socialLinks || "[]",
          introductionWords: data.introductionWords || "[]",
          introductionText: data.introductionText || "",
          profileImage: data.profileImage || "",
          resume: data.resume || "",
        });
        setImagePreview(data.profileImage || "");
        setImageError(false);
      })
      .catch(err => {
        console.error("Settings fetch error:", err);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, profileImage: base64 }));
      setImagePreview(base64);
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: "" }));
    setImagePreview("");
  };

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
    { id: "profile", label: "Profile", icon: "👤" },
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

            <div className="mt-8 pt-6 border-t border-white/10">
              <label className="block text-sm font-medium text-white/70 mb-2">Resume URL</label>
              <input
                type="text"
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
                placeholder="https://resume-lemon-rho.vercel.app/"
              />
              <p className="text-xs text-white/40 mt-2">
                This link will appear as a Resume button in the header and footer.
              </p>
            </div>
          </div>
        )}

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all whitespace-nowrap ${
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
        {activeTab === "profile" && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Profile Picture</h2>
              <p className="text-white/60 text-sm">
                Upload a profile picture. This will appear in the About Me section and other areas of your portfolio.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-dashed border-white/20 bg-gray-950">
                {formData.profileImage && !imageError ? (
                  <Image
                    src={formData.profileImage}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">Upload Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-300 file:text-gray-950 hover:file:bg-emerald-400 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-white/40 mt-2">Supported formats: JPG, PNG, WEBP. Max size: 2MB</p>
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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

        {activeTab === "intro" && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Introduction</h2>
              <p className="text-white/60 text-sm">
                Configure your homepage introduction section. Add typewriter words and a short bio text.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Typewriter Words
                  <span className="text-white/40 text-xs ml-2">(JSON format)</span>
                </label>
                <textarea
                  value={formData.introductionWords}
                  onChange={(e) => setFormData({ ...formData, introductionWords: e.target.value })}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition font-mono text-sm"
                  rows={4}
                  placeholder='[{"text":"Hi","className":"text-white text-6xl"},{"text":"I am","className":"text-white text-6xl"},{"text":"Gaurav","className":"text-white text-6xl"}]'
                />
                <p className="text-xs text-white/40 mt-2">
                  This will appear as animated typewriter text on the homepage. Use JSON format with text and className properties.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Introduction Bio</label>
                <textarea
                  value={formData.introductionText}
                  onChange={(e) => setFormData({ ...formData, introductionText: e.target.value })}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
                  rows={4}
                  placeholder="e.g. Tech Enthusiast turned Software Engineer. I love building things and helping people."
                />
                <p className="text-xs text-white/40 mt-2">
                  This text appears below the typewriter text on the homepage.
                </p>
              </div>
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
              introductionText: settings?.introductionText || "",
              profileImage: settings?.profileImage || "",
              resume: settings?.resume || "",
            });
              setImagePreview(settings?.profileImage || "");
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
