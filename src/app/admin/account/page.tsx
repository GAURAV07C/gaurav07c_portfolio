"use client";

import React, { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useToast } from "@/components/ToastProvider";

export default function AdminAccountPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/account")
      .then(res => {
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data?.email) setEmail(data.email);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (newPassword && newPassword !== confirmPassword) {
        toast.addToast({ type: "error", message: "New passwords do not match" });
        return;
      }

      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.addToast({ type: "success", message: data.message || "Account updated successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.addToast({ type: "error", message: data.error || "Failed to update account" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Account Settings"
        description="Manage your admin account credentials."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Email Address</h3>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
            <p className="text-xs text-white/40 mb-4">Leave password fields empty if you don&apos;t want to change your password.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
