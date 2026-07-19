"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function TestimonialsAdminPage() {
  return (
    <GenericAdminPage
      title="Testimonials"
      apiEndpoint="/api/testimonials"
      fields={[
        { key: "name", label: "Name" },
        { key: "position", label: "Position" },
        { key: "text", label: "Testimonial", type: "textarea" },
        { key: "avatar", label: "Avatar URL" },
      ]}
      defaultValues={{
        name: "",
        position: "",
        text: "",
        avatar: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
          <p className="text-white/60 text-sm">{item.position}</p>
        </div>
      )}
    />
  );
}
