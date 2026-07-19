"use client";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<{ id: string; name: string; email: string; message: string; createdAt: string }[]>([]);

  useEffect(() => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((message) => (
          <BlurFade key={message.id}>
            <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-semibold text-lg mb-2">{message.name}</h3>
              <p className="text-white/60 text-sm mb-2">{message.email}</p>
              <p className="text-white/80 text-sm mb-4">{message.message}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm py-2 px-4 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
