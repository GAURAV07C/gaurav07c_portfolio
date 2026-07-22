"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";
import { useCachedFetch, useInvalidateCache } from "@/hooks/useCachedFetch";
import { AdminItemCard } from "@/components/admin/AdminItemCard";

interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  repos: { id: string; name: string }[];
}

export default function AdminOpenSourcePage() {
  const [showModal, setShowModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();
  const invalidateCache = useInvalidateCache();

  const [formData, setFormData] = React.useState({ name: "", slug: "", description: "", image: "" });

  const { data: items = [], refetch: refetchItems } = useCachedFetch<Organisation[]>({
    key: "admin_opensource_organisations",
    fetchFn: () => fetch("/api/organisations", { cache: "no-store" }).then(res => res.json()),
  });

  const itemsList = Array.isArray(items) ? items : [];

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Organisation) => {
    setEditingId(item.id);
    setFormData({ name: item.name, slug: item.slug, description: item.description || "", image: item.image || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/organisations/${editingId}` : "/api/organisations";
      const slug = formData.slug || generateSlug(formData.name);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });
      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Organisation updated!" : "Organisation added!" });
        closeModal();
        invalidateCache();
        refetchItems();
      } else {
        toast.addToast({ type: "error", message: "Failed to save" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organisations/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Organisation deleted!" });
        invalidateCache();
        refetchItems();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Open Source"
        description="Manage your open source contributions and repositories."
        action={<AddButton onClick={openAddModal} label="+ Add Organisation" loading={loading} disabled={loading || !!deleteId} />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Organisations</h2>
        <p className="text-white/60 text-sm">
          {itemsList.length} {itemsList.length === 1 ? "organisation" : "organisations"}
        </p>
      </div>

      {itemsList.length === 0 ? (
        <EmptyState icon="🏢" title="No organisations" description="Add your first organisation to get started." />
      ) : (
        <div className="flex flex-col gap-4">
          {itemsList.map((item, index) => (
            <BlurFade key={item.id} delay={index * 0.05}>
              <AdminItemCard
                title={item.name}
                subtitle={
                  <span className="flex items-center gap-2 flex-wrap">
                    <span>{item.repos.length} {item.repos.length === 1 ? "repository" : "repositories"}</span>
                    <span className="text-[10px] text-white/30 font-mono border border-white/5 px-2 py-0.5 rounded-full">
                      {item.slug}
                    </span>
                  </span>
                }
                image={item.image || undefined}
                onView={() => router.push(`/admin/opensource/${item.slug}`)}
                onEdit={() => openEditModal(item)}
                onDelete={() => setDeleteId(item.id)}
              >
                {item.description || "No description"}
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Organisation" : "Add Organisation"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Name">
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: editingId ? formData.slug : generateSlug(e.target.value) })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Slug">
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated from name"
            />
          </FormField>

          <FormField label="Description">
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </FormField>

          <FormField label="Image Path">
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/org-logo.png"
            />
          </FormField>

          <div className="flex gap-3 pt-3 border-t border-white/10">
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
                editingId ? "Update Organisation" : "Add Organisation"
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Organisation"
        message="This will also delete all repositories and contributions under this organisation."
        confirmText="Delete"
      />
    </div>
  );
}
