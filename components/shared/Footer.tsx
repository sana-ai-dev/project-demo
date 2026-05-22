import { site } from "@/lib/constants";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-container py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <a
              href="/"
              className="font-heading text-lg font-semibold text-primary tracking-tight"
            >
              {site.handle}
              <span className="text-accent">.</span>
            </a>
            <p className="mt-1 text-sm text-muted">{site.location}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted hover:text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted hover:text-primary transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={`mailto:${site.email}`}
              className="p-2 text-muted hover:text-primary transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} {site.name}. Built with Next.js &amp; deployed on Cloudflare.
        </div>
      </div>
    </footer>
  );
}
