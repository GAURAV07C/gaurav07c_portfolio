"use client";

import React from "react";
import { FormField, Input } from "@/components/admin/FormComponents";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

interface DocPageFormData {
  title: string;
  slug: string;
  content: string;
  order: string;
}

interface DocsPageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: DocPageFormData;
  onChange: (data: DocPageFormData) => void;
  loading: boolean;
  editingId: string | null;
}

export function DocsPageForm({ isOpen, onClose, onSubmit, formData, onChange, loading, editingId }: DocsPageFormProps) {
  if (!isOpen) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Title">
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          required
          autoFocus
        />
      </FormField>

      <FormField label="Slug">
        <Input
          type="text"
          value={formData.slug}
          onChange={(e) => onChange({ ...formData, slug: e.target.value })}
          placeholder="e.g. introduction"
          required
        />
      </FormField>

      <FormField label="Order">
        <Input
          type="number"
          value={formData.order}
          onChange={(e) => onChange({ ...formData, order: e.target.value })}
          placeholder="0"
        />
      </FormField>

      <FormField label="Content">
        <MarkdownEditor
          value={formData.content}
          onChange={(value) => onChange({ ...formData, content: value })}
          placeholder="Write your documentation content in markdown..."
          minHeight="400px"
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
            editingId ? "Update Page" : "Add Page"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all border border-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
