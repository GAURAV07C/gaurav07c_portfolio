"use client";

import React from "react";
import { useToast, Toast } from "./ToastProvider";

export function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div
      className={`p-4 rounded-xl border shadow-lg min-w-[300px] animate-in slide-in-from-right ${
        toast.type === "success"
          ? "bg-emerald-300/10 border-emerald-300/30 text-emerald-300"
          : toast.type === "error"
          ? "bg-red-300/10 border-red-300/30 text-red-300"
          : "bg-blue-300/10 border-blue-300/30 text-blue-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
        </span>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
