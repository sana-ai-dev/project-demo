"use client";

import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, FileText } from "lucide-react";
import { site } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      <div className="section-container w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-sm font-medium text-accent mb-4 tracking-wide uppercase"
          >
            {site.location}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-[1.08] tracking-tight"
          >
            {site.name}
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-secondary mt-3">
              {site.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="mt-6 text-lg md:text-xl text-secondary leading-relaxed max-w-2xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
            >
              View Work
              <ArrowDown size={16} />
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-secondary text-sm font-medium rounded-lg hover:border-zinc-300 hover:text-primary transition-all duration-200"
            >
              Get in Touch
              <ExternalLink size={16} />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm text-secondary hover:text-primary transition-colors duration-200"
            >
              <FileText size={16} />
              Resume
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/2 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
