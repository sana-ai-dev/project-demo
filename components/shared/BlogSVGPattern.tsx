"use client";

import type { BlogTheme, PatternType } from "@/lib/blog-theme";

interface BlogSVGPatternProps {
  theme: BlogTheme;
  variant: "card" | "hero";
  className?: string;
}

/**
 * Renders a subtle decorative SVG pattern based on the post's theme.
 * All shapes use the theme's patternBg colour (semi-transparent).
 * No new dependencies — pure inline SVG.
 */
export function BlogSVGPattern({
  theme,
  variant,
  className = "",
}: BlogSVGPatternProps) {
  const viewBox = variant === "hero" ? "0 0 800 300" : "0 0 400 300";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderPattern(theme.patternType, theme.patternBg, variant)}
      </svg>
    </div>
  );
}

function renderPattern(
  type: PatternType,
  color: string,
  variant: "card" | "hero"
): React.ReactNode {
  switch (type) {
    case "geometric":
      return GeometricPattern({ color, variant });
    case "organic":
      return OrganicPattern({ color, variant });
    case "dots":
      return DotsPattern({ color, variant });
    case "grid":
      return GridPattern({ color, variant });
    case "rings":
      return RingsPattern({ color, variant });
  }
}

/* ─── PATTERN 1: Geometric — intersecting lines, triangles, diamonds ─── */

function GeometricPattern({
  color,
  variant,
}: {
  color: string;
  variant: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.5">
        <path d="M100 50 L200 10 L300 50 L200 90 Z" />
        <path d="M500 200 L600 160 L700 200 L600 240 Z" />
        <line x1="50" y1="250" x2="180" y2="100" />
        <line x1="700" y1="50" x2="780" y2="220" />
        <polygon points="350,200 400,150 450,200 400,250" />
        <line x1="50" y1="50" x2="150" y2="150" />
        <line x1="650" y1="200" x2="750" y2="100" />
        <circle cx="400" cy="150" r="2" fill={color} />
        <circle cx="200" cy="240" r="2" fill={color} />
      </g>
    );
  }
  return (
    <g fill="none" stroke={color} strokeWidth="1.2">
      <path d="M80 40 L160 10 L240 40 L160 70 Z" />
      <path d="M280 220 L340 190 L400 220 L340 250 Z" />
      <line x1="40" y1="200" x2="140" y2="80" />
      <line x1="300" y1="50" x2="380" y2="150" />
      <polygon points="180,140 210,110 240,140 210,170" />
      <line x1="40" y1="40" x2="100" y2="100" />
      <circle cx="320" cy="200" r="1.5" fill={color} />
      <circle cx="140" cy="250" r="1.5" fill={color} />
    </g>
  );
}

/* ─── PATTERN 2: Organic — soft bezier blobs, flowing curves ─── */

function OrganicPattern({
  color,
  variant,
}: {
  color: string;
  variant: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.5">
        <path d="M80 200 C120 120 200 100 260 160 C320 220 400 180 440 120" />
        <path d="M500 80 C560 40 640 60 700 120 C760 180 780 140 800 100" />
        <path d="M60 80 C100 40 160 60 200 100 C240 140 200 180 160 160" />
        <path d="M600 200 C640 240 700 260 760 220" />
        <circle cx="350" cy="80" r="3" fill={color} />
        <circle cx="200" cy="240" r="2" fill={color} />
        <circle cx="650" cy="50" r="2.5" fill={color} />
        <circle cx="500" cy="220" r="1.5" fill={color} />
      </g>
    );
  }
  return (
    <g fill="none" stroke={color} strokeWidth="1.2">
      <path d="M40 160 C60 100 120 80 160 120 C200 160 260 140 300 100" />
      <path d="M100 50 C140 30 200 40 240 70 C280 100 260 130 220 120" />
      <path d="M280 220 C320 250 360 240 380 200" />
      <circle cx="180" cy="180" r="2" fill={color} />
      <circle cx="320" cy="80" r="1.5" fill={color} />
    </g>
  );
}

/* ─── PATTERN 3: Dots — scattered circles of varying sizes ─── */

function DotsPattern({
  color,
  variant,
}: {
  color: string;
  variant: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <g fill={color}>
        <circle cx="60" cy="50" r="4" />
        <circle cx="180" cy="30" r="2.5" />
        <circle cx="320" cy="70" r="5" />
        <circle cx="480" cy="40" r="3" />
        <circle cx="640" cy="60" r="4.5" />
        <circle cx="760" cy="30" r="2" />
        <circle cx="120" cy="160" r="3" />
        <circle cx="260" cy="200" r="2" />
        <circle cx="400" cy="180" r="4" />
        <circle cx="540" cy="220" r="2.5" />
        <circle cx="700" cy="170" r="3.5" />
        <circle cx="80" cy="260" r="2" />
        <circle cx="360" cy="260" r="3" />
        <circle cx="620" cy="270" r="2" />
        <circle cx="780" cy="250" r="4" />
        <circle cx="240" cy="120" r="1.5" />
        <circle cx="560" cy="130" r="2" />
      </g>
    );
  }
  return (
    <g fill={color}>
      <circle cx="50" cy="40" r="3" />
      <circle cx="160" cy="25" r="2" />
      <circle cx="280" cy="50" r="3.5" />
      <circle cx="360" cy="30" r="1.5" />
      <circle cx="100" cy="130" r="2" />
      <circle cx="220" cy="170" r="1.5" />
      <circle cx="340" cy="150" r="2.5" />
      <circle cx="60" cy="230" r="1.5" />
      <circle cx="200" cy="260" r="2" />
      <circle cx="350" cy="240" r="1.5" />
      <circle cx="140" cy="90" r="1.5" />
      <circle cx="300" cy="100" r="1" />
    </g>
  );
}

/* ─── PATTERN 4: Grid — aligned dots, crosses, small squares ─── */

function GridPattern({
  color,
  variant,
}: {
  color: string;
  variant: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.5">
        {/* Row 1 */}
        <rect x="60" y="40" width="8" height="8" rx="1" />
        <circle cx="200" cy="44" r="4" fill={color} />
        <line x1="320" y1="40" x2="320" y2="56" />
        <line x1="312" y1="48" x2="328" y2="48" />
        <rect x="460" y="40" width="8" height="8" rx="1" />
        <circle cx="600" cy="44" r="4" fill={color} />
        <line x1="720" y1="40" x2="720" y2="56" />
        <line x1="712" y1="48" x2="728" y2="48" />
        {/* Row 2 */}
        <circle cx="130" cy="150" r="4" fill={color} />
        <line x1="260" y1="146" x2="260" y2="162" />
        <line x1="252" y1="154" x2="268" y2="154" />
        <rect x="380" y="146" width="8" height="8" rx="1" />
        <circle cx="520" cy="150" r="4" fill={color} />
        <line x1="660" y1="146" x2="660" y2="162" />
        <line x1="652" y1="154" x2="668" y2="154" />
        {/* Row 3 */}
        <line x1="80" y1="260" x2="80" y2="276" />
        <line x1="72" y1="268" x2="88" y2="268" />
        <rect x="200" y="256" width="8" height="8" rx="1" />
        <circle cx="350" cy="260" r="4" fill={color} />
        <line x1="500" y1="256" x2="500" y2="272" />
        <line x1="492" y1="264" x2="508" y2="264" />
        <rect x="640" y="256" width="8" height="8" rx="1" />
        <circle cx="760" cy="260" r="4" fill={color} />
      </g>
    );
  }
  return (
    <g fill="none" stroke={color} strokeWidth="1.2">
      {/* Row 1 */}
      <rect x="40" y="30" width="6" height="6" rx="1" />
      <circle cx="120" cy="33" r="3" fill={color} />
      <line x1="200" y1="30" x2="200" y2="42" />
      <line x1="194" y1="36" x2="206" y2="36" />
      <rect x="280" y="30" width="6" height="6" rx="1" />
      <circle cx="360" cy="33" r="3" fill={color} />
      {/* Row 2 */}
      <circle cx="80" cy="150" r="3" fill={color} />
      <line x1="180" y1="146" x2="180" y2="158" />
      <line x1="174" y1="152" x2="186" y2="152" />
      <rect x="260" y="146" width="6" height="6" rx="1" />
      <circle cx="340" cy="150" r="3" fill={color} />
      {/* Row 3 */}
      <line x1="50" y1="260" x2="50" y2="272" />
      <line x1="44" y1="266" x2="56" y2="266" />
      <rect x="140" y="256" width="6" height="6" rx="1" />
      <circle cx="240" cy="260" r="3" fill={color} />
      <line x1="330" y1="256" x2="330" y2="268" />
      <line x1="324" y1="262" x2="336" y2="262" />
    </g>
  );
}

/* ─── PATTERN 5: Rings — concentric circles and arc segments ─── */

function RingsPattern({
  color,
  variant,
}: {
  color: string;
  variant: "card" | "hero";
}) {
  if (variant === "hero") {
    return (
      <g fill="none" stroke={color} strokeWidth="1.2">
        <circle cx="120" cy="100" r="40" />
        <circle cx="120" cy="100" r="25" />
        <circle cx="120" cy="100" r="10" />
        <circle cx="400" cy="150" r="55" />
        <circle cx="400" cy="150" r="35" />
        <circle cx="680" cy="100" r="45" />
        <circle cx="680" cy="100" r="28" />
        <circle cx="680" cy="100" r="12" />
        <circle cx="250" cy="240" r="25" />
        <circle cx="250" cy="240" r="12" />
        <circle cx="550" cy="230" r="30" />
        <circle cx="550" cy="230" r="15" />
        <circle cx="750" cy="220" r="20" />
        <circle cx="750" cy="220" r="8" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={color} strokeWidth="1">
      <circle cx="80" cy="80" r="30" />
      <circle cx="80" cy="80" r="18" />
      <circle cx="80" cy="80" r="6" />
      <circle cx="260" cy="150" r="40" />
      <circle cx="260" cy="150" r="25" />
      <circle cx="260" cy="150" r="10" />
      <circle cx="360" cy="80" r="20" />
      <circle cx="360" cy="80" r="10" />
      <circle cx="160" cy="240" r="18" />
      <circle cx="160" cy="240" r="8" />
      <circle cx="340" cy="250" r="15" />
      <circle cx="340" cy="250" r="6" />
    </g>
  );
}
