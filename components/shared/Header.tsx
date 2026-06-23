"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/constants";
import { Menu, X } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="section-container flex items-center justify-between h-16 md:h-18">
        <a
          href="/"
          className="font-heading text-lg font-semibold text-primary tracking-tight"
        >
          {site.handle}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-secondary hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
            >
              Get in touch
            </a>
          </li>
        </ul>

        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border animate-in slide-in-from-top-2">
          <ul className="section-container py-4 space-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-2 text-sm text-secondary hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                className="block py-2 text-sm font-medium text-accent"
                onClick={() => setMobileOpen(false)}
              >
                Get in touch
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
