import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  content: string;
  readingTime: number;
}

const blogDirectory = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) return [];
  const filenames = fs.readdirSync(blogDirectory);
  const posts = filenames
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = path.join(blogDirectory, f);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      const words = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));
      return { ...data, slug: f.replace(/\.md$/, ""), content, readingTime } as BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    const filePath = path.join(blogDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const words = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { ...data, slug, content, readingTime } as BlogPost;
  } catch {
    return undefined;
  }
}
