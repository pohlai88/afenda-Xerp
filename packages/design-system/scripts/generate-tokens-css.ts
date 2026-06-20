import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AFENDA_TOKEN_REGISTRY } from "../src/registries/token.registry.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, "..");

const allTokens = AFENDA_TOKEN_REGISTRY.tokens;

const lightLines = allTokens.map(
  (token) => `  ${token.cssVariable}: ${token.value};`
);

const darkTokens = allTokens.filter((t) => t.darkValue !== undefined);
const darkLines = darkTokens.map(
  (token) => `  ${token.cssVariable}: ${token.darkValue};`
);

const darkBlock =
  darkTokens.length > 0
    ? `\n.dark {\n${darkLines.join("\n")}\n}\n`
    : "";

function buildTokenBlocks(): string {
  return `:root {
${lightLines.join("\n")}
}
${darkBlock}`;
}

function buildTokensCss(): string {
  return `/**
 * @generated — do not edit manually.
 * Source: packages/design-system/src/registries/token.registry.ts
 * Regenerate: pnpm --filter @afenda/design-system build
 *
 * All custom properties use the --afenda-* prefix (TIP-004A).
 * Safe to consume in any CSS context without namespace collisions.
 *
 * Usage in apps/erp or packages/ui afenda-style.css:
 *   @import "@afenda/design-system/css/afenda-tokens.css";
 */
${buildTokenBlocks()}`;
}

function buildThemePartsCss(): string {
  return `/* ── Part A: Afenda design tokens ─────────────────────────────────────────── */
${buildTokenBlocks()}
/* ── Part B: Dark mode variant + shadcn bridge vars ──────────────────────── */
/* @custom-variant processes only when Tailwind v4 is active in the pipeline. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;

  /* Shape — single base drives the whole radius scale */
  --radius: var(--afenda-radius-base);

  /* Font stacks */
  --font-sans: var(--afenda-font-sans);
  --font-mono: var(--afenda-font-mono);
  --font-heading: var(--afenda-font-heading);
  --font-body: var(--afenda-font-body);

  /* Surfaces */
  --background: var(--afenda-color-surface-canvas);
  --foreground: var(--afenda-color-text-default);
  --card: var(--afenda-color-surface-card);
  --card-foreground: var(--afenda-color-text-default);
  --popover: var(--afenda-color-surface-popover);
  --popover-foreground: var(--afenda-color-text-default);

  /* Brand */
  --primary: var(--afenda-color-primary);
  --primary-foreground: var(--afenda-color-primary-foreground);
  --secondary: var(--afenda-color-secondary);
  --secondary-foreground: var(--afenda-color-secondary-foreground);
  --muted: var(--afenda-color-surface-muted);
  --muted-foreground: var(--afenda-color-text-muted);
  --accent: var(--afenda-color-accent);
  --accent-foreground: var(--afenda-color-accent-foreground);

  /* Risk */
  --destructive: var(--afenda-color-destructive);
  --destructive-foreground: var(--afenda-color-destructive-foreground);

  /* Chrome */
  --border: var(--afenda-color-border-default);
  --input: var(--afenda-color-input);
  --ring: var(--afenda-color-focus-ring);

  /* Charts */
  --chart-1: var(--afenda-color-chart-1);
  --chart-2: var(--afenda-color-chart-2);
  --chart-3: var(--afenda-color-chart-3);
  --chart-4: var(--afenda-color-chart-4);
  --chart-5: var(--afenda-color-chart-5);

  /* Sidebar */
  --sidebar: var(--afenda-color-sidebar-background);
  --sidebar-foreground: var(--afenda-color-sidebar-foreground);
  --sidebar-primary: var(--afenda-color-sidebar-primary);
  --sidebar-primary-foreground: var(--afenda-color-sidebar-primary-foreground);
  --sidebar-accent: var(--afenda-color-sidebar-accent);
  --sidebar-accent-foreground: var(--afenda-color-sidebar-accent-foreground);
  --sidebar-border: var(--afenda-color-sidebar-border);
  --sidebar-ring: var(--afenda-color-sidebar-ring);
}

/* Dark-mode color-scheme only — token overrides already emitted in Part A .dark {} */
.dark { color-scheme: dark; }

/* ── Part C: @theme inline (Tailwind utility mappings) ───────────────────── */
@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Radius — single base drives the whole scale */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

  /* Shadows — map to Tailwind shadow-* utilities */
  --shadow-2xs: var(--afenda-shadow-2xs);
  --shadow-xs: var(--afenda-shadow-xs);
  --shadow-sm: var(--afenda-shadow-sm);
  --shadow: var(--afenda-shadow-base);
  --shadow-md: var(--afenda-shadow-md);
  --shadow-lg: var(--afenda-shadow-lg);
  --shadow-xl: var(--afenda-shadow-xl);
  --shadow-2xl: var(--afenda-shadow-2xl);

  /* Fonts */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}

/* ── Part D: Base styles ─────────────────────────────────────────────────── */
/* NO @apply — all declarations use direct CSS properties + var() references. */
/* shadcn/tailwind.css owns the * / body reset; we own the heading scale and  */
/* app-shell-level rules that shadcn does not provide.                         */
@layer base {
  html {
    font-family: var(--font-sans);
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-body);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-heading);
    text-wrap: balance;
  }

  h1 {
    font-size: 2.25rem;
    line-height: 1.15;
    letter-spacing: -0.03em;
    font-weight: 700;
  }

  h2 {
    font-size: 1.875rem;
    line-height: 1.2;
    letter-spacing: -0.025em;
    font-weight: 650;
  }

  h3 {
    font-size: 1.5rem;
    line-height: 1.25;
    letter-spacing: -0.02em;
    font-weight: 600;
  }

  h4 {
    font-size: 1.25rem;
    line-height: 1.35;
    letter-spacing: -0.015em;
    font-weight: 600;
  }

  h5 {
    font-size: 1.125rem;
    line-height: 1.45;
    font-weight: 550;
  }

  h6 {
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 550;
  }

  code,
  pre,
  kbd,
  samp {
    font-family: var(--font-mono);
  }

  ::selection {
    background-color: color-mix(in oklch, var(--primary) 22%, transparent);
    color: var(--foreground);
  }

  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
`;
}

function buildGlobalsCss(): string {
  return `/**
 * @generated — do not edit manually.
 * Source: packages/design-system/src/registries/token.registry.ts
 * Regenerate: pnpm --filter @afenda/design-system build
 *
 * Tailwind v4 four-step architecture:
 *   Part A  Design tokens  (--afenda-* custom properties)
 *   Part B  Bridge layer   (@custom-variant dark + shadcn :root vars)
 *   Part C  Utility map    (@theme inline → Tailwind bg-*/text-*/shadow-*/rounded-*)
 *   Part D  Base styles    (@layer base — NO @apply, direct var() refs only)
 *
 * Usage: @import "@afenda/design-system/css/globals.css";
 */

${buildThemePartsCss()}`;
}

function buildAfendaStyleCss(): string {
  return `/**
 * @generated — do not edit manually.
 * Source: packages/design-system/src/registries/token.registry.ts
 * Regenerate: pnpm --filter @afenda/design-system build
 *
 * Theme layer only (Parts A–D). Do NOT @import "tailwindcss" here — that belongs
 * once at the app entry to avoid duplicate Tailwind processing.
 *
 * App wiring (Tailwind v4 import order):
 *   @import "tailwindcss";
 *   @import "@afenda/ui/afenda-style.css";
 *   @import "shadcn/tailwind.css";
 */
${buildThemePartsCss()}
@source "../**/*.{ts,tsx}";
`;
}

const count = allTokens.length;
const darkCount = darkTokens.length;

const tokensCss = buildTokensCss();
const globalsCss = buildGlobalsCss();
const afendaStyleCss = buildAfendaStyleCss();

// 1. tokens.css — raw --afenda-* vars only
const distTokensPath = join(packageRoot, "dist/css/tokens.css");
mkdirSync(dirname(distTokensPath), { recursive: true });
writeFileSync(distTokensPath, tokensCss, "utf8");

const srcTokensPath = join(packageRoot, "src/css/afenda-tokens.css");
mkdirSync(dirname(srcTokensPath), { recursive: true });
writeFileSync(srcTokensPath, tokensCss, "utf8");

// 2. globals.css — complete Tailwind v4 theme (Parts A–D, no tailwind import)
const distGlobalsPath = join(packageRoot, "dist/css/globals.css");
mkdirSync(dirname(distGlobalsPath), { recursive: true });
writeFileSync(distGlobalsPath, globalsCss, "utf8");

const srcGlobalsPath = join(packageRoot, "src/css/afenda-globals.css");
mkdirSync(dirname(srcGlobalsPath), { recursive: true });
writeFileSync(srcGlobalsPath, globalsCss, "utf8");

// 3. afenda-style.css — UI package consumption entry (tailwind + theme + shadcn)
const uiStylePath = join(packageRoot, "../ui/src/styles/afenda-style.css");
mkdirSync(dirname(uiStylePath), { recursive: true });
writeFileSync(uiStylePath, afendaStyleCss, "utf8");

// biome-ignore lint/suspicious/noConsole: build script output
console.log(`✓ Generated dist/css/tokens.css        (${count} tokens, ${darkCount} with dark overrides)`);
// biome-ignore lint/suspicious/noConsole: build script output
console.log(`✓ Generated src/css/afenda-tokens.css   (${count} tokens, ${darkCount} with dark overrides)`);
// biome-ignore lint/suspicious/noConsole: build script output
console.log(`✓ Generated dist/css/globals.css        (${count} tokens, ${darkCount} with dark overrides)`);
// biome-ignore lint/suspicious/noConsole: build script output
console.log(`✓ Generated src/css/afenda-globals.css   (${count} tokens, ${darkCount} with dark overrides)`);
// biome-ignore lint/suspicious/noConsole: build script output
console.log(`✓ Generated packages/ui/src/styles/afenda-style.css (${count} tokens, ${darkCount} with dark overrides)`);
