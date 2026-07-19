import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Card from "./Card";
import ArrowRight from "@/assets/icons/arrow-up-right.svg";

interface BlogCardProps {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: StaticImageData | string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, date, excerpt, image }) => {
  return (
    <Card className="flex flex-col h-full group hover:outline-emerald-300/50 transition duration-300">
      <div className="relative w-full h-48 overflow-hidden rounded-t-3xl border-b border-white/10">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col flex-grow p-6 md:p-8">
        <div className="text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-3">
          {date}
        </div>
        <h3 className="font-serif text-2xl mb-4 group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>
        <p className="text-white/60 mb-6 flex-grow">
          {excerpt}
        </p>
        <div className="mt-auto">
          <Link href={`/blog/${id}`}>
            <button className="inline-flex items-center gap-2 text-white font-semibold group-hover:text-emerald-300 transition-colors">
              <span>Read Article</span>
              <ArrowRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
