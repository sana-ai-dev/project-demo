"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/shared/Section";
import { site } from "@/lib/constants";

export function AboutSection() {
  return (
    <Section id="about" background="surface">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <div className="aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden">
            <img
              src="/images/profile.jpg"
              alt={site.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-3"
        >
          <p className="text-sm font-medium text-accent tracking-wide uppercase">About</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
            Building things that matter
          </h2>

          <div className="mt-6 space-y-4 text-secondary leading-relaxed">
            <p>
              I am a full-stack developer and UI/UX architect based in Birmingham, UK, with a passion
              for creating tools, dashboards, and applications that solve real problems. My work spans
              from 3D interactive experiences to AI-powered lead generation systems and everything in
              between.
            </p>
            <p>
              What drives me is the intersection of clean architecture and polished design. I believe
              great software is both <strong className="text-primary">well-engineered</strong> and{" "}
              <strong className="text-primary">a pleasure to use</strong>. Every project I ship
              reflects that philosophy.
            </p>
            <p>
              I specialise in the modern React ecosystem (Next.js, TypeScript, Tailwind CSS),
              AI agent architectures, automation workflows with n8n, and designing digital products
              that generate real business outcomes.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Next.js", value: "5+ projects" },
              { label: "React / TypeScript", value: "Primary stack" },
              { label: "AI & Automation", value: "n8n + LLMs" },
              { label: "UI/UX Design", value: "Design systems" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-3 bg-white border border-border rounded-lg text-center min-w-[130px]"
              >
                <div className="text-sm font-semibold text-primary">{stat.value}</div>
                <div className="text-xs text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
