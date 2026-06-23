"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/shared/Section";
import { Tag } from "@/components/shared/Tag";
import { skillCategories } from "@/lib/constants";

export function SkillsMatrix() {
  return (
    <Section id="skills" background="white">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent tracking-wide uppercase">Expertise</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
          Skills &amp; Technologies
        </h2>
        <p className="mt-3 text-secondary leading-relaxed">
          Tools and technologies I work with regularly across the full stack.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-surface border border-border rounded-xl p-5"
          >
            <h3 className="font-heading font-semibold text-sm text-primary mb-3">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
