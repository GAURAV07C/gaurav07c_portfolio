"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      {children}
    </div>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition ${className}`}
    />
  );
}

export function TextArea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition font-mono text-sm ${className}`}
    />
  );
}
