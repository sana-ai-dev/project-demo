"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Section } from "@/components/shared/Section";
import type { Project } from "@/lib/projects";

interface ProjectGridProps {
  projects: Project[];
}

const categories = ["All", "Web", "Dashboard", "AI & Tools", "Design"];

const categoryMap: Record<string, string[]> = {
  Web: ["Web", "3D", "Landing"],
  Dashboard: ["Dashboard"],
  "AI & Tools": ["AI", "Tool", "Automation"],
  Design: ["Design", "Product"],
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) =>
          categoryMap[active]?.some((c) => p.category.toLowerCase().includes(c.toLowerCase()))
        );

  return (
    <Section id="work" background="white">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent tracking-wide uppercase">Portfolio</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
          Selected Work
        </h2>
        <p className="mt-3 text-secondary leading-relaxed">
          Projects I have built — from 3D landing pages to AI-powered tools and full-stack dashboards.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            role="tab"
            aria-selected={active === cat}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              active === cat
                ? "bg-primary text-white"
                : "bg-surface text-secondary hover:text-primary hover:bg-zinc-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted">No projects in this category yet.</p>
      )}
    </Section>
  );
}
