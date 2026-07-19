"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function EducationAdminPage() {
  return (
    <GenericAdminPage
      title="Education"
      apiEndpoint="/api/education"
      fields={[
        { key: "school", label: "School" },
        { key: "href", label: "Website URL" },
        { key: "degree", label: "Degree" },
        { key: "logoUrl", label: "Logo URL" },
        { key: "start", label: "Start Year" },
        { key: "end", label: "End Year" },
      ]}
      defaultValues={{
        school: "",
        href: "",
        degree: "",
        logoUrl: "",
        start: "",
        end: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.school}</h3>
          <p className="text-white/60 text-sm">{item.degree}</p>
        </div>
      )}
    />
  );
}
