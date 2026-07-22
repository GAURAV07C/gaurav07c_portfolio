"use client";
import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { useCachedFetch, useInvalidateCache } from "@/hooks/useCachedFetch";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Contribution {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  status: string;
  type: string;
  prUrl?: string;
  image?: string;
  techStack?: string;
  views?: number;
}

interface RepoDetail {
  org: { id: string; name: string; slug: string };
  repo: { id: string; name: string; slug: string; url: string; description: string };
  contributions: Contribution[];
}

export default function AdminOpenSourceRepoPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const repoSlug = params.repoSlug as string;
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const [editingSlug, setEditingSlug] = React.useState<string | null>(null);
  const [deleteSlug, setDeleteSlug] = React.useState<string | null>(null);
  const toast = useToast();
  const invalidateCache = useInvalidateCache();

  const [formData, setFormData] = React.useState({ title: "", slug: "", description: "", repoUrl: "", prUrl: "", type: "feature", techStack: "[]", date: "", status: "merged", image: "" });

  const { data: data, refetch: refetchData } = useCachedFetch<RepoDetail | null>({
    key: `admin_opensource_repo_${orgSlug}_${repoSlug}`,
    fetchFn: async () => {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}`, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!orgSlug && !!repoSlug,
  });

  const contributions = useMemo(() => data?.contributions || [], [data]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  };

  const openAddModal = () => {
    setEditingSlug(null);
    setFormData({ title: "", slug: "", description: "", repoUrl: data?.repo.url || "", prUrl: "", type: "feature", techStack: "[]", date: new Date().toISOString().split("T")[0], status: "merged", image: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Contribution) => {
    setEditingSlug(item.slug);
    setFormData({ title: item.title, slug: item.slug, description: item.description, repoUrl: data?.repo.url || "", prUrl: item.prUrl || "", type: item.type, techStack: item.techStack || "[]", date: item.date, status: item.status, image: item.image || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlug(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug ? `/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${editingSlug}` : `/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions`;
      const slug = formData.slug || generateSlug(formData.title);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });
      if (res.ok) {
        toast.addToast({ type: "success", message: editingSlug ? "Contribution updated!" : "Contribution added!" });
        closeModal();
        invalidateCache();
        refetchData();
      } else {
        toast.addToast({ type: "error", message: "Failed to save" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    }
  };

  const handleDelete = async () => {
    if (!deleteSlug) return;
    try {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${deleteSlug}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Contribution deleted!" });
        invalidateCache();
        refetchData();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteSlug(null);
    }
  };

  if (!data || !data.org || !data.repo) {
    return (
      <div className="max-w-5xl">
        <AdminPageHeader title="Repository" description="" />
        <EmptyState icon="📦" title="Not found" description="This repository does not exist." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <AdminPageHeader title={`${data.org.name}/${data.repo.name}`} description={data.repo.description || ""} action={<AddButton onClick={openAddModal} label="+ Add Contribution" />} />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Contributions</h2>
        <p className="text-white/60 text-sm">
          {contributions.length} {contributions.length === 1 ? "contribution" : "contributions"} in this repository
        </p>
      </div>

      {contributions.length === 0 ? (
        <EmptyState icon="💻" title="No contributions yet" description="Add your first contribution to get started." />
      ) : (
        <div className="flex flex-col gap-4">
          {contributions.map((item, index) => (
            <BlurFade key={item.id} delay={index * 0.05}>
              <div className="bg-[#0a111f] border border-white/10 rounded-2xl p-5 hover:border-emerald-300/30 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "merged" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300" :
                        item.status === "pending" ? "border-amber-300/30 bg-amber-300/10 text-amber-300" :
                        "border-red-300/30 bg-red-300/10 text-red-300"
                      }`}>
                        {item.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/60">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-white/40 font-mono">{item.date}</span>
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {item.views ?? 0}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {JSON.parse(item.techStack || "[]").slice(0, 4).map((tech: string, i: number) => (
                          <span key={i} className="text-[10px] text-white/30 font-mono border border-white/5 px-1.5 py-0.5 rounded">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => router.push(`/admin/opensource/${orgSlug}/${repoSlug}/${item.slug}`)}
                      className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      title="View"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteSlug(item.slug)}
                      className="text-white/60 hover:text-red-400 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editingSlug ? "Edit Contribution" : "Add Contribution"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editingSlug ? formData.slug : generateSlug(e.target.value) })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Slug">
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated from title"
            />
          </FormField>

          <FormField label="PR URL">
            <Input
              type="text"
              value={formData.prUrl}
              onChange={(e) => setFormData({ ...formData, prUrl: e.target.value })}
              placeholder="https://github.com/org/repo/pull/123"
            />
          </FormField>

          <FormField label="Repository URL">
            <Input
              type="text"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
              >
                <option value="feature">Feature</option>
                <option value="bug-fix">Bug Fix</option>
                <option value="documentation">Documentation</option>
                <option value="enhancement">Enhancement</option>
              </select>
            </FormField>

            <FormField label="Status">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition"
              >
                <option value="merged">Merged</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date">
              <Input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="2026-01-15"
              />
            </FormField>

            <FormField label="Image Path">
              <Input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/contribution.png"
              />
            </FormField>
          </div>

          <FormField label="Tech Stack">
            <TextArea
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder='["react", "typescript", "nodejs"]'
              rows={2}
            />
          </FormField>

          <MarkdownEditor
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Describe the contribution..."
            minHeight="300px"
          />

          <div className="flex gap-3 pt-3 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20"
            >
              {editingSlug ? "Update Contribution" : "Add Contribution"}
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

      <ConfirmDialog
        isOpen={!!deleteSlug}
        onClose={() => setDeleteSlug(null)}
        onConfirm={handleDelete}
        title="Delete Contribution"
        message="Are you sure you want to delete this contribution?"
        confirmText="Delete"
      />
    </div>
  );
}
