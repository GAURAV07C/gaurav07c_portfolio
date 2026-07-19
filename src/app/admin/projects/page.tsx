"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function ProjectsAdminPage() {
  return (
    <GenericAdminPage
      title="Projects"
      apiEndpoint="/api/projects"
      fields={[
        { key: "company", label: "Company" },
        { key: "year", label: "Year" },
        { key: "title", label: "Title" },
        { key: "results", label: "Results (JSON array)", type: "textarea" },
        { key: "techStack", label: "Tech Stack (JSON array)", type: "textarea" },
        { key: "liveLink", label: "Live Link" },
        { key: "sourceLink", label: "Source Link" },
        { key: "demoLink", label: "Demo Link" },
        { key: "image", label: "Image Path" },
      ]}
      defaultValues={{
        company: "",
        year: "",
        title: "",
        results: "[]",
        techStack: "[]",
        liveLink: "",
        sourceLink: "",
        demoLink: "",
        image: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
          <p className="text-white/60 text-sm mb-2">{item.company} • {item.year}</p>
        </div>
      )}
    />
  );
}
