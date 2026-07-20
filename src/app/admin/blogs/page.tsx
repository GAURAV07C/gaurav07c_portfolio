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
import { FormField, Input, TextArea } from "@/components/admin/FormComponents";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

interface Blog {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", date: "", excerpt: "", content: "", image: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const fetchBlogs = () => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", date: "", excerpt: "", content: "", image: "", tags: "" });
    setShowModal(true);
  };

  const openEditModal = (item: Blog) => {
    setEditingId(item.id);
    const tags = item.tags ? JSON.parse(item.tags).join(", ") : "";
    setFormData({ title: item.title, date: item.date, excerpt: item.excerpt, content: item.content, image: item.image, tags });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: "", date: "", excerpt: "", content: "", image: "", tags: "" });
  };

  const handleView = (id: string) => {
    router.push(`/blog/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tags: JSON.stringify(tagsArray) }),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Blog updated successfully!" : "Blog added successfully!" });
        closeModal();
        fetchBlogs();
      } else {
        toast.addToast({ type: "error", message: "Failed to save blog" });
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
      const res = await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Blog deleted successfully!" });
        fetchBlogs();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete blog" });
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
        title="Blogs"
        description="Manage your blog posts. Create, edit, and delete articles."
        action={<AddButton onClick={openAddModal} label="+ Add Blog" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Blogs</h2>
        <p className="text-white/60 text-sm">
          {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} in your portfolio
        </p>
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No blogs yet"
          description="Add your first blog post to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {blogs.map((blog, index) => (
            <BlurFade key={blog.id} delay={index * 0.05}>
              <AdminItemCard
                title={blog.title}
                subtitle={blog.date}
                image={blog.image}
                onView={() => handleView(blog.id)}
                onEdit={() => openEditModal(blog)}
                onDelete={() => setDeleteId(blog.id)}
              >
                {blog.excerpt}
              </AdminItemCard>
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Blog" : "Add New Blog"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Title">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              autoFocus
            />
          </FormField>

          <FormField label="Date">
            <Input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="e.g. July 12, 2026"
              required
            />
          </FormField>

          <FormField label="Excerpt">
            <TextArea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              required
            />
          </FormField>

          <FormField label="Tags">
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="react, nextjs, web development (comma separated)"
            />
          </FormField>

          <FormField label="Content">
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content in markdown..."
              minHeight="400px"
            />
          </FormField>

          <FormField label="Image Path">
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/blog-image.png"
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
                editingId ? "Update Blog" : "Add Blog"
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
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
