/**
 * check-contrast.ts
 *
 * WCAG 2.x relative-luminance contrast checker for the Afenda token registry.
 *
 * Checks that governed color pairs meet WCAG 2.x contrast ratios:
 *   AA normal text  ≥ 4.5:1
 *   AA large text / non-text UI  ≥ 3.0:1
 *
 * Run: pnpm --filter @afenda/design-system check:contrast
 */

// ─── Color model helpers ──────────────────────────────────────────────────────

/**
 * Convert OKLCH L (0–1 perceptual lightness) to relative luminance Y.
 * Uses the CIELAB cube root approximation (accurate enough for governance checks).
 */
function oklchLToY(L: number): number {
  const lStar = L * 100;
  const f = (lStar + 16) / 116;
  return f ** 3;
}

/**
 * WCAG 2.x contrast ratio from two relative-luminance Y values.
 */
function wcagRatio(Y1: number, Y2: number): number {
  const L1 = Math.max(Y1, Y2) + 0.05;
  const L2 = Math.min(Y1, Y2) + 0.05;
  return L1 / L2;
}

/**
 * Convenience: compute WCAG ratio directly from two OKLCH L values.
 */
export function contrastFromOklchL(textL: number, bgL: number): number {
  return wcagRatio(oklchLToY(textL), oklchLToY(bgL));
}

// ─── Governed pairs ───────────────────────────────────────────────────────────

export interface ContrastPair {
  bgL: number;
  label: string;
  minRatio: number;
  mode: "light" | "dark";
  textL: number;
}

/** WCAG AA minimums: 4.5 for normal text, 3.0 for large text / non-text UI. */
export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;

/**
 * Governed token contrast pairs.
 * OKLCH L values sourced from token.registry.ts (approximate for reference tokens).
 */
export const GOVERNED_CONTRAST_PAIRS: readonly ContrastPair[] = [
  // ── Core text (light mode) ────────────────────────────────────────────────
  {
    label: "text.default / surface.canvas (light)",
    textL: 0.18,
    bgL: 0.986,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "text.muted / surface.canvas (light)",
    textL: 0.42,
    bgL: 0.986,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  // ── Brand buttons (light mode) ────────────────────────────────────────────
  {
    label: "primary.foreground / primary (light)",
    textL: 0.985,
    bgL: 0.47,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "secondary.foreground / secondary (light)",
    textL: 0.24,
    bgL: 0.945,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "destructive.foreground / destructive (light)",
    textL: 0.985,
    bgL: 0.46,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  // ── Status tones — foreground on surface (light mode) ────────────────────
  {
    label: "status.neutral.fg / surface (light)",
    textL: 0.38,
    bgL: 0.966,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.info.fg / surface (light)",
    textL: 0.38,
    bgL: 0.955,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.success.fg / surface (light)",
    textL: 0.32,
    bgL: 0.935,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.warning.fg / surface (light)",
    textL: 0.42,
    bgL: 0.93,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.danger.fg / surface (light)",
    textL: 0.36,
    bgL: 0.955,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.forbidden.fg / surface (light)",
    textL: 0.33,
    bgL: 0.954,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  {
    label: "status.invalid.fg / surface (light)",
    textL: 0.4,
    bgL: 0.945,
    minRatio: WCAG_AA_NORMAL,
    mode: "light",
  },
  // ── Core text (dark mode) ─────────────────────────────────────────────────
  {
    label: "text.default / surface.canvas (dark)",
    textL: 0.965,
    bgL: 0.15,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "text.muted / surface.canvas (dark)",
    textL: 0.78,
    bgL: 0.15,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  // ── Brand buttons (dark mode) ─────────────────────────────────────────────
  {
    label: "primary.foreground / primary (dark)",
    textL: 0.15,
    bgL: 0.72,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "destructive.foreground / destructive (dark)",
    textL: 0.965,
    bgL: 0.42,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  // ── Status tones — foreground on surface (dark mode) ─────────────────────
  {
    label: "status.neutral.fg / surface (dark)",
    textL: 0.83,
    bgL: 0.27,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.info.fg / surface (dark)",
    textL: 0.8,
    bgL: 0.23,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.success.fg / surface (dark)",
    textL: 0.8,
    bgL: 0.23,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.warning.fg / surface (dark)",
    textL: 0.85,
    bgL: 0.26,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.danger.fg / surface (dark)",
    textL: 0.82,
    bgL: 0.23,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.forbidden.fg / surface (dark)",
    textL: 0.82,
    bgL: 0.22,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  {
    label: "status.invalid.fg / surface (dark)",
    textL: 0.84,
    bgL: 0.24,
    minRatio: WCAG_AA_NORMAL,
    mode: "dark",
  },
  // ── Non-text: focus ring on surface (3:1 threshold) ──────────────────────
  {
    label: "focus.ring / surface.canvas (light)",
    textL: 0.54,
    bgL: 0.986,
    minRatio: WCAG_AA_LARGE,
    mode: "light",
  },
  {
    label: "focus.ring / surface.canvas (dark)",
    textL: 0.72,
    bgL: 0.15,
    minRatio: WCAG_AA_LARGE,
    mode: "dark",
  },
] as const;

// ─── Runner ───────────────────────────────────────────────────────────────────

export interface ContrastResult {
  label: string;
  minRatio: number;
  mode: "light" | "dark";
  passed: boolean;
  ratio: number;
}

export function runContrastChecks(
  pairs: readonly ContrastPair[] = GOVERNED_CONTRAST_PAIRS
): ContrastResult[] {
  return pairs.map((p) => {
    const ratio = contrastFromOklchL(p.textL, p.bgL);
    return {
      label: p.label,
      ratio: Math.round(ratio * 100) / 100,
      minRatio: p.minRatio,
      mode: p.mode,
      passed: ratio >= p.minRatio,
    };
  });
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (
  process.argv[1]?.endsWith("check-contrast.ts") ||
  process.argv[1]?.endsWith("check-contrast.js")
) {
  const results = runContrastChecks();
  const failures = results.filter((r) => !r.passed);
  const longest = Math.max(...results.map((r) => r.label.length));

  for (const r of results) {
    const icon = r.passed ? "✓" : "✗";
    const label = r.label.padEnd(longest);
    const ratio = r.ratio.toFixed(2).padStart(5);
    const threshold = `(need ≥ ${r.minRatio.toFixed(1)}:1)`;
    console.log(`${icon} ${label}  ${ratio}:1  ${threshold}`);
  }

  if (failures.length > 0) {
    console.error(`\n✗ ${failures.length} pair(s) fail WCAG AA contrast:\n`);
    for (const f of failures) {
      console.error(`  ${f.label}: ${f.ratio.toFixed(2)}:1 < ${f.minRatio}:1`);
    }
    process.exit(1);
  }

  console.log(
    `\n✓ All ${results.length} governed contrast pairs pass WCAG AA.`
  );
}
