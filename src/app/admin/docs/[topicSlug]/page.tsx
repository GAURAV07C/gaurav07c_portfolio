"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminItemCard } from "@/components/admin/AdminItemCard";
import { DocsPageForm } from "@/components/admin/docs/DocsPageForm";

interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
}

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  pages: DocPage[];
}

interface AdminDocsTopicPageProps {
  params: Promise<{ topicSlug: string }>;
}

export default function AdminDocsTopicPage({ params }: AdminDocsTopicPageProps) {
  const resolvedParams = use(params);
  const [topic, setTopic] = useState<DocTopic | null>(null);
  const [pages, setPages] = useState<DocPage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", content: "", order: "0" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const fetchTopic = useCallback(() => {
    fetch(`/api/docs/${resolvedParams.topicSlug}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Topic not found");
        return res.json();
      })
      .then((data: DocTopic) => {
        setTopic(data);
        setPages(data.pages || []);
      })
      .catch((err) => {
        console.error(err);
        toast.addToast({ type: "error", message: "Failed to load topic" });
      });
  }, [resolvedParams.topicSlug, toast]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", slug: "", content: "", order: String(pages.length) });
    setShowModal(true);
  };

  const openEditModal = (page: DocPage) => {
    setEditingId(page.id);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      order: String(page.order),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", slug: "", content: "", order: "0" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = !!editingId;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/docs/${resolvedParams.topicSlug}/pages/${editingId}`
        : `/api/docs/${resolvedParams.topicSlug}/pages`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 0,
        }),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: isEdit ? "Page updated successfully!" : "Page added successfully!" });
        closeModal();
        fetchTopic();
      } else {
        toast.addToast({ type: "error", message: "Failed to save page" });
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
      const res = await fetch(`/api/docs/${resolvedParams.topicSlug}/pages/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Page deleted successfully!" });
        fetchTopic();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete page" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteId(null);
    }
  };

  if (!topic) {
    return <div className="text-white/50">Loading topic...</div>;
  }

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={`Docs: ${topic.title}`}
        description={`Manage pages for the "${topic.title}" topic.`}
        action={
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/docs")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-xl transition-all border border-white/10"
            >
              &larr; Back
            </button>
            <AddButton onClick={openAddModal} label="+ Add Page" />
          </div>
        }
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Pages</h2>
        <p className="text-white/60 text-sm">
          {pages.length} {pages.length === 1 ? "page" : "pages"} in this topic
        </p>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No pages yet"
          description="Add your first documentation page to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((page, index) => (
            <BlurFade key={page.id} delay={index * 0.05}>
              <AdminItemCard
                title={page.title}
                subtitle={`Order: ${page.order} · ${page.slug}`}
                image=""
                onView={() => window.open(`/docs/${topic.slug}/${page.slug}`, "_blank")}
                onEdit={() => openEditModal(page)}
                onDelete={() => setDeleteId(page.id)}
              >
                {page.content.slice(0, 100) || "No content"}
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Page" : "Add New Page"}>
        <DocsPageForm
          isOpen={showModal}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={setFormData}
          loading={loading}
          editingId={editingId}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
