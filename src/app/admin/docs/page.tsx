"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminItemCard } from "@/components/admin/AdminItemCard";
import { DocsTopicForm } from "@/components/admin/docs/DocsTopicForm";

interface DocPage {
  id: string;
  title: string;
  slug: string;
  order: number;
}

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  pages: DocPage[];
}

export default function DocsAdminPage() {
  const [topics, setTopics] = useState<DocTopic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", description: "", icon: "", order: "0" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const fetchTopics = () => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => setTopics(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", slug: "", description: "", icon: "", order: "0" });
    setShowModal(true);
  };

  const openEditModal = (topic: DocTopic) => {
    setEditingId(topic.id);
    setFormData({
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      icon: topic.icon,
      order: String(topic.order),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", slug: "", description: "", icon: "", order: "0" });
  };

  const handleManagePages = (topic: DocTopic) => {
    router.push(`/admin/docs/${topic.slug}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/docs/${editingId}` : "/api/docs";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 0,
        }),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Topic updated successfully!" : "Topic added successfully!" });
        closeModal();
        fetchTopics();
      } else {
        toast.addToast({ type: "error", message: "Failed to save topic" });
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
      const res = await fetch(`/api/docs/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Topic deleted successfully!" });
        fetchTopics();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete topic" });
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
        title="Docs"
        description="Manage documentation topics and pages."
        action={<AddButton onClick={openAddModal} label="+ Add Topic" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Topics</h2>
        <p className="text-white/60 text-sm">
          {topics.length} {topics.length === 1 ? "topic" : "topics"} in your portfolio
        </p>
      </div>

      {topics.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No topics yet"
          description="Add your first documentation topic to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {topics.map((topic, index) => (
            <BlurFade key={topic.id} delay={index * 0.05}>
              <AdminItemCard
                title={topic.title}
                subtitle={`${topic.pages.length} pages · ${topic.slug}`}
                image={topic.icon || ""}
                onView={() => handleManagePages(topic)}
                onEdit={() => openEditModal(topic)}
                onDelete={() => setDeleteId(topic.id)}
              >
                {topic.description || "No description"}
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Topic" : "Add New Topic"}>
        <DocsTopicForm
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
        title="Delete Topic"
        message="Are you sure you want to delete this topic? All pages within it will also be deleted. This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
