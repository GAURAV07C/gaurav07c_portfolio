"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import grainImage from "@/assets/images/grain.jpg";
import Link from "next/link";
import BlurFade from "@/components/BlurFade";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { CommentUserModal } from "@/components/CommentUserModal";

interface StoredUser {
  name: string;
  email: string;
}

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("commentUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export const ContactSection = () => {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored?.name && stored?.email) {
      setCurrentUser(stored);
    } else {
      setShowUserModal(true);
    }
  }, []);

  const handleUserSave = (name: string, email: string) => {
    setCurrentUser({ name, email });
    setShowUserModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setStatus({ type: "error", text: "Please enter a message" });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          message: trimmedMessage,
        }),
      });

      if (res.ok) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        setMessage("");
      } else {
        setStatus({ type: "error", text: "Failed to send message" });
      }
    } catch {
      setStatus({ type: "error", text: "An error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact" className="py-16 pt-12 lg:py-24 lg:pt-20">
      <BlurFade>
        <div className="container">
           <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-gray-100 py-10 px-6 md:py-12 md:px-10 rounded-3xl relative overflow-hidden z-0 border border-white/10 shadow-2xl">
             <div
               className="absolute inset-0 opacity-[0.07] -z-10"
               style={{
                 backgroundImage: `url(${grainImage.src})`,
               }}
             ></div>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="font-serif text-2xl md:text-3xl text-white">
                  Let&apos;s create something together
                </h2>
                <p className="text-sm md:text-base mt-2 text-white/60">
                  Ready to bring your next project to life? Let&apos;s connect
                  and discuss how I can help you achieve your goals.
                </p>
              </div>

              <div className="w-full lg:w-auto">
                {currentUser && (
                  <form onSubmit={handleSubmit} className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl w-full lg:w-[520px]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-950/50 rounded-lg px-3 py-2">
                        <p className="text-xs text-white/50">
                          Commenting as <span className="text-emerald-300 font-medium">{currentUser.name}</span> ({currentUser.email})
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowUserModal(true)}
                          className="text-xs text-white/40 hover:text-white transition-colors"
                        >
                          Change
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5 font-medium">Message</label>
                        <MarkdownEditor
                          value={message}
                          onChange={setMessage}
                          placeholder="Tell me about your project..."
                          minHeight="180px"
                        />
                      </div>
                      {status && (
                        <p className={`text-xs ${status.type === "success" ? "text-emerald-300" : "text-red-300"}`}>
                          {status.text}
                        </p>
                      )}
                      <motion.button
                        whileTap={{ scale: 1.02 }}
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-white text-gray-900 font-semibold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-all disabled:opacity-70"
                      >
                        {submitting ? "Sending..." : "Send Message"}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <CommentUserModal
        isOpen={showUserModal}
        onSave={handleUserSave}
      />
    </div>
  );
};
