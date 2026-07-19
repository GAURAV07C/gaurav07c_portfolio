"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function BlogsAdminPage() {
  return (
    <GenericAdminPage
      title="Blogs"
      apiEndpoint="/api/blogs"
      fields={[
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "image", label: "Image Path" },
      ]}
      defaultValues={{
        title: "",
        date: "",
        excerpt: "",
        content: "",
        image: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
          <p className="text-white/60 text-sm mb-2">{item.date}</p>
        </div>
      )}
    />
  );
}
