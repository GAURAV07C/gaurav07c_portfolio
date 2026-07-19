import React from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const projectsCount = await prisma.project.count();
  const blogsCount = await prisma.blog.count();
  const skillsCount = await prisma.skill.count();
  const messagesCount = await prisma.message.count();

  return (
    <div>
      <h1 className="text-4xl font-serif mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Projects</h2>
          <div className="text-4xl font-bold text-emerald-300">{projectsCount}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Published Blogs</h2>
          <div className="text-4xl font-bold text-emerald-300">{blogsCount}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Skills</h2>
          <div className="text-4xl font-bold text-emerald-300">{skillsCount}</div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-white/60 text-sm uppercase tracking-wider mb-2">Messages</h2>
          <div className="text-4xl font-bold text-emerald-300">{messagesCount}</div>
        </div>
      </div>
    </div>
  );
}
