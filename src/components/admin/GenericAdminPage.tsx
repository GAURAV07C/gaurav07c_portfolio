"use client";

import React, { useEffect, useState } from "react";
import BlurFade from "@/components/BlurFade";

interface Item {
  id: string;
  title?: string;
  name?: string;
  word?: string;
  company?: string;
  school?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export default function GenericAdminPage({
  title,
  apiEndpoint,
  fields,
  defaultValues,
  renderItem,
}: {
  title: string;
  apiEndpoint: string;
  fields: { key: string; label: string; type?: string }[];
  defaultValues: Record<string, string>;
  renderItem?: (item: Item) => React.ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>(defaultValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchItems = () => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${apiEndpoint}/${editingId}` : apiEndpoint;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage(editingId ? "Updated successfully!" : "Created successfully!");
        setFormData(defaultValues);
        setEditingId(null);
        fetchItems();
      } else {
        setMessage("Failed to save");
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    const newFormData: Record<string, string> = {};
    fields.forEach((f) => {
      const raw = item[f.key];
      newFormData[f.key] = raw == null ? "" : String(raw);
    });
    setFormData(newFormData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Deleted successfully!");
        fetchItems();
      }
    } catch {
      setMessage("Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">{title}</h1>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${message.includes("success") || message.includes("Deleted") ? "bg-emerald-300/20 text-emerald-300" : "bg-red-300/20 text-red-300"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/10 p-6 rounded-2xl mb-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add New"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-white/70 mb-2">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 transition h-24"
                  required
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 transition"
                  required
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-300 hover:bg-emerald-400 text-gray-950 font-bold py-3 px-6 rounded-xl transition"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData(defaultValues);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <BlurFade key={item.id}>
            <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
              {renderItem ? renderItem(item) : (
                <h3 className="font-semibold text-lg mb-2">
                  {item.title || item.name || item.word || item.company || item.school || "Item"}
                </h3>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm py-2 px-4 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

