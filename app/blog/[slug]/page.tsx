import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Tag } from "@/components/shared/Tag";
import { getAllPosts, getPostBySlug, type BlogPost } from "@/lib/posts";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

function PostContent({ post }: { post: BlogPost }) {
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="pt-28 pb-20">
      <div className="section-container">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>

        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-accent tracking-wide uppercase">{post.category}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime} min read
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <hr className="my-10 border-border" />

          <div className="prose-blog">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
