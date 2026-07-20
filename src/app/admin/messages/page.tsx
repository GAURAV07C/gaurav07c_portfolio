"use client";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Modal } from "@/components/Modal";
import { Eye, Trash2, Mail, Search } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-emerald-500",
    "bg-sky-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const toast = useToast();

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/messages/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Message deleted successfully!" });
        setMessages((prev) => prev.filter((m) => m.id !== deleteId));
      } else {
        toast.addToast({ type: "error", message: "Failed to delete message" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteId(null);
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.addToast({ type: "success", message: "Email copied to clipboard!" });
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Messages"
        description="View and manage contact form submissions from your portfolio."
      />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">All Messages</h2>
          <p className="text-white/60 text-sm">
            {messages.length} {messages.length === 1 ? "message" : "messages"} received
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30 w-full sm:w-72 transition"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="size-12 text-emerald-300" />}
          title="No messages yet"
          description="Messages from your contact form will appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-12 text-emerald-300" />}
          title="No matches found"
          description="Try adjusting your search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((message, index) => {
            const avatarColor = getAvatarColor(message.name);
            const initials = getInitials(message.name);
            return (
              <BlurFade key={message.id} delay={index * 0.05}>
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-300/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`size-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {message.name}
                          </div>
                          <button
                            onClick={() => copyEmail(message.email)}
                            className="text-xs text-white/40 font-mono mt-1 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                            title="Click to copy email"
                          >
                            <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {message.email}
                          </button>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => setViewMessage(message)}
                            className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                            title="View message"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(message.id)}
                            className="text-white/60 hover:text-red-400 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                            title="Delete message"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {message.message}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-white/30">
                          {new Date(message.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      )}

      {/* View Message Modal */}
      <Modal isOpen={!!viewMessage} onClose={() => setViewMessage(null)} title="Message Details">
        {viewMessage && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-full ${getAvatarColor(viewMessage.name)} flex items-center justify-center text-white font-semibold`}>
                {getInitials(viewMessage.name)}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{viewMessage.name}</div>
                <button
                  onClick={() => copyEmail(viewMessage.email)}
                  className="text-sm text-white/50 hover:text-emerald-300 transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  {viewMessage.email}
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {viewMessage.message}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/30">
                {new Date(viewMessage.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <a
                href={`mailto:${viewMessage.email}`}
                className="text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg transition"
              >
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
