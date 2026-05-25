import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { BlogCard } from "@/components/features/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Project reports, technical deep-dives, and lessons learned from building AI-powered tools, dashboards, and automations.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-28 pb-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-accent tracking-wide uppercase">Blog</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
            Reports &amp; Reflections
          </h1>
          <p className="mt-3 text-lg text-secondary">
            Project reports, technical deep-dives, and lessons learned from building AI-powered tools,
            dashboards, and automations.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted font-heading text-xl">No posts yet — coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
