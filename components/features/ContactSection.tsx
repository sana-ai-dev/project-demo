"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/shared/Section";
import { site } from "@/lib/constants";
import { Mail, Github, Linkedin, Send, ArrowRight } from "lucide-react";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setSent(true);
        form.reset();
      }
    } catch {
      setSent(false);
    }
  }

  return (
    <Section id="contact" background="surface">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-accent tracking-wide uppercase">Contact</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-primary">
            Let&apos;s build something
          </h2>
          <p className="mt-3 text-secondary leading-relaxed max-w-lg mx-auto">
            Have a project in mind or just want to chat? Reach out and I&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="mt-8 flex justify-center items-center gap-6">
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
          >
            <Mail size={16} />
            {site.email}
          </a>
          <a
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-secondary hover:text-primary border border-border rounded-lg hover:border-zinc-300 transition-all duration-200"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-secondary hover:text-primary border border-border rounded-lg hover:border-zinc-300 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
          >
            View Resume <ArrowRight size={14} />
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 max-w-md mx-auto"
        >
          {sent ? (
            <div className="p-6 bg-white border border-border rounded-xl">
              <Send size={24} className="mx-auto text-accent mb-2" />
              <p className="text-primary font-medium">Message sent!</p>
              <p className="text-sm text-muted mt-1">I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200"
              >
                <Send size={16} />
                Send Message
              </button>
              <p className="text-xs text-muted text-center">
                No spam. Just a friendly conversation.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
