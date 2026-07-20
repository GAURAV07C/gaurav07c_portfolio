"use client";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ActionButtons } from "@/components/admin/ActionButtons";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchMessages = () => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
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
        setMessages(prev => prev.filter(m => m.id !== deleteId));
      } else {
        toast.addToast({ type: "error", message: "Failed to delete message" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Messages"
        description="View and manage contact form submissions from your portfolio."
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Messages</h2>
        <p className="text-white/60 text-sm">
          {messages.length} {messages.length === 1 ? "message" : "messages"} received
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon="📬"
          title="No messages yet"
          description="Messages from your contact form will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((message, index) => (
            <BlurFade key={message.id} delay={index * 0.05}>
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-300/30 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {message.name}
                    </div>
                    <div className="text-xs text-white/40 font-mono mt-1">{message.email}</div>
                    <p className="text-white/60 text-sm mt-3">{message.message}</p>
                    <div className="text-xs text-white/30 mt-3">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ActionButtons
                    onDelete={() => setDeleteId(message.id)}
                    deleteTitle="Delete message"
                  />
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      )}

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
