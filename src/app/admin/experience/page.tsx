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
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";

interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ company: "", href: "", badges: "[]", location: "", title: "", logoUrl: "", start: "", end: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchExperiences = () => {
    fetch("/api/experience")
      .then(res => res.json())
      .then(data => setExperiences(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ company: "", href: "", badges: "[]", location: "", title: "", logoUrl: "", start: "", end: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Experience) => {
    setEditingId(item.id);
    setFormData({
      company: item.company || "",
      href: "",
      badges: "[]",
      location: item.location || "",
      title: item.title || "",
      logoUrl: "",
      start: item.start || "",
      end: item.end || "",
      description: ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ company: "", href: "", badges: "[]", location: "", title: "", logoUrl: "", start: "", end: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Experience updated successfully!" : "Experience added successfully!" });
        closeModal();
        fetchExperiences();
      } else {
        toast.addToast({ type: "error", message: "Failed to save experience" });
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
      const res = await fetch(`/api/experience/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Experience deleted successfully!" });
        fetchExperiences();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete experience" });
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
        title="Experience"
        description="Manage your work experience and professional history."
        action={<AddButton onClick={openAddModal} label="+ Add Experience" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Experience</h2>
        <p className="text-white/60 text-sm">
          {experiences.length} {experiences.length === 1 ? "entry" : "entries"} in your portfolio
        </p>
      </div>

      {experiences.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No experience entries yet"
          description="Add your first work experience to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp, index) => (
            <BlurFade key={exp.id} delay={index * 0.05}>
              <AdminItemCard
                title={exp.company}
                subtitle={`${exp.title} • ${exp.location}`}
                onEdit={() => openEditModal(exp)}
                onDelete={() => setDeleteId(exp.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Experience" : "Add New Experience"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company">
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                autoFocus
              />
            </FormField>

            <FormField label="Location">
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Job Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input
                type="text"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
              />
            </FormField>

            <FormField label="End Date">
              <Input
                type="text"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Description">
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
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
                editingId ? "Update Experience" : "Add Experience"
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
        title="Delete Experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
