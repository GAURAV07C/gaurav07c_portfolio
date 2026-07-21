"use client";

import React from "react";
import Link from "next/link";

export function DocsNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-3xl text-center">
          <h1 className="text-3xl font-serif text-white mb-4">Page Not Found</h1>
          <p className="text-white/60 mb-8">The documentation page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/docs" className="text-emerald-300 hover:text-emerald-400 transition-colors">
            &larr; Back to Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
