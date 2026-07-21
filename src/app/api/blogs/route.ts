import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
};

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(blogs, { status: 200, headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
    };

    const newBlog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: body.slug || generateSlug(body.title),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt: body.excerpt,
        content: body.content,
        link: `/blog/${body.slug || generateSlug(body.title)}`,
        image: body.image || "/images/default-blog.png",
        tags: body.tags || "[]",
      }
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
