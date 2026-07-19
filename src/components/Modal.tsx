"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
