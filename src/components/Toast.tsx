"use client";

import React, { useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let addToast: (toast: Omit<Toast, "id">) => void;
let removeToast: (id: string) => void;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, removeToast };
};

export { addToast, removeToast };

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  React.useEffect(() => {
    const originalAdd = addToast;
    const originalRemove = removeToast;
    
    addToast = (toast) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        originalRemove(id);
      }, 3000);
    };

    removeToast = (id) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return () => {
      addToast = originalAdd;
      removeToast = originalRemove;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
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
      ))}
    </div>
  );
}
