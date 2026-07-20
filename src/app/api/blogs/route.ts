import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(blogs, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBlog = await prisma.blog.create({
      data: {
        title: body.title,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: body.excerpt,
        content: body.content,
        link: `/blog/${Date.now()}`,
        image: body.image || "/images/default-blog.png",
        tags: body.tags || "[]",
      }
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
