/**
 * Consumer-layer className anti-slop policy.
 *
 * Mirrors packages/ui/src/meta-gates/class-name-guard.ts VISUAL_SLOP_PATTERNS
 * plus raw palette detection from .cursor/hooks/guard-pre-tool-use.mjs.
 *
 * Applied to plain HTML wrapper className strings in consumer packages
 * (appshell, erp, metadata-ui). Semantic shadcn bridge utilities
 * (bg-muted, text-foreground, rounded-lg) are allowed on wrappers.
 */

/** @typedef {{ token: string; reason: string }} ConsumerClassNameViolation */

/**
 * Enterprise anti-slop patterns — keep in sync with class-name-guard.ts.
 * @type {ReadonlyArray<{ pattern: RegExp; reason: string }>}
 */
export const CONSUMER_VISUAL_SLOP_CHECKS = [
  { pattern: /\bfrom-/u, reason: "gradient stop (from-*)" },
  { pattern: /\bto-/u, reason: "gradient stop (to-*)" },
  { pattern: /\bvia-/u, reason: "gradient stop (via-*)" },
  { pattern: /\bbackdrop-blur/u, reason: "glassmorphism (backdrop-blur)" },
  { pattern: /\bglass/u, reason: "glass effect" },
  { pattern: /\bbg-gradient/u, reason: "gradient background" },
  { pattern: /\bshadow-\[/u, reason: "arbitrary shadow" },
  { pattern: /\brounded-\[/u, reason: "arbitrary radius" },
  { pattern: /\btext-\[/u, reason: "arbitrary typography" },
  { pattern: /\bbg-\[/u, reason: "arbitrary background" },
  { pattern: /\bbg-#/u, reason: "hex background" },
  { pattern: /\btext-#/u, reason: "hex text color" },
  { pattern: /\bblur-\[/u, reason: "arbitrary blur" },
  { pattern: /\boutline-\[/u, reason: "arbitrary outline" },
  { pattern: /\bstroke-\[/u, reason: "arbitrary stroke" },
  { pattern: /\bdrop-shadow-\[/u, reason: "arbitrary drop-shadow" },
];

/**
 * Raw Tailwind palette scales — use semantic tokens instead.
 * @type {RegExp}
 */
export const RAW_PALETTE_RE =
  /\b(?:bg|text|border|ring|fill|stroke|decoration|from|via|to|shadow|outline|caret|accent)-(?:inherit|current|transparent|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/u;

/**
 * Arbitrary value utilities. Excludes CSS pseudo-class brackets like has-[:checked].
 * @type {RegExp}
 */
export const ARBITRARY_VALUE_RE = /\w+-\[(?!:)[^\]]*\]/u;

const CLASS_NAME_SEPARATOR = /\s+/u;

/**
 * @param {string} className
 * @returns {readonly string[]}
 */
export function tokenizeClassName(className) {
  return className.split(CLASS_NAME_SEPARATOR).filter(Boolean);
}

/**
 * @param {string} token
 * @returns {ConsumerClassNameViolation | undefined}
 */
export function detectConsumerClassNameViolation(token) {
  for (const { pattern, reason } of CONSUMER_VISUAL_SLOP_CHECKS) {
    if (pattern.test(token)) {
      return { token, reason };
    }
  }

  if (RAW_PALETTE_RE.test(token)) {
    return { token, reason: "raw palette scale (use semantic tokens)" };
  }

  if (ARBITRARY_VALUE_RE.test(token)) {
    return { token, reason: "arbitrary utility value" };
  }

  return;
}

/**
 * @param {string | undefined} className
 * @returns {ConsumerClassNameViolation[]}
 */
export function checkConsumerClassNameSlop(className) {
  if (!className) {
    return [];
  }

  const violations = [];
  const seen = new Set();

  for (const token of tokenizeClassName(className)) {
    const violation = detectConsumerClassNameViolation(token);
    if (violation !== undefined && !seen.has(violation.token)) {
      seen.add(violation.token);
      violations.push(violation);
    }
  }

  return violations;
}

const STATIC_CLASS_STRING_RE =
  /className=(?:"([^"]+)"|'([^']+)'|\{\s*["']([^"']+)["']\s*\})/gu;

/**
 * Extract static className string literals from TSX source.
 * @param {string} content
 * @returns {Array<{ value: string; index: number }>}
 */
export function extractStaticClassNames(content) {
  const results = [];
  let match;

  STATIC_CLASS_STRING_RE.lastIndex = 0;
  while ((match = STATIC_CLASS_STRING_RE.exec(content)) !== null) {
    const value = match[1] ?? match[2] ?? match[3];
    if (value) {
      results.push({ value, index: match.index });
    }
  }

  return results;
}

/**
 * @param {string} content
 * @param {string[]} lines
 * @returns {string[]}
 */
export function findConsumerWrapperClassNameSlop(content, lines) {
  const violations = [];

  for (const { value, index } of extractStaticClassNames(content)) {
    const slop = checkConsumerClassNameSlop(value);
    if (slop.length === 0) {
      continue;
    }

    const lineNumber = content.slice(0, index).split("\n").length;
    const detail = slop
      .map((entry) => `${entry.token} (${entry.reason})`)
      .join(", ");

    violations.push(
      `line ${lineNumber}: className contains prohibited visual slop — ${detail}`
    );
  }

  return violations;
}
