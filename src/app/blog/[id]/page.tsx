import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { MarkdownPreview } from "@/components/admin/MarkdownPreview";
import { CommentSection } from "@/components/CommentSection";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from "@/assets/icons/arrow-up-right.svg";
import { RelatedBlogsWrapper } from "@/components/blog/RelatedBlogsWrapper";

export const revalidate = 3600;

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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16 lg:py-40">
        <div className="container max-w-3xl">
          <Link
            href={blogLink}
            className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-300 transition-colors mb-10"
          >
            <ArrowLeft className="size-4 rotate-180" />
            <span>Back to Blogs</span>
          </Link>

          <article>
            <div className="text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-4">
              {blog.date}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              {blog.title}
            </h1>

            <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-white/70 text-lg leading-relaxed">
              <MarkdownPreview content={blog.content} />
            </div>

            <RelatedBlogsWrapper currentBlogId={blog.id} currentTags={tags} />
            <CommentSection blogId={blog.id} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
