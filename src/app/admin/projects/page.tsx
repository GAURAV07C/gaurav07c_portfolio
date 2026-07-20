"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlurFade from "@/components/BlurFade";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddButton } from "@/components/admin/AddButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminItemCard } from "@/components/admin/AdminItemCard";
import { FormField, Input } from "@/components/admin/FormComponents";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

interface Project {
  id: string;
  company: string;
  year: string;
  title: string;
  description: string;
  results: string;
  features: string;
  challenges: string;
  outcomes: string;
  techStack: string;
  liveLink?: string;
  sourceLink?: string;
  demoLink?: string;
  image: string;
  skills?: { title: string }[];
  isRecent?: boolean;
}

function ProjectsInner() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<{ id: string; title: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    year: "",
    title: "",
    description: "",
    results: "[]",
    features: "[]",
    challenges: "[]",
    outcomes: "[]",
    techStack: "[]",
    liveLink: "",
    sourceLink: "",
    demoLink: "",
    image: "",
    isRecent: false,
  });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProjects = () => {
    return fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const fetchSkills = () => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => setSkills(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && projects.length > 0) {
      const projectToEdit = projects.find(p => p.id === editId);
      if (projectToEdit) {
        openEditModal(projectToEdit);
      }
    }
  }, [searchParams, projects]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      company: "",
      year: "",
      title: "",
      description: "",
      results: "[]",
      features: "[]",
      challenges: "[]",
      outcomes: "[]",
      techStack: "[]",
      liveLink: "",
      sourceLink: "",
      demoLink: "",
      image: "",
      isRecent: false,
    });
    setShowModal(true);
  };

  const openEditModal = (item: Project) => {
    setEditingId(item.id);
    setFormData({
      company: item.company || "",
      year: item.year || "",
      title: item.title || "",
      description: item.description || "",
      results: item.results || "[]",
      features: item.features || "[]",
      challenges: item.challenges || "[]",
      outcomes: item.outcomes || "[]",
      techStack: item.techStack || "[]",
      liveLink: item.liveLink || "",
      sourceLink: item.sourceLink || "",
      demoLink: item.demoLink || "",
      image: item.image || "",
      isRecent: item.isRecent || false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      company: "",
      year: "",
      title: "",
      description: "",
      results: "[]",
      features: "[]",
      challenges: "[]",
      outcomes: "[]",
      techStack: "[]",
      liveLink: "",
      sourceLink: "",
      demoLink: "",
      image: "",
      isRecent: false,
    });
  };

  const handleView = (id: string) => {
    router.push(`/project/${id}`);
  };

  const toggleSkill = (skillTitle: string) => {
    let newTechStack: string[];
    try {
      newTechStack = JSON.parse(formData.techStack);
    } catch {
      newTechStack = [];
    }

    if (newTechStack.includes(skillTitle)) {
      newTechStack = newTechStack.filter((s: string) => s !== skillTitle);
    } else {
      newTechStack.push(skillTitle);
    }

    setFormData(prev => ({
      ...prev,
      techStack: JSON.stringify(newTechStack),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.addToast({ type: "success", message: editingId ? "Project updated successfully!" : "Project added successfully!" });
        closeModal();
        fetchProjects();
      } else {
        toast.addToast({ type: "error", message: "Failed to save project" });
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
      const res = await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Project deleted successfully!" });
        fetchProjects();
      } else {
        toast.addToast({ type: "error", message: "Failed to delete project" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setDeleteId(null);
    }
  };

  const selectedSkills = (() => {
    try {
      return JSON.parse(formData.techStack);
    } catch {
      return [];
    }
  })();

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Projects"
        description="Manage your portfolio projects and showcase your work."
        action={<AddButton onClick={openAddModal} label="+ Add Project" />}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">All Projects</h2>
        <p className="text-white/60 text-sm">
          {projects.length} {projects.length === 1 ? "project" : "projects"} in your portfolio
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects yet"
          description="Add your first project to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <BlurFade key={project.id} delay={index * 0.05}>
              <AdminItemCard
                title={project.title}
                subtitle={
                  <span className="flex items-center gap-2 flex-wrap">
                    <span>{project.company} • {project.year}</span>
                    {project.isRecent && (
                      <span className="px-2 py-0.5 bg-emerald-300/20 text-emerald-300 text-xs rounded-full font-mono">
                        Recent
                      </span>
                    )}
                  </span>
                }
                image={project.image}
                onView={() => handleView(project.id)}
                onEdit={() => openEditModal(project)}
                onDelete={() => setDeleteId(project.id)}
              />
            </BlurFade>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editingId ? "Edit Project" : "Add New Project"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company">
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                autoFocus
              />
            </FormField>

            <FormField label="Year">
              <Input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Title">
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormField>

          <MarkdownEditor
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Add project description..."
          />

          <MarkdownEditor
            label="Results"
            value={formData.results}
            onChange={(value) => setFormData({ ...formData, results: value })}
            placeholder="Add key results..."
          />

          <FormField label="Tech Stack / Skills">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => {
                  const isSelected = selectedSkills.includes(skill.title);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.title)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        isSelected
                          ? "bg-emerald-300 text-gray-950"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {isSelected && "✓ "}
                      {skill.title}
                    </button>
                  );
                })}
              </div>
              {selectedSkills.length > 0 && (
                <div className="text-xs text-white/40">
                  Selected: {selectedSkills.join(", ")}
                </div>
              )}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Live Link">
              <Input
                type="text"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
              />
            </FormField>

            <FormField label="Source Link">
              <Input
                type="text"
                value={formData.sourceLink}
                onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Image Path">
            <Input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </FormField>

          <div className="flex items-center gap-3 p-4 bg-gray-950 border border-white/10 rounded-xl">
            <input
              type="checkbox"
              id="isRecent"
              checked={formData.isRecent}
              onChange={(e) => setFormData({ ...formData, isRecent: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-gray-900 text-emerald-300 focus:ring-emerald-300 focus:ring-offset-gray-900"
            />
            <label htmlFor="isRecent" className="text-sm text-white/70 cursor-pointer">
              Show as <span className="text-emerald-300 font-semibold">Recent Project</span> on homepage
            </label>
          </div>

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
                editingId ? "Update Project" : "Add Project"
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
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

export default function ProjectsAdminPage() {
  return (
    <Suspense fallback={<div className="text-white/50">Loading projects...</div>}>
      <ProjectsInner />
    </Suspense>
  );
}
