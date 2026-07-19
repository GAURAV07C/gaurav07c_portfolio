"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function HobbiesAdminPage() {
  return (
    <GenericAdminPage
      title="Hobbies"
      apiEndpoint="/api/hobbies"
      fields={[
        { key: "title", label: "Title" },
        { key: "emoji", label: "Emoji" },
        { key: "left", label: "Left Position (%)" },
        { key: "top", label: "Top Position (%)" },
      ]}
      defaultValues={{
        title: "",
        emoji: "",
        left: "0%",
        top: "0%",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
          <p className="text-white/60 text-sm">{item.emoji}</p>
        </div>
      )}
    />
  );
}
