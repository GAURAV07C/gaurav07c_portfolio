"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { useCachedFetch, useInvalidateCache } from "@/hooks/useCachedFetch";
import { ArrowLeft } from "lucide-react";

interface Contribution {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  status: string;
  type: string;
  prUrl?: string;
  repoUrl?: string;
  techStack?: string;
  image?: string;
}

interface RepoInfo {
  org: { id: string; name: string; slug: string };
  repo: { id: string; name: string; slug: string };
}

export default function AdminOpenSourcePRPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const repoSlug = params.repoSlug as string;
  const prSlug = params.prSlug as string;
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleteSlug, setDeleteSlug] = React.useState<string | null>(null);
  const toast = useToast();
  const invalidateCache = useInvalidateCache();

  const [formData, setFormData] = useState({ title: "", slug: "", description: "", repoUrl: "", prUrl: "", type: "feature", techStack: "[]", date: "", status: "merged", image: "" });

  const { data: contribution, refetch: refetchContribution } = useCachedFetch<Contribution | null>({
    key: `admin_opensource_pr_${orgSlug}_${repoSlug}_${prSlug}`,
    fetchFn: async () => {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${encodeURIComponent(prSlug)}`, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!orgSlug && !!repoSlug && !!prSlug,
  });

  const { data: repoInfo } = useCachedFetch<RepoInfo | null>({
    key: `admin_opensource_pr_info_${orgSlug}_${repoSlug}`,
    fetchFn: async () => {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}`, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!orgSlug && !!repoSlug,
  });

  useEffect(() => {
    if (contribution) {
      setFormData({
        title: contribution.title,
        slug: contribution.slug,
        description: contribution.description,
        repoUrl: contribution.repoUrl || "",
        prUrl: contribution.prUrl || "",
        type: contribution.type,
        techStack: contribution.techStack || "[]",
        date: contribution.date,
        status: contribution.status,
        image: contribution.image || "",
      });
    }
  }, [contribution]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribution) return;
    setLoading(true);
    try {
      const slug = formData.slug || generateSlug(formData.title);
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${encodeURIComponent(prSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Contribution updated!" });
        closeModal();
        invalidateCache();
        refetchContribution();
      } else {
        toast.addToast({ type: "error", message: "Failed to update" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!prSlug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/organisations/${encodeURIComponent(orgSlug)}/repositories/${encodeURIComponent(repoSlug)}/contributions/${encodeURIComponent(prSlug)}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Contribution deleted!" });
        invalidateCache();
        router.push(`/admin/opensource/${orgSlug}/${repoSlug}`);
      } else {
        toast.addToast({ type: "error", message: "Failed to delete" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
      setDeleteSlug(null);
    }
  };

  if (!contribution || !repoInfo) {
    return (
      <div className="max-w-5xl">
        <AdminPageHeader title="Contribution" description="" />
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/admin/opensource/${orgSlug}/${repoSlug}`)}
          className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
        >
          <ArrowLeft className="size-4 rotate-180" />
          Back to {repoInfo.repo.name}
        </button>
      </div>

      <AdminPageHeader
        title={contribution.title}
        description={`${repoInfo.org.name} / ${repoInfo.repo.name}`}
        action={
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-xl transition-all border border-white/10"
            >
              Edit Contribution
            </button>
            <AddButton onClick={() => router.push(`/admin/opensource/${orgSlug}/${repoSlug}`)} label="+ Add Contribution" />
          </div>
        }
      />

      <div className="mt-8 space-y-6">
        <div className="bg-[#0a111f] border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              contribution.status === "merged" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300" :
              contribution.status === "pending" ? "border-amber-300/30 bg-amber-300/10 text-amber-300" :
              "border-red-300/30 bg-red-300/10 text-red-300"
            }`}>
              {contribution.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/60">
              {contribution.type}
            </span>
            <span className="text-xs text-white/40 font-mono">{contribution.date}</span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl text-white mb-4">
            {contribution.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
              {contribution.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {contribution.repoUrl && (
              <a href={contribution.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-white hover:border-emerald-300/40 hover:text-emerald-300 transition-colors">
                View Repository
              </a>
            )}
            {contribution.prUrl && (
              <a href={contribution.prUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-300/10 border border-emerald-300/20 rounded-xl px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-300/20 transition-colors">
                View Pull Request
              </a>
            )}
            <button
              onClick={() => setDeleteSlug(contribution.slug)}
              className="inline-flex items-center gap-2 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/20 transition-colors ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title="Edit Contribution">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
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
              disabled={loading}
              className="flex-1 bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-300/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Contribution"}
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
