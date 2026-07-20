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

interface Education {
  id: string;
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
}

export default function EducationAdminPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ school: "", href: "", degree: "", logoUrl: "", start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchEducation = () => {
    fetch("/api/education")
      .then(res => res.json())
      .then(data => setEducation(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ school: "", href: "", degree: "", logoUrl: "", start: "", end: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Education) => {
    setEditingId(item.id);
    setFormData({ school: item.school, href: item.href, degree: item.degree, logoUrl: item.logoUrl, start: item.start, end: item.end });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ school: "", href: "", degree: "", logoUrl: "", start: "", end: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/education/${editingId}` : "/api/education";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Education updated successfully!" : "Education added successfully!" });
        closeModal();
        fetchEducation();
      } else {
        toast.addToast({ type: "error", message: "Failed to save education" });
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
      const res = await fetch(`/api/education/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Education deleted successfully!" });
        fetchEducation();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete education" });
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
        title="Education"
        description="Manage your educational background and qualifications."
        action={<AddButton onClick={openAddModal} label="+ Add Education" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Education</h2>
        <p className="text-white/60 text-sm">
          {education.length} {education.length === 1 ? "entry" : "entries"} in your portfolio
        </p>
      </div>

      {education.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="No education entries yet"
          description="Add your first education entry to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu, index) => (
            <BlurFade key={edu.id} delay={index * 0.05}>
              <AdminItemCard
                title={edu.school}
                subtitle={`${edu.degree} • ${edu.start} - ${edu.end}`}
                onEdit={() => openEditModal(edu)}
                onDelete={() => setDeleteId(edu.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Education" : "Add New Education"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="School">
            <Input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Website URL">
            <Input
              type="text"
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Degree">
            <Input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Logo URL">
            <Input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Year">
              <Input
                type="text"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
              />
            </FormField>

            <FormField label="End Year">
              <Input
                type="text"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                required
              />
            </FormField>
          </div>

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
                editingId ? "Update Education" : "Add Education"
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
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
