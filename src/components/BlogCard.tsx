import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
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
    <>
      <Link href={`/blog/${id}`} className="group block">
        <div className="relative w-full h-48 overflow-hidden rounded-2xl mb-4 border border-white/10">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <div className="text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-2">
          {date}
        </div>
        <h3 className="font-serif text-xl leading-snug text-white group-hover:text-emerald-300 transition-colors mb-2">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:text-emerald-300 transition-colors">
          <span>Read Article</span>
          <ArrowRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </>
  );
};

export default BlogCard;
