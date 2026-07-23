"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
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
import { useCachedFetch, useInvalidateCache } from "@/hooks/useCachedFetch";

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
  tags: string;
  liveLink?: string;
  sourceLink?: string;
  demoLink?: string;
  image: string;
  skills?: { title: string }[];
  isRecent?: boolean;
  slug?: string;
  views?: number;
}

function ProjectsInner() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    year: "",
    title: "",
    slug: "",
    description: "",
    results: "",
    features: "",
    challenges: "",
    outcomes: "",
    techStack: "",
    tags: "",
    liveLink: "",
    sourceLink: "",
    demoLink: "",
    image: "",
    isRecent: false,
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rawData, setRawData] = useState("");
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invalidateCache = useInvalidateCache();

  const { data: projects = [], refetch: refetchProjects } = useCachedFetch<Project[]>({
    key: "admin_projects",
    fetchFn: () => fetch("/api/projects", { cache: "no-store" }).then(res => res.json()),
  });

  const { data: skills = [], refetch: refetchSkills } = useCachedFetch<{ id: string; title: string }[]>({
    key: "admin_skills",
    fetchFn: () => fetch("/api/skills", { cache: "no-store" }).then(res => res.json()),
  });

  const projectsList = useMemo(() => Array.isArray(projects) ? projects : [], [projects]);
  const skillsList = useMemo(() => Array.isArray(skills) ? skills : [], [skills]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && projectsList.length > 0) {
      const projectToEdit = projectsList.find(p => p.id === editId);
      if (projectToEdit) {
        openEditModal(projectToEdit);
      }
    }
  }, [searchParams, projectsList]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      company: "",
      year: "",
      title: "",
      slug: "",
      description: "",
      results: "",
      features: "",
      challenges: "",
      outcomes: "",
      techStack: "",
      tags: "",
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
      slug: item.slug || "",
      description: item.description || "",
      results: item.results || "",
      features: item.features || "",
      challenges: item.challenges || "",
      outcomes: item.outcomes || "",
      techStack: item.techStack || "",
      tags: item.tags || "",
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
      slug: "",
      description: "",
      results: "",
      features: "",
      challenges: "",
      outcomes: "",
      techStack: "",
      tags: "",
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
    const current = formData.techStack || "";
    const items = current.split("\n").map(line => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
    
    const index = items.indexOf(skillTitle);
    if (index >= 0) {
      items.splice(index, 1);
    } else {
      items.push(skillTitle);
    }
    
    setFormData(prev => ({
      ...prev,
      techStack: items.map(item => `- ${item}`).join("\n"),
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
        invalidateCache();
        refetchProjects();
        refetchSkills();
      } else {
        toast.addToast({ type: "error", message: "Failed to save project" });
      }
    } catch {
      toast.addToast({ type: "error", message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!rawData.trim()) {
      toast.addToast({ type: "error", message: "Please paste some project info first" });
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData }),
      });

      if (!res.ok) {
        const err = await res.json();
        const msg = err.error || "Failed to save project";
        toast.addToast({ type: "error", message: msg });
      }

      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        company: data.company || prev.company,
        year: data.year || prev.year,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        description: data.description || prev.description,
        results: data.results || prev.results,
        features: data.features || prev.features,
        challenges: data.challenges || prev.challenges,
        outcomes: data.outcomes || prev.outcomes,
        techStack: data.techStack || prev.techStack,
        tags: data.tags || prev.tags,
        liveLink: data.liveLink || prev.liveLink,
        sourceLink: data.sourceLink || prev.sourceLink,
        demoLink: data.demoLink || prev.demoLink,
        image: data.image || prev.image,
        isRecent: data.isRecent ?? prev.isRecent,
      }));
      toast.addToast({ type: "success", message: "AI generated project data!" });
    } catch (error) {
      toast.addToast({ type: "error", message: error instanceof Error ? error.message : "AI generation failed" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.addToast({ type: "success", message: "Project deleted successfully!" });
        invalidateCache();
        refetchProjects();
        refetchSkills();
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
    if (!formData.techStack) return [];
    return formData.techStack.split("\n").map(line => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
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
          {projectsList.length} {projectsList.length === 1 ? "project" : "projects"} in your portfolio
        </p>
      </div>

      {projectsList.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects yet"
          description="Add your first project to get started."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {projectsList.map((project, index) => (
            <BlurFade key={project.id} delay={index * 0.05}>
               <AdminItemCard
                title={project.title}
                subtitle={
                  <span className="flex items-center gap-2 flex-wrap">
                    <span>{project.company} • {project.year}</span>
                    <span className="flex items-center gap-1 text-white/40">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {(project.views ?? 0).toLocaleString()}
                    </span>
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
          <div className="p-4 bg-gray-950 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">AI Auto Fill</h3>
                <p className="text-xs text-white/50">Paste project info, README, or notes below and let AI fill the form.</p>
              </div>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="px-4 py-2 bg-emerald-300 hover:bg-emerald-400 text-gray-950 text-sm font-bold rounded-lg transition disabled:opacity-50"
              >
                {aiLoading ? "Generating..." : "Generate"}
              </button>
            </div>
            <textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Paste GitHub README, project description, features, tech stack, or any notes here..."
              className="w-full h-32 bg-gray-900 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-300/50"
            />
          </div>

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
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ 
                  ...formData, 
                  title,
                  slug: editingId ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                });
              }}
              required
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

          <MarkdownEditor
            label="Features"
            value={formData.features}
            onChange={(value) => setFormData({ ...formData, features: value })}
            placeholder="Add key features..."
          />

          <MarkdownEditor
            label="Challenges"
            value={formData.challenges}
            onChange={(value) => setFormData({ ...formData, challenges: value })}
            placeholder="Add challenges..."
          />

          <MarkdownEditor
            label="Outcomes"
            value={formData.outcomes}
            onChange={(value) => setFormData({ ...formData, outcomes: value })}
            placeholder="Add outcomes..."
          />

          <FormField label="Tech Stack / Skills">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                 {skillsList.map(skill => {
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

          <FormField label="Tags">
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="react, nextjs, web development"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Live Link">
              <Input
                type="text"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
              />
            </FormField>

            <FormField label="Demo Link (YouTube)">
              <Input
                type="text"
                value={formData.demoLink}
                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </FormField>
          </div>

          <FormField label="Source Link (GitHub)">
            <Input
              type="text"
              value={formData.sourceLink}
              onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
            />
          </FormField>

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
