"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="text-sm text-red-400 hover:text-red-300 transition text-left"
    >
      Sign Out
    </button>
  );
}
