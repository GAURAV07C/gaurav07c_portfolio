import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CommentRow {
  id: string;
  content: string;
  name: string;
  email: string;
  parentId: string | null;
  blogId: string | null;
  projectId: string | null;
  createdAt: string;
}

function buildCommentTree(comments: CommentRow[]): CommentRow[] {
  const commentMap = new Map<string, CommentRow & { replies: CommentRow[] }>();
  const roots: CommentRow[] = [];

  for (const comment of comments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentMap.get(comment.id)!);
      }
    } else {
      roots.push(commentMap.get(comment.id)!);
    }
  }

  return roots;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    const projectId = searchParams.get("projectId");

    if (!blogId && !projectId) {
      return NextResponse.json({ error: "blogId or projectId required" }, { status: 400 });
    }

    if (blogId && projectId) {
      return NextResponse.json({ error: "Provide either blogId or projectId, not both" }, { status: 400 });
    }

    const where: { blogId?: string; projectId?: string } = {};
    if (blogId) where.blogId = blogId;
    if (projectId) where.projectId = projectId;

    const comments = (await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "asc" },
    })).map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })) as CommentRow[];

    const commentTree = buildCommentTree(comments);

    return NextResponse.json(commentTree, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, name, email, blogId, projectId, parentId } = body;

    if (!content || !name || !email) {
      return NextResponse.json({ error: "content, name and email are required" }, { status: 400 });
    }

    if (!blogId && !projectId) {
      return NextResponse.json({ error: "blogId or projectId required" }, { status: 400 });
    }

    if (blogId && projectId) {
      return NextResponse.json({ error: "Provide either blogId or projectId, not both" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        name,
        email,
        blogId,
        projectId,
        parentId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
