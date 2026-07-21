import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { BlogPageClient } from "./blogPageClient";

export const revalidate = 60;

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    select: { slug: true, id: true },
  });

  return blogs.map((blog) => ({
    id: blog.slug || blog.id,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${blog.title} | Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { id } = await params;
  const blog = await prisma.blog.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-3xl">
            <div className="text-center text-red-400">Blog not found</div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 transition-colors mt-4"
            >
              <ArrowLeft className="size-4 rotate-180" />
              <span>Back to Blogs</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const blogSlug = blog.slug || blog.id;
  const blogLink = `/blog/${blogSlug}`;

  let tags: string[] = [];
  try {
    tags = JSON.parse(blog.tags || "[]");
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen bg-[#0a111f] flex flex-col">
      <Header />
      <BlogPageClient
        blog={{
          id: blog.id,
          title: blog.title,
          date: blog.date,
          content: blog.content,
          image: blog.image,
          tags,
          slug: blog.slug,
        }}
      />
      <Footer />
    </div>
  );
}
