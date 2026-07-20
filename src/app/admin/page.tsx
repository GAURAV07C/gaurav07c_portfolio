"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil } from "lucide-react";

interface Project {
  id: string;
  title: string;
  image: string;
  company: string;
  year: string;
  createdAt: string;
  isRecent?: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, skills: 0, messages: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<{ id: string; title: string; date: string }[]>([]);
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; message: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(res => res.json()),
      fetch("/api/blogs").then(res => res.json()),
      fetch("/api/skills").then(res => res.json()),
      fetch("/api/messages").then(res => res.json()),
    ]).then(([projects, blogs, skills, messages]) => {
      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        skills: Array.isArray(skills) ? skills.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
      });
      setRecentProjects((Array.isArray(projects) ? projects : []).filter((p: { isRecent?: boolean }) => p.isRecent === true).slice(0, 5));
      setRecentBlogs((Array.isArray(blogs) ? blogs : []).slice(0, 5));
      setRecentMessages((Array.isArray(messages) ? messages : []).slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-white/50">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-serif mb-8 text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Projects</h2>
          <div className="text-4xl font-bold text-emerald-300">{stats.projects}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Published Blogs</h2>
          <div className="text-4xl font-bold text-emerald-300">{stats.blogs}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Skills</h2>
          <div className="text-4xl font-bold text-emerald-300">{stats.skills}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Messages</h2>
          <div className="text-4xl font-bold text-emerald-300">{stats.messages}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-white">Recent Projects</h2>
            <Link href="/admin/projects" className="text-emerald-300 hover:text-emerald-400 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center text-white/40">
              No projects yet
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 bg-gray-900 border border-white/10 rounded-xl p-4 hover:border-emerald-300/30 transition-all group"
                >
                  <Link href={`/admin/projects`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-gray-950">
                      {project.image && (
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={64}
                          height={64}
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium group-hover:text-emerald-300 transition-colors truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-white/40 font-mono mt-1">
                        {project.company} &bull; {project.year}
                        {project.isRecent && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-300/20 text-emerald-300 rounded-full">
                            Recent
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-white/30 flex-shrink-0 hidden md:block">
                      {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </Link>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/project/${project.id}?from=admin`}
                      className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      title="View"
                    >
                      <Eye className="size-4" />
                    </Link>
                    <Link
                      href={`/admin/projects?edit=${project.id}`}
                      className="text-white/60 hover:text-emerald-300 p-2 rounded-lg transition-all hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-white">Recent Blogs</h2>
              <Link href="/admin/blogs" className="text-emerald-300 hover:text-emerald-400 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            {recentBlogs.length === 0 ? (
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 text-center text-white/40 text-sm">
                No blogs yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href="/admin/blogs"
                    className="block bg-gray-900 border border-white/10 rounded-xl p-4 hover:border-emerald-300/30 transition-all group"
                  >
                    <div className="text-white font-medium text-sm group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {blog.title}
                    </div>
                    <div className="text-xs text-white/40 mt-1">{blog.date}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-white">Recent Messages</h2>
              <Link href="/admin/messages" className="text-emerald-300 hover:text-emerald-400 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 text-center text-white/40 text-sm">
                No messages yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-gray-900 border border-white/10 rounded-xl p-4"
                  >
                    <div className="text-white font-medium text-sm">{message.name}</div>
                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{message.message}</div>
                    <div className="text-xs text-white/30 mt-2">
                      {new Date(message.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
