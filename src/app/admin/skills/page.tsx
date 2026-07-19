"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function SkillsAdminPage() {
  return (
    <GenericAdminPage
      title="Skills"
      apiEndpoint="/api/skills"
      fields={[
        { key: "title", label: "Skill Title" },
        { key: "iconsType", label: "Icon Name" },
      ]}
      defaultValues={{
        title: "",
        iconsType: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg">{item.title}</h3>
        </div>
      )}
    />
  );
}
