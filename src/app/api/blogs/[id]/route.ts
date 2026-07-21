import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });
    
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog, { status: 200, headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.blog.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
