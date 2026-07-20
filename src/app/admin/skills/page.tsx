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

interface Skill {
  id: string;
  title: string;
  iconsType: string;
}

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", iconsType: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const toast = useToast();

  const fetchSkills = () => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => setSkills(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", iconsType: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Skill) => {
    setEditingId(item.id);
    setFormData({ title: item.title, iconsType: item.iconsType });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", iconsType: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Skill updated successfully!" : "Skill added successfully!" });
        closeModal();
        fetchSkills();
      } else {
        toast.addToast({ type: "error", message: "Failed to save skill" });
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
      const res = await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Skill deleted successfully!" });
        fetchSkills();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete skill" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteId(null);
    }
  };

  const syncSkillsFromProjects = async () => {
    setSyncing(true);

    try {
      const res = await fetch("/api/projects/sync-skills", { method: "POST" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Skills synced from projects successfully!" });
        fetchSkills();
      } else {
        toast.addToast({ type: "error", message: "Failed to sync skills" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Skills"
        description="Manage your technical skills. You can also sync skills from your projects."
        action={
          <div className="flex gap-3">
            <button
              onClick={syncSkillsFromProjects}
              disabled={syncing}
              className="bg-blue-300 hover:bg-blue-400 text-gray-950 font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Syncing...
                </span>
              ) : (
                "🔄 Sync Skills"
              )}
            </button>
            <AddButton onClick={openAddModal} label="+ Add Skill" />
          </div>
        }
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Skills</h2>
        <p className="text-white/60 text-sm">
          {skills.length} {skills.length === 1 ? "skill" : "skills"} in your portfolio
        </p>
      </div>

      {skills.length === 0 ? (
        <EmptyState
          icon="💻"
          title="No skills yet"
          description="Add your first skill or sync from projects."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <BlurFade key={skill.id} delay={index * 0.05}>
              <AdminItemCard
                title={skill.title}
                subtitle={`Icon: ${skill.iconsType}`}
                onEdit={() => openEditModal(skill)}
                onDelete={() => setDeleteId(skill.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Skill" : "Add New Skill"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Skill Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Next.js"
              required
              autoFocus
            />
          </FormField>

          <FormField label="Icon Name">
            <Input
              type="text"
              value={formData.iconsType}
              onChange={(e) => setFormData({ ...formData, iconsType: e.target.value })}
              placeholder="e.g. NextJs"
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
                editingId ? "Update Skill" : "Add Skill"
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
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
