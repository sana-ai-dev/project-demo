"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Tag } from "@/components/shared/Tag";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.a
      href={`/projects/${project.slug}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-card-hover hover:border-zinc-300 transition-all duration-300"
    >
      <div className="aspect-[16/10] bg-surface relative overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <span className="font-heading text-lg">{project.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/3 transition-colors duration-300" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading font-semibold text-primary group-hover:text-accent transition-colors duration-200">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-secondary line-clamp-2">{project.subtitle}</p>
          </div>
          <ArrowUpRight size={16} className="mt-1 text-muted group-hover:text-accent flex-shrink-0 transition-colors duration-200" />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {project.tags.length > 4 && (
            <Tag variant="outline">+{project.tags.length - 4}</Tag>
          )}
        </div>
      </div>
    </motion.a>
  );
}
