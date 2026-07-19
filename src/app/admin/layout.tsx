import Link from "next/link";
import { ReactNode } from "react";
import BlurFade from "@/components/BlurFade";
import { ToastProvider } from "@/components/ToastProvider";
import { ToastContainer } from "@/components/ToastContainer";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row font-sans">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 border-r border-white/10 p-6 flex flex-col gap-8">
          <div className="font-serif text-2xl tracking-widest text-emerald-300">
            Admin Panel
          </div>
          <nav className="flex flex-col gap-4 text-white/70">
            <Link href="/admin" className="hover:text-emerald-300 transition">Dashboard</Link>
            <Link href="/admin/settings" className="hover:text-emerald-300 transition">Site Settings</Link>
            <Link href="/admin/hero" className="hover:text-emerald-300 transition">Hero</Link>
            <Link href="/admin/projects" className="hover:text-emerald-300 transition">Projects</Link>
            <Link href="/admin/blogs" className="hover:text-emerald-300 transition">Blogs</Link>
            <Link href="/admin/skills" className="hover:text-emerald-300 transition">Skills</Link>
            <Link href="/admin/education" className="hover:text-emerald-300 transition">Education</Link>
            <Link href="/admin/experience" className="hover:text-emerald-300 transition">Experience</Link>
            <Link href="/admin/testimonials" className="hover:text-emerald-300 transition">Testimonials</Link>
            <Link href="/admin/hobbies" className="hover:text-emerald-300 transition">Hobbies</Link>
            <Link href="/admin/tape-words" className="hover:text-emerald-300 transition">Tape Words</Link>
            <Link href="/admin/messages" className="hover:text-emerald-300 transition">Messages</Link>
          </nav>
          <div className="mt-auto">
            <Link href="/" className="text-sm text-white/40 hover:text-white transition">
              &larr; Back to Portfolio
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <BlurFade>
            {children}
          </BlurFade>
        </main>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
