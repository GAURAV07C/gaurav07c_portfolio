"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { useToast } from "./ToastProvider";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      addToast({ type: "success", message: "Deleted successfully!" });
      onClose();
    } catch {
      addToast({ type: "error", message: "Failed to delete" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-white/60 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all border border-white/10 disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
