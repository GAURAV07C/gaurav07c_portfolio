"use client";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminItemCard } from "@/components/admin/AdminItemCard";
import { FormField, Input } from "@/components/admin/FormComponents";

interface Hobby {
  id: string;
  title: string;
  emoji: string;
}

export default function HobbiesAdminPage() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", emoji: "", left: "0%", top: "0%" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchHobbies = () => {
    fetch("/api/hobbies")
      .then(res => res.json())
      .then(data => setHobbies(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", emoji: "", left: "0%", top: "0%" });
    setShowModal(true);
  };

  const openEditModal = (item: Hobby) => {
    setEditingId(item.id);
    setFormData({ title: item.title, emoji: item.emoji, left: "0%", top: "0%" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", emoji: "", left: "0%", top: "0%" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/hobbies/${editingId}` : "/api/hobbies";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Hobby updated successfully!" : "Hobby added successfully!" });
        closeModal();
        fetchHobbies();
      } else {
        toast.addToast({ type: "error", message: "Failed to save hobby" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/hobbies/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Hobby deleted successfully!" });
        fetchHobbies();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete hobby" });
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
        title="Hobbies"
        description="Manage your hobbies and interests."
        action={<AddButton onClick={openAddModal} label="+ Add Hobby" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Hobbies</h2>
        <p className="text-white/60 text-sm">
          {hobbies.length} {hobbies.length === 1 ? "hobby" : "hobbies"} in your portfolio
        </p>
      </div>

      {hobbies.length === 0 ? (
        <EmptyState
          icon="🎨"
          title="No hobbies yet"
          description="Add your first hobby to get started."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hobbies.map((hobby, index) => (
            <BlurFade key={hobby.id} delay={index * 0.05}>
              <AdminItemCard
                title={hobby.title}
                subtitle={hobby.emoji}
                onEdit={() => openEditModal(hobby)}
                onDelete={() => setDeleteId(hobby.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Hobby" : "Add New Hobby"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Emoji">
            <Input
              type="text"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              required
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {editingId ? "Updating..." : "Adding..."}
                </span>
              ) : (
                editingId ? "Update Hobby" : "Add Hobby"
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Hobby"
        message="Are you sure you want to delete this hobby? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
