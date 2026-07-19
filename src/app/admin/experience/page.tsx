"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function ExperienceAdminPage() {
  return (
    <GenericAdminPage
      title="Experience"
      apiEndpoint="/api/experience"
      fields={[
        { key: "company", label: "Company" },
        { key: "href", label: "Website URL" },
        { key: "badges", label: "Badges (JSON array)", type: "textarea" },
        { key: "location", label: "Location" },
        { key: "title", label: "Job Title" },
        { key: "logoUrl", label: "Logo URL" },
        { key: "start", label: "Start Date" },
        { key: "end", label: "End Date" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      defaultValues={{
        company: "",
        href: "",
        badges: "[]",
        location: "",
        title: "",
        logoUrl: "",
        start: "",
        end: "",
        description: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.company}</h3>
          <p className="text-white/60 text-sm">{item.title}</p>
        </div>
      )}
    />
  );
}
