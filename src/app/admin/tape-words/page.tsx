"use client";

import GenericAdminPage from "@/components/admin/GenericAdminPage";

export default function TapeWordsAdminPage() {
  return (
    <GenericAdminPage
      title="Tape Words"
      apiEndpoint="/api/tape-words"
      fields={[
        { key: "word", label: "Word" },
      ]}
      defaultValues={{
        word: "",
      }}
      renderItem={(item) => (
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg">{item.word}</h3>
        </div>
      )}
    />
  );
}
