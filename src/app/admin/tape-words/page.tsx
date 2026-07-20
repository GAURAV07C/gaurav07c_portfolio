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

interface TapeWord {
  id: string;
  word: string;
}

export default function TapeWordsAdminPage() {
  const [words, setWords] = useState<TapeWord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ word: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const fetchWords = () => {
    fetch("/api/tape-words")
      .then(res => res.json())
      .then(data => setWords(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ word: "" });
    setShowModal(true);
  };

  const openEditModal = (item: TapeWord) => {
    setEditingId(item.id);
    setFormData({ word: item.word });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ word: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/tape-words/${editingId}` : "/api/tape-words";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Word updated successfully!" : "Word added successfully!" });
        closeModal();
        fetchWords();
      } else {
        toast.addToast({ type: "error", message: "Failed to save word" });
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
      const res = await fetch(`/api/tape-words/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Word deleted successfully!" });
        fetchWords();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete word" });
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
        title="Tape Words"
        description="Manage the scrolling words displayed in the tape section at the top of your portfolio."
        action={<AddButton onClick={openAddModal} label="+ Add Word" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Words</h2>
        <p className="text-white/60 text-sm">
          {words.length} {words.length === 1 ? "word" : "words"} in the tape section
        </p>
      </div>

      {words.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No words yet"
          description="Add your first word to get started."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((word, index) => (
            <BlurFade key={word.id} delay={index * 0.05}>
              <AdminItemCard
                title={word.word}
                subtitle={`#${index + 1} in sequence`}
                onEdit={() => openEditModal(word)}
                onDelete={() => setDeleteId(word.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Word" : "Add New Word"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Word">
            <Input
              type="text"
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              placeholder="Enter a word, e.g. Performant"
              required
              autoFocus
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
                editingId ? "Update Word" : "Add Word"
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
        title="Delete Word"
        message="Are you sure you want to delete this word? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
