/**
 * blog-theme.ts — Hash-based pastel colour + pattern engine for blog posts.
 *
 * Each blog post slug deterministically produces a unique muted pastel HSL colour
 * and a decorative SVG pattern selection. No manual config required.
 *
 * - Hue: 0-360 (full spectrum, from slug hash)
 * - Saturation: 25-35% (muted/pastel)
 * - Lightness: 88-95% (light/pastel)
 * - Patterns: 5 templates, bias based on category
 */

export type PatternType = "geometric" | "organic" | "dots" | "grid" | "rings";

export interface BlogTheme {
  /** Background HSL string, e.g. "hsl(215, 25%, 92%)" */
  bg: string;
  /** Semi-transparent colour for SVG pattern shapes, e.g. "hsla(215, 30%, 84%, 0.15)" */
  patternBg: string;
  /** Darker tint of the same hue for the initial letter, e.g. "hsl(215, 35%, 48%)" */
  letterColor: string;
  /** Which SVG pattern template to render */
  patternType: PatternType;
  /** The raw hue value (0-360) for debugging/overrides */
  hue: number;
}

/**
 * DJB2-style hash of a string, returns an unsigned 32-bit integer.
 * Fast, deterministic, decent distribution.
 */
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Maps a slug to a hue on the full 0-360 colour wheel.
 */
function slugToHue(slug: string): number {
  return djb2(slug) % 360;
}

/**
 * Selects a pattern type based on slug hash, biased by category.
 *
 * TECH posts skew → geometric, grid, dots
 * DESIGN posts skew → organic, rings
 */
function selectPattern(slug: string, category: string): PatternType {
  const patterns: PatternType[] = [
    "geometric",
    "organic",
    "dots",
    "grid",
    "rings",
  ];

  const hash = djb2(slug);
  let index: number;

  if (category.toUpperCase() === "DESIGN") {
    // Bias toward organic + rings (indices 1 and 4)
    const biased: PatternType[] = [
      "organic",   // 0
      "rings",     // 1
      "organic",   // 2
      "dots",      // 3
      "rings",     // 4
    ];
    index = hash % biased.length;
    return biased[index];
  }

  // Default (TECH or unknown): bias toward geometric + grid + dots (indices 0, 2, 3)
  const biased: PatternType[] = [
    "geometric",  // 0
    "grid",       // 1
    "geometric",  // 2
    "dots",       // 3
    "grid",       // 4
  ];
  index = hash % biased.length;
  return biased[index];
}

/**
 * Returns the full pastel theme for a given blog post.
 *
 * @param slug - The post slug (filename without .md)
 * @param category - The post category ("TECH" or "DESIGN")
 * @returns A BlogTheme object with HSL colours and pattern selection
 */
export function getBlogTheme(slug: string, category: string): BlogTheme {
  const hue = slugToHue(slug);

  // Clamp saturation: 25-35% for muted pastels
  const saturation = category.toUpperCase() === "DESIGN" ? 32 : 25;

  // Clamp lightness: 88-95% for light pastels (DESIGN slightly lighter)
  const lightness = category.toUpperCase() === "DESIGN" ? 93 : 90;

  // Background — very light pastel
  const bg = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Pattern shapes — slightly deeper hue, 15% opacity, so it's felt not noticed
  const patternSat = Math.min(saturation + 8, 40);
  const patternLight = Math.max(lightness - 10, 75);
  const patternBg = `hsla(${hue}, ${patternSat}%, ${patternLight}%, 0.15)`;

  // Letter — clearly visible but still muted, darker shade of same hue
  const letterSat = Math.min(saturation + 15, 45);
  const letterLight = Math.max(lightness - 42, 35);
  const letterColor = `hsl(${hue}, ${letterSat}%, ${letterLight}%)`;

  const patternType = selectPattern(slug, category);

  return { bg, patternBg, letterColor, patternType, hue };
}
