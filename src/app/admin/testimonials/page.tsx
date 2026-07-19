"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminItemCard } from "@/components/admin/AdminItemCard";
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  text: string;
  avatar: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", position: "", text: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchTestimonials = () => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", position: "", text: "", avatar: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingId(item.id);
    setFormData({ name: item.name, position: item.position, text: item.text, avatar: item.avatar });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", position: "", text: "", avatar: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Testimonial updated successfully!" : "Testimonial added successfully!" });
        closeModal();
        fetchTestimonials();
      } else {
        toast.addToast({ type: "error", message: "Failed to save testimonial" });
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
      const res = await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Testimonial deleted successfully!" });
        fetchTestimonials();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete testimonial" });
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
        title="Testimonials"
        description="Manage client testimonials and reviews."
        action={<AddButton onClick={openAddModal} label="+ Add Testimonial" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Testimonials</h2>
        <p className="text-white/60 text-sm">
          {testimonials.length} {testimonials.length === 1 ? "testimonial" : "testimonials"} in your portfolio
        </p>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No testimonials yet"
          description="Add your first testimonial to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial, index) => (
            <BlurFade key={testimonial.id} delay={index * 0.05}>
              <AdminItemCard
                title={testimonial.name}
                subtitle={testimonial.position}
                onEdit={() => openEditModal(testimonial)}
                onDelete={() => setDeleteId(testimonial.id)}
              >
                <p className="text-white/60 text-sm mt-2 line-clamp-2">{testimonial.text}</p>
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Testimonial" : "Add New Testimonial"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Name">
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Position">
            <Input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Testimonial Text">
            <TextArea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={4}
              required
            />
          </FormField>

          <FormField label="Avatar URL">
            <Input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
                editingId ? "Update Testimonial" : "Add Testimonial"
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
