import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DocsTopicPageClient } from "@/components/docs/DocsTopicPageClient";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import Link from "next/link";

export const revalidate = 3600;

interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
}

interface DocTopic {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  pages: DocPage[];
}

async function getTopics(): Promise<DocTopic[]> {
  const topics = await prisma.docTopic.findMany({
    orderBy: { order: "asc" },
    include: {
      pages: {
        orderBy: { order: "asc" },
      },
    },
  });

  return topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    icon: topic.icon || "",
    description: topic.description || "",
    pages: topic.pages.map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      order: page.order,
    })),
  }));
}

export async function generateStaticParams() {
  const topics = await prisma.docTopic.findMany({
    include: {
      pages: true,
    },
  });

  const params: { topic: string; pageSlug: string }[] = [];

  for (const topic of topics) {
    for (const page of topic.pages) {
      params.push({
        topic: topic.slug,
        pageSlug: page.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; pageSlug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === resolvedParams.topic);
  const page = topic?.pages.find((p) => p.slug === resolvedParams.pageSlug);

  if (!topic || !page) {
    return {
      title: "Page Not Found | Docs",
    };
  }

  return {
    title: `${page.title} | ${topic.title} | Docs`,
    description: topic.description,
  };
}

export default async function DocsTopicPage({
  params,
}: {
  params: Promise<{ topic: string; pageSlug: string }>;
}) {
  const resolvedParams = await params;
  const topics = await getTopics();
  const topic = topics.find((t) => t.slug === resolvedParams.topic);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-3xl text-center">
            <h1 className="text-3xl font-serif text-white mb-4">Page Not Found</h1>
            <p className="text-white/60 mb-8">The documentation page you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/docs" className="text-emerald-300 hover:text-emerald-400 transition-colors">
              &larr; Back to Docs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const page = topic.pages.find((p) => p.slug === resolvedParams.pageSlug);

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow pt-32 pb-16 lg:py-40">
          <div className="container max-w-3xl text-center">
            <h1 className="text-3xl font-serif text-white mb-4">Page Not Found</h1>
            <p className="text-white/60 mb-8">The documentation page you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/docs" className="text-emerald-300 hover:text-emerald-400 transition-colors">
              &larr; Back to Docs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <DocsTopicPageClient topic={topic} page={page} />;
}