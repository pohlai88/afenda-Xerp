/**
 * Static source-level governance tests for all component files in
 * packages/ui/src/components.
 *
 * These tests mirror the checks performed by check-design-system-consumption.ts
 * but surface each violation as an individually-named Vitest failure so CI logs
 * pinpoint the exact file and rule that was broken.
 *
 * Suites covered:
 *  1. Governed components — raw Tailwind prohibition
 *  2. Governed components — governance call discipline (govern-primitive checklist)
 *  3. All component + story files — import discipline
 *  4. All files — no duplicate design-authority registries
 *  5. Story files — no cva() / state?: string
 *  6. Story files — TIP-004 className policy on every static className="…" literal
 *
 * Rules reference: .cursor/skills/govern-primitive/SKILL.md
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  GOVERNED_COMPONENT_SOURCE_FILES,
} from "../../governance";

// ─── Paths ───────────────────────────────────────────────────────────────────

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const componentsDir = join(packageRoot, "src", "components");

// ─── File collectors ─────────────────────────────────────────────────────────

/**
 * Recursively collect .tsx/.ts source files under `dir`.
 * Skips `__tests__` subtrees (never test files themselves).
 */
function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__") continue;
      files.push(...collectSourceFiles(full));
    } else if (/\.[cm]?tsx?$/u.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const ALL_FILES = collectSourceFiles(componentsDir);

/** Component implementation files — exclude stories, storybook helpers, and test files. */
const COMPONENT_IMPL_FILES = ALL_FILES.filter(
  (f) =>
    !f.endsWith(".stories.tsx") &&
    !f.includes("_storybook") &&
    !f.endsWith(".test.tsx") &&
    !f.endsWith(".test.ts")
);

/** Story files only. */
const STORY_FILES = ALL_FILES.filter((f) => f.endsWith(".stories.tsx"));

function read(absPath: string): string {
  return readFileSync(absPath, "utf8");
}

function rel(absPath: string): string {
  return relative(packageRoot, absPath).replace(/\\/g, "/");
}

// ─── Pattern constants (sourced from check-design-system-consumption.ts) ─────

/** Raw color-scale palette utilities (e.g. `bg-red-500`, `text-blue-700`). */
const RAW_PALETTE_PATTERN =
  /\b(?:bg|text|border)-(?:red|blue|green|yellow|orange|purple|pink|emerald|lime|cyan|sky|indigo|violet|fuchsia|rose|amber|teal)-\d{2,3}\b/u;

/**
 * Semantic Tailwind utilities that are forbidden in governed component files.
 * Recipe implementation files (recipe.ts, recipe-maps.ts) are the ONLY
 * authoritative source of these classes.
 */
const PROHIBITED_SEMANTIC_PATTERN =
  /\b(?:bg|text|border|ring|shadow|rounded|opacity|animate|duration|ease)-/u;

/** Arbitrary radius / shadow / typography overrides. */
const PROHIBITED_ARBITRARY_PATTERN = /\b(?:rounded|shadow|text)-\[/u;

/** Local `cva()` call — forbidden in governed component files. */
const LOCAL_CVA_PATTERN = /\bcva\s*\(/u;

/** Ensures `resolvePrimitiveGovernance()` is present in governed components. */
const RESOLVE_GOVERNANCE_PATTERN = /resolvePrimitiveGovernance\s*\(/u;

/**
 * Detects the anti-pattern where governed.dataAttributes is spread BEFORE
 * {...props}, giving consumers the ability to override governed attributes.
 */
const GOVERNED_ATTRS_BEFORE_PROPS_PATTERN =
  /\{\.\.\.governed\.dataAttributes\}[\s\S]{0,200}\{\.\.\.props\}/u;

/** `state?: string` — must use `GovernedState` from GovernedXxxProps instead. */
const STATE_STRING_PROP_PATTERN = /state\?:\s*string\b/u;

/** Deep private-path imports into design-system internals. */
const DEEP_DESIGN_SYSTEM_IMPORT_PATTERN =
  /@afenda\/design-system\/(?:src|contracts|policies|recipes|tokens|variants)\//u;

/**
 * Direct `@afenda/design-system` import from component files.
 * Components must import through the `@afenda/ui/governance` adapter.
 */
const DIRECT_DESIGN_SYSTEM_IMPORT_PATTERN =
  /^\s*import\s+(?:type\s+)?[\w*{}\s,]+from\s+["']@afenda\/design-system["']/mu;

/**
 * Duplicate design-authority registry patterns — forbidden everywhere except
 * the design-system bridge.
 */
const DUPLICATE_AUTHORITY_PATTERNS: RegExp[] = [
  /const\s+STATUS_TONES\s*=/u,
  /const\s+GOVERNED_STATES\s*=/u,
  /const\s+VARIANT_INTENTS\s*=/u,
  /const\s+VARIANT_AXES\s*=/u,
  /const\s+TOKEN_CATEGORIES\s*=/u,
];

const DESIGN_SYSTEM_BRIDGE_REL = "src/governance/design-system.ts";

// ─── Build governed file set ──────────────────────────────────────────────────

const GOVERNED_FILE_RELS = new Set<string>(GOVERNED_COMPONENT_SOURCE_FILES);

/**
 * Absolute paths of governed component files that actually exist under
 * packages/ui/src/components.
 */
const GOVERNED_FILES = COMPONENT_IMPL_FILES.filter((f) =>
  GOVERNED_FILE_RELS.has(rel(f))
);

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Assert that every `resolvePrimitiveGovernance(` call in `source` includes
 * a `recipeName` argument. Returns the first offending call block or null.
 */
function findCallMissingRecipeName(source: string): string | null {
  const parts = source.split("resolvePrimitiveGovernance(");
  for (let i = 1; i < parts.length; i++) {
    // Capture content up to the first `});` that closes this call.
    const closingIdx = parts[i].indexOf("});");
    const callBody =
      closingIdx !== -1 ? parts[i].slice(0, closingIdx) : parts[i].slice(0, 400);
    if (!callBody.includes("recipeName")) {
      return callBody.trim().slice(0, 120);
    }
  }
  return null;
}

// ─── Test suites ─────────────────────────────────────────────────────────────

describe("govern-primitive: governed component raw Tailwind prohibition", () => {
  for (const absPath of GOVERNED_FILES) {
    const filePath = rel(absPath);

    it(`${filePath}: no raw color-scale palette classes (e.g. bg-red-500)`, () => {
      const match = RAW_PALETTE_PATTERN.exec(read(absPath));
      expect(
        match,
        `Found raw palette class "${match?.[0]}" — must live in recipe-maps.ts only`
      ).toBeNull();
    });

    it(`${filePath}: no raw semantic Tailwind utilities (bg-, text-, border-, rounded-, shadow-)`, () => {
      const match = PROHIBITED_SEMANTIC_PATTERN.exec(read(absPath));
      expect(
        match,
        `Found prohibited semantic utility "${match?.[0]}" — use resolvePrimitiveGovernance() instead`
      ).toBeNull();
    });

    it(`${filePath}: no arbitrary radius/shadow/typography utilities`, () => {
      const match = PROHIBITED_ARBITRARY_PATTERN.exec(read(absPath));
      expect(
        match,
        `Found arbitrary utility "${match?.[0]}" — arbitrary overrides are forbidden in primitives`
      ).toBeNull();
    });
  }
});

describe("govern-primitive: governed component call discipline", () => {
  for (const absPath of GOVERNED_FILES) {
    const filePath = rel(absPath);
    const source = read(absPath);

    it(`${filePath}: calls resolvePrimitiveGovernance()`, () => {
      expect(
        source,
        `Missing resolvePrimitiveGovernance() call — governed component must delegate all styling to governance`
      ).toMatch(RESOLVE_GOVERNANCE_PATTERN);
    });

    it(`${filePath}: no local cva()`, () => {
      const match = LOCAL_CVA_PATTERN.exec(source);
      expect(
        match,
        `Found local cva() — governed components must not define their own CVA instances`
      ).toBeNull();
    });

    it(`${filePath}: no state?: string (must use GovernedState from GovernedXxxProps)`, () => {
      const match = STATE_STRING_PROP_PATTERN.exec(source);
      expect(
        match,
        `Found "state?: string" — use GovernedState via GovernedXxxProps instead`
      ).toBeNull();
    });

    it(`${filePath}: governed.dataAttributes not spread before {...props}`, () => {
      const match = GOVERNED_ATTRS_BEFORE_PROPS_PATTERN.exec(source);
      expect(
        match,
        `Found {...governed.dataAttributes} before {...props} — consumer props would override governed attributes`
      ).toBeNull();
    });

    it(`${filePath}: every resolvePrimitiveGovernance() call includes recipeName`, () => {
      if (!RESOLVE_GOVERNANCE_PATTERN.test(source)) return; // already caught above
      const offendingBlock = findCallMissingRecipeName(source);
      expect(
        offendingBlock,
        `Found resolvePrimitiveGovernance() call without recipeName:\n  ${offendingBlock}\nAdd recipeName for traceability`
      ).toBeNull();
    });
  }
});

describe("govern-primitive: import discipline in all component files", () => {
  const allFiles = [...COMPONENT_IMPL_FILES, ...STORY_FILES];

  for (const absPath of allFiles) {
    const filePath = rel(absPath);
    if (filePath === DESIGN_SYSTEM_BRIDGE_REL) continue;

    const source = read(absPath);

    it(`${filePath}: no deep @afenda/design-system private-path import`, () => {
      const match = DEEP_DESIGN_SYSTEM_IMPORT_PATTERN.exec(source);
      expect(
        match,
        `Found deep design-system import: "${match?.[0]}" — import through @afenda/ui/governance adapter`
      ).toBeNull();
    });

    if (!filePath.endsWith(".stories.tsx")) {
      it(`${filePath}: no direct @afenda/design-system barrel import from component`, () => {
        const match = DIRECT_DESIGN_SYSTEM_IMPORT_PATTERN.exec(source);
        expect(
          match,
          `Found direct design-system import: "${match?.[0]}" — use @afenda/ui/governance adapter`
        ).toBeNull();
      });
    }
  }
});

describe("govern-primitive: no duplicate design-authority registries", () => {
  const allFiles = [...COMPONENT_IMPL_FILES, ...STORY_FILES];

  for (const absPath of allFiles) {
    const filePath = rel(absPath);
    if (filePath === DESIGN_SYSTEM_BRIDGE_REL) continue;

    const source = read(absPath);

    for (const pattern of DUPLICATE_AUTHORITY_PATTERNS) {
      it(`${filePath}: no duplicate authority registry (${pattern.toString()})`, () => {
        const match = pattern.exec(source);
        expect(
          match,
          `Found duplicate design-authority definition matching ${pattern} — this belongs in @afenda/design-system only`
        ).toBeNull();
      });
    }
  }
});

describe("govern-primitive: story-file safety (import + cva discipline)", () => {
  for (const absPath of STORY_FILES) {
    const filePath = rel(absPath);
    const source = read(absPath);

    it(`${filePath}: no local cva() in story file`, () => {
      const match = LOCAL_CVA_PATTERN.exec(source);
      expect(
        match,
        `Found cva() in story file — story composition must not define its own variant system`
      ).toBeNull();
    });

    it(`${filePath}: no state?: string in story file`, () => {
      const match = STATE_STRING_PROP_PATTERN.exec(source);
      expect(
        match,
        `Found "state?: string" in story file — any state prop must use GovernedState`
      ).toBeNull();
    });
  }
});

/**
 * Suite 6 — Story files: TIP-004 className policy on static string literals.
 *
 * Story files are held to a pragmatic subset of the full TIP-004 policy:
 *
 *   • Raw color-scale palette utilities (e.g. `bg-red-500`) — absolutely
 *     forbidden; these hard-code raw design tokens.
 *
 *   • Margin / padding spacing utilities (m-*, mt-*, mx-*, p-*, py-*, etc.)
 *     — forbidden; spacing between story elements must use StoryRow/StoryStack
 *     gap or padding props, NOT inline Tailwind shorthand.
 *
 *   • Arbitrary value utilities (e.g. `rounded-[13px]`, `w-[200px]`) — these
 *     represent one-off overrides that must live in a recipe instead.
 *
 * Typographic utilities (`text-xs`, `font-medium`, `text-muted-foreground`,
 * etc.) are explicitly permitted in story files — they are used for annotation
 * labels and composition comments that have no governed component equivalent
 * inside a Storybook canvas.
 *
 * Template-literal and expression classNames (`className={cn(...)}`) are
 * excluded — those are validated at render time by the component.
 */
describe("govern-primitive: story files TIP-004 className policy", () => {
  const STATIC_CLASSNAME_RE = /className="([^"]+)"/gu;

  /**
   * Spacing utilities — m-*, mt-*, mr-*, mb-*, ml-*, mx-*, my-*,
   * p-*, pt-*, pr-*, pb-*, pl-*, px-*, py-*, space-x-*, space-y-*.
   * Stories must use StoryRow/StoryStack gap props for spacing.
   */
  const STORY_SPACING_PATTERN =
    /\b(?:m[trblxy]?|p[trblxy]?|space-[xy])-(?:\d|auto|\[)/u;

  /**
   * Arbitrary value utilities — e.g. `rounded-[13px]`, `w-[200px]`, `text-[10px]`.
   * Matches `{word}-[{value}]` where value does NOT start with `:` (which would
   * indicate a CSS `has-[:checked]` pseudo-selector, not a Tailwind arbitrary value).
   */
  const STORY_ARBITRARY_PATTERN = /\w+-\[(?!:)[^\]]*\]/u;

  for (const absPath of STORY_FILES) {
    const filePath = rel(absPath);
    const source = read(absPath);

    it(`${filePath}: no raw palette classes in static className="…" literals`, () => {
      const violations: string[] = [];
      for (const [, classStr] of source.matchAll(STATIC_CLASSNAME_RE)) {
        const match = RAW_PALETTE_PATTERN.exec(classStr);
        if (match) {
          violations.push(`  className="${classStr}" → "${match[0]}" (raw-palette)`);
        }
      }
      expect(
        violations,
        `Raw palette classes found in story static classNames:\n${violations.join("\n")}`
      ).toHaveLength(0);
    });

    it(`${filePath}: no spacing utilities in static className="…" literals — use StoryRow/StoryStack gap props`, () => {
      const violations: string[] = [];
      for (const [, classStr] of source.matchAll(STATIC_CLASSNAME_RE)) {
        for (const token of classStr.split(/\s+/u)) {
          if (STORY_SPACING_PATTERN.test(token)) {
            violations.push(`  className="…${token}…" — replace with StoryRow gap or StoryStack gap prop`);
          }
        }
      }
      expect(
        violations,
        `Spacing utilities found in story static classNames:\n${violations.join("\n")}\nUse <StoryRow gap="sm"> or <StoryStack gap="md"> instead.`
      ).toHaveLength(0);
    });

    it(`${filePath}: no arbitrary value utilities in static className="…" literals`, () => {
      const violations: string[] = [];
      for (const [, classStr] of source.matchAll(STATIC_CLASSNAME_RE)) {
        for (const token of classStr.split(/\s+/u)) {
          if (STORY_ARBITRARY_PATTERN.test(token)) {
            violations.push(`  className="…${token}…" (arbitrary-value)`);
          }
        }
      }
      expect(
        violations,
        `Arbitrary value utilities found in story static classNames:\n${violations.join("\n")}\nMove one-off overrides into a governed recipe.`
      ).toHaveLength(0);
    });
  }
});
