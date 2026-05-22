import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  role: string;
  timeline: string;
  status: string;
  tags: string[];
  links: {
    demo?: string;
    github?: string;
  };
  featured: boolean;
  order: number;
  challenge: string;
  approach: string;
  results: string[];
  keyCode?: string;
  keyCodeLanguage?: string;
  thumbnail: string;
  screenshots: string[];
  learnings?: string[];
}

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): Project[] {
  const filenames = fs.readdirSync(projectsDirectory);
  const projects = filenames
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => {
      const filePath = path.join(projectsDirectory, f);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = yaml.load(fileContent) as Record<string, unknown>;
      return {
        ...data,
        slug: f.replace(/\.yaml$/, ""),
      } as Project;
    })
    .sort((a, b) => a.order - b.order);
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  try {
    const filePath = path.join(projectsDirectory, `${slug}.yaml`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContent) as Record<string, unknown>;
    return { ...data, slug } as Project;
  } catch {
    return undefined;
  }
}
