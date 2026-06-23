import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Tag } from "@/components/shared/Tag";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-28 pb-20">
      <div className="section-container">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="aspect-[16/9] bg-surface rounded-xl overflow-hidden mb-10">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <span className="font-heading text-4xl">{project.title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <p className="text-sm font-medium text-accent tracking-wide uppercase">{project.category}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
            {project.title}
          </h1>
          <p className="mt-3 text-lg text-secondary">{project.subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-secondary">
            <div>
              <span className="text-muted">Role:</span> {project.role}
            </div>
            <div>
              <span className="text-muted">Timeline:</span> {project.timeline}
            </div>
            <div>
              <span className="text-muted">Status:</span> {project.status}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {(project.links.demo || project.links.github) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-secondary text-sm font-medium rounded-lg hover:border-zinc-300 hover:text-primary transition-all duration-200"
                >
                  <Github size={16} />
                  View Source
                </a>
              )}
            </div>
          )}

          <hr className="my-10 border-border" />

          {project.challenge && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-3">Challenge</h2>
              <p className="text-secondary leading-relaxed whitespace-pre-line">{project.challenge}</p>
            </section>
          )}

          {project.approach && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-3">Approach</h2>
              <p className="text-secondary leading-relaxed whitespace-pre-line">{project.approach}</p>
            </section>
          )}

          {project.keyCode && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-3">Key Code</h2>
              <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-5 overflow-x-auto text-sm leading-relaxed">
                <code>{project.keyCode}</code>
              </pre>
            </section>
          )}

          {project.results && project.results.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-3">Results</h2>
              <ul className="space-y-2">
                {project.results.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-secondary">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.learnings && project.learnings.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-3">Key Learnings</h2>
              <ul className="space-y-2">
                {project.learnings.map((l, i) => (
                  <li key={i} className="flex items-start gap-3 text-secondary">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.screenshots && project.screenshots.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-heading font-semibold text-primary mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="rounded-xl border border-border w-full"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
