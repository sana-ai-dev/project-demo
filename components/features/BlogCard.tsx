"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Tag } from "@/components/shared/Tag";
import { BlogSVGPattern } from "@/components/shared/BlogSVGPattern";
import { getBlogTheme } from "@/lib/blog-theme";
import type { BlogPost } from "@/lib/posts";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const theme = getBlogTheme(post.slug, post.category);

  return (
    <motion.a
      href={`/blog/${post.slug}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-card-hover hover:border-zinc-300 transition-all duration-300"
    >
      <div
        className="aspect-[16/10] relative overflow-hidden"
        style={{ backgroundColor: theme.bg }}
      >
        <BlogSVGPattern theme={theme} variant="card" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-heading text-5xl font-semibold select-none transition-all duration-300 group-hover:scale-110"
            style={{ color: theme.letterColor }}
          >
            {post.title.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted mb-2">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readingTime} min read
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading font-semibold text-primary group-hover:text-accent transition-colors duration-200">
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-secondary line-clamp-2">{post.excerpt}</p>
          </div>
          <ArrowUpRight size={16} className="mt-1 text-muted group-hover:text-accent flex-shrink-0 transition-colors duration-200" />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag variant="accent">{post.category}</Tag>
          {post.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {post.tags.length > 3 && (
            <Tag variant="outline">+{post.tags.length - 3}</Tag>
          )}
        </div>
      </div>
    </motion.a>
  );
}
