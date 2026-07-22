"use client";
import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
import Image from "next/image";

interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  repos: { id: string; name: string; slug: string; url: string; description: string }[];
}

export default function AdminOpenSourceOrgPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const invalidateCache = useInvalidateCache();

  const [formData, setFormData] = React.useState({ organisationId: "", name: "", slug: "", url: "", description: "", image: "" });

  const { data: org, refetch: refetchOrg } = useCachedFetch<Organisation | null>({
    key: `admin_opensource_org_${orgSlug}`,
    fetchFn: async () => {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}`, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!orgSlug,
  });

  const repos = useMemo(() => org?.repos || [], [org]);

  useEffect(() => {
    if (org) {
      setFormData((prev) => ({ ...prev, organisationId: org.id }));
    }
  }, [org]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ organisationId: org?.id || "", name: "", slug: "", url: "", description: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (repo: { id: string; name: string; slug: string; url: string; description: string }) => {
    setEditingId(repo.id);
    setFormData({ organisationId: org?.id || "", name: repo.name, slug: repo.slug, url: repo.url, description: repo.description || "", image: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org?.id) return;
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/organisations/${org.id}/repositories/${editingId}` : `/api/organisations/${org.id}/repositories`;
      const slug = formData.slug || generateSlug(formData.name);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });
      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Repository updated!" : "Repository added!" });
        closeModal();
        invalidateCache();
        refetchOrg();
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
    if (!deleteId || !org?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organisations/${org.id}/repositories/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Repository deleted!" });
        invalidateCache();
        refetchOrg();
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

  if (!org) {
    return (
      <div className="max-w-5xl">
        <AdminPageHeader title="Organisation" description="" />
        <EmptyState icon="🏢" title="Not found" description="This organisation does not exist." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950">
          {org.image ? (
            <Image
              src={org.image}
              alt={org.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white/30">
                {org.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <AdminPageHeader title={org.name} description={org.description || ""} action={<AddButton onClick={openAddModal} label="+ Add Repository" loading={loading} disabled={loading || !!deleteId} />} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Repositories</h2>
        <p className="text-white/60 text-sm">
          {repos.length} {repos.length === 1 ? "repository" : "repositories"} in {org.name}
        </p>
      </div>

      {repos.length === 0 ? (
        <EmptyState icon="📦" title="No repositories" description="Add your first repository to get started." />
      ) : (
        <div className="flex flex-col gap-4">
          {repos.map((repo, index) => (
            <BlurFade key={repo.id} delay={index * 0.05}>
              <AdminItemCard
                title={repo.name}
                subtitle={
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-white/30 font-mono border border-white/5 px-2 py-0.5 rounded-full">
                      {repo.slug}
                    </span>
                  </span>
                }
                onView={() => router.push(`/admin/opensource/${org.slug}/${repo.slug}`)}
                onEdit={() => openEditModal(repo)}
                onDelete={() => setDeleteId(repo.id)}
              >
                <div className="space-y-1">
                  {repo.url && (
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-300/70 hover:text-emerald-300 font-mono block truncate transition-colors">
                      {repo.url}
                    </a>
                  )}
                  <p>{repo.description || "No description"}</p>
                </div>
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Repository" : "Add Repository"}>
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

          <FormField label="URL">
            <Input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://github.com/org/repo"
            />
          </FormField>

          <FormField label="Description">
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
                editingId ? "Update Repository" : "Add Repository"
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
        title="Delete Repository"
        message="This will also delete all contributions under this repository."
        confirmText="Delete"
      />
    </div>
  );
}
