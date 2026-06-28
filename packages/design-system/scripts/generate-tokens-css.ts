import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TokenDefinition } from "../src/contracts/token.contract.js";
import { AFENDA_TOKEN_REGISTRY } from "../src/registries/token.registry.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, "..");

const allTokens = AFENDA_TOKEN_REGISTRY.tokens;
const darkTokens = allTokens.filter((t) => t.darkValue !== undefined);

/** Derive a Tailwind @theme suffix from an Afenda token name segment. */
function tokenSuffix(name: string, prefix: string): string {
  return name.slice(prefix.length).replaceAll(".", "-");
}

/** Emit @theme spacing utilities from governed spacing tokens (registry-driven). */
function buildSpacingThemeBlock(): string {
  return allTokens
    .filter((token) => token.category === "spacing")
    .map((token) => {
      const suffix = tokenSuffix(token.name, "afenda.spacing.");
      return `  --spacing-${suffix}: var(${token.cssVariable});`;
    })
    .join("\n");
}

/** Emit @theme text-* utilities from governed typography font-size tokens. */
function buildFontSizeThemeBlock(): string {
  return allTokens
    .filter(
      (token) =>
        token.category === "typography" &&
        token.name.startsWith("afenda.typography.font-size.")
    )
    .map((token) => {
      const suffix = tokenSuffix(token.name, "afenda.typography.font-size.");
      return `  --text-${suffix}: var(${token.cssVariable});`;
    })
    .join("\n");
}

/** Emit @theme leading-* utilities from governed typography line-height tokens. */
function buildLineHeightThemeBlock(): string {
  return allTokens
    .filter(
      (token) =>
        token.category === "typography" &&
        token.name.startsWith("afenda.typography.line-height.")
    )
    .map((token) => {
      const suffix = tokenSuffix(token.name, "afenda.typography.line-height.");
      return `  --leading-${suffix}: var(${token.cssVariable});`;
    })
    .join("\n");
}

/** Emit @theme font-weight utilities from governed typography weight tokens. */
function buildFontWeightThemeBlock(): string {
  return allTokens
    .filter(
      (token) =>
        token.category === "typography" &&
        token.name.startsWith("afenda.typography.font-weight.")
    )
    .map((token) => {
      const suffix = tokenSuffix(token.name, "afenda.typography.font-weight.");
      return `  --font-weight-${suffix}: var(${token.cssVariable});`;
    })
    .join("\n");
}

/** Semantic color utilities — stable Tailwind consumption layer above RAW. */
function buildSemanticColorThemeBlock(): string {
  const semanticColors = [
    ["surface-canvas", "--afenda-semantic-surface-canvas"],
    ["surface-card", "--afenda-semantic-surface-card"],
    ["surface-raised", "--afenda-semantic-surface-raised"],
    ["surface-muted", "--afenda-semantic-surface-muted"],
    ["surface-overlay", "--afenda-semantic-surface-overlay"],
    ["text-primary", "--afenda-semantic-text-primary"],
    ["text-secondary", "--afenda-semantic-text-secondary"],
    ["text-tertiary", "--afenda-semantic-text-tertiary"],
    ["border-default", "--afenda-semantic-border-default"],
    ["border-subtle", "--afenda-semantic-border-subtle"],
    ["border-strong", "--afenda-semantic-border-strong"],
    ["border-focus", "--afenda-semantic-border-focus"],
  ] as const;

  return semanticColors
    .map(([name, cssVar]) => `  --color-${name}: var(${cssVar});`)
    .join("\n");
}

/**
 * Emits grouped CSS custom-property lines, inserting a `/* ── <group> ── *​/`
 * comment banner each time the registry section `group` changes. This is how
 * the generated CSS reconstructs the authored section structure from metadata.
 */
function emitGroupedVars(
  list: readonly TokenDefinition[],
  pick: (token: TokenDefinition) => string | undefined
): string {
  let out = "";
  let currentGroup: string | undefined;
  for (const token of list) {
    const value = pick(token);
    if (value === undefined) {
      continue;
    }
    if (token.group !== undefined && token.group !== currentGroup) {
      currentGroup = token.group;
      out += `\n  /* ── ${token.group} ── */\n`;
    }
    out += `  ${token.cssVariable}: ${value};\n`;
  }
  return out;
}

function buildTokenBlocks(): string {
  const lightBody = emitGroupedVars(allTokens, (token) => token.value);
  const darkBody = emitGroupedVars(allTokens, (token) => token.darkValue);
  const darkBlock =
    darkBody.trim().length > 0
      ? `\n.dark {\n  color-scheme: dark;\n${darkBody}}\n`
      : "";
  return `:root {\n${lightBody}}\n${darkBlock}`;
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
 * Usage (token-only surfaces):
 *   @import "@afenda/design-system/css/afenda-tokens.css";
 */
${buildTokenBlocks()}`;
}

/** Parts B–F only — synced to @afenda/css-authority (PAS-005 B30). Requires Part A tokens first. */
function buildRuntimeBridgePartsCss(): string {
  return `/* ── Part B: Dark mode variant + shadcn bridge vars ──────────────────────── */
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

  /* Surfaces — semantic layer (stable bridge; RAW switches in Part A .dark) */
  --background: var(--afenda-semantic-surface-canvas);
  --foreground: var(--afenda-semantic-text-primary);
  --card: var(--afenda-semantic-surface-card);
  --card-foreground: var(--afenda-semantic-text-primary);
  --popover: var(--afenda-semantic-surface-overlay);
  --popover-foreground: var(--afenda-semantic-text-primary);

  /* Brand — accent semantic roles for primary actions */
  --primary: var(--afenda-semantic-accent-bg);
  --primary-foreground: var(--afenda-semantic-accent-text);
  --secondary: var(--afenda-color-secondary);
  --secondary-foreground: var(--afenda-color-secondary-foreground);
  --muted: var(--afenda-semantic-surface-muted);
  --muted-foreground: var(--afenda-semantic-text-secondary);
  --accent: var(--afenda-color-accent);
  --accent-foreground: var(--afenda-color-accent-foreground);

  /* Risk */
  --destructive: var(--afenda-color-destructive);
  --destructive-foreground: var(--afenda-color-destructive-foreground);

  /* Feedback — governed semantic fills (mirrors destructive pattern) */
  --success: var(--afenda-status-tone-success-solid);
  --success-foreground: var(--afenda-status-tone-success-solid-foreground);
  --warning: var(--afenda-status-tone-warning-solid);
  --warning-foreground: var(--afenda-status-tone-warning-solid-foreground);
  --info: var(--afenda-status-tone-info-solid);
  --info-foreground: var(--afenda-status-tone-info-solid-foreground);

  /* Chrome — semantic border roles */
  --border: var(--afenda-semantic-border-default);
  --input: var(--afenda-color-input);
  --ring: var(--afenda-semantic-border-focus);

  /* Charts (shadcn supports chart-1..5 by default; 6..8 extend it) */
  --chart-1: var(--afenda-color-chart-1);
  --chart-2: var(--afenda-color-chart-2);
  --chart-3: var(--afenda-color-chart-3);
  --chart-4: var(--afenda-color-chart-4);
  --chart-5: var(--afenda-color-chart-5);
  --chart-6: var(--afenda-color-chart-6);
  --chart-7: var(--afenda-color-chart-7);
  --chart-8: var(--afenda-color-chart-8);

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

/* Dark-mode token + color-scheme overrides already emitted in Part A .dark {} */

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
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-chart-6: var(--chart-6);
  --color-chart-7: var(--chart-7);
  --color-chart-8: var(--chart-8);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Semantic surface / text / border — direct Tailwind utilities (bg-surface-canvas, etc.) */
${buildSemanticColorThemeBlock()}

  /* Spacing — registry-driven scale (p-*, gap-*, m-*) */
${buildSpacingThemeBlock()}

  /* Typography — registry-driven scale (text-*, leading-*, font-weight-*) */
${buildFontSizeThemeBlock()}

${buildLineHeightThemeBlock()}

${buildFontWeightThemeBlock()}

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
  --shadow-focus: var(--afenda-shadow-focus);

  /* Z-index — maps --afenda-z-index-* to Tailwind z-* utilities */
  --z-index-hide: var(--afenda-z-index-hide);
  --z-index-base: var(--afenda-z-index-base);
  --z-index-raised: var(--afenda-z-index-raised);
  --z-index-docked: var(--afenda-z-index-docked);
  --z-index-sticky: var(--afenda-z-index-sticky);
  --z-index-banner: var(--afenda-z-index-banner);
  --z-index-dropdown: var(--afenda-z-index-dropdown);
  --z-index-overlay: var(--afenda-z-index-overlay);
  --z-index-modal: var(--afenda-z-index-modal);
  --z-index-popover: var(--afenda-z-index-popover);
  --z-index-toast: var(--afenda-z-index-toast);
  --z-index-tooltip: var(--afenda-z-index-tooltip);
  --z-index-command: var(--afenda-z-index-command);

  /* Motion — duration utilities */
  --duration-instant: var(--afenda-motion-duration-instant);
  --duration-fast: var(--afenda-motion-duration-fast);
  --duration-normal: var(--afenda-motion-duration-normal);
  --duration-slow: var(--afenda-motion-duration-slow);
  --duration-slower: var(--afenda-motion-duration-slower);

  /* Motion — easing utilities */
  --ease-standard: var(--afenda-motion-easing-standard);
  --ease-emphasized: var(--afenda-motion-easing-emphasized);
  --ease-decelerate: var(--afenda-motion-easing-decelerate);
  --ease-accelerate: var(--afenda-motion-easing-accelerate);

  /* Fonts — bridge to Part A stacks (never self-referential) */
  --font-sans: var(--afenda-font-sans);
  --font-mono: var(--afenda-font-mono);
  --font-heading: var(--afenda-font-heading);
  --font-body: var(--afenda-font-body);
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
    font-size: var(--afenda-typography-font-size-body-md);
    line-height: var(--afenda-typography-line-height-body-md);
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
    font-size: var(--afenda-typography-font-size-display-sm);
    line-height: var(--afenda-typography-line-height-display-sm);
    letter-spacing: var(--afenda-typography-letter-spacing-tighter);
    font-weight: var(--afenda-typography-font-weight-display-sm);
  }

  h2 {
    font-size: var(--afenda-typography-font-size-heading-xl);
    line-height: var(--afenda-typography-line-height-heading-xl);
    letter-spacing: var(--afenda-typography-letter-spacing-tight);
    font-weight: var(--afenda-typography-font-weight-heading-xl);
  }

  h3 {
    font-size: var(--afenda-typography-font-size-heading-lg);
    line-height: var(--afenda-typography-line-height-heading-lg);
    letter-spacing: var(--afenda-typography-letter-spacing-tight);
    font-weight: var(--afenda-typography-font-weight-heading-lg);
  }

  h4 {
    font-size: var(--afenda-typography-font-size-heading-md);
    line-height: var(--afenda-typography-line-height-heading-md);
    letter-spacing: var(--afenda-typography-letter-spacing-normal);
    font-weight: var(--afenda-typography-font-weight-heading-md);
  }

  h5 {
    font-size: var(--afenda-typography-font-size-body-lg);
    line-height: var(--afenda-typography-line-height-body-lg);
    font-weight: var(--afenda-typography-font-weight-heading-sm);
  }

  h6 {
    font-size: var(--afenda-typography-font-size-heading-sm);
    line-height: var(--afenda-typography-line-height-heading-sm);
    font-weight: var(--afenda-typography-font-weight-heading-sm);
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

/* ── Part E: Custom utilities ────────────────────────────────────────────── */
@utility tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* ── Part F: Density attribute hooks ─────────────────────────────────────── */
[data-afenda-density="compact"] {
  --afenda-density-control-height: var(--afenda-density-compact-control-height);
  --afenda-density-gap: var(--afenda-density-compact-gap);
  --afenda-density-section-gap: var(--afenda-density-compact-section-gap);
  --afenda-density-table-row-height: var(--afenda-density-compact-table-row-height);
  --afenda-density-toolbar-gap: var(--afenda-density-compact-toolbar-gap);
  --afenda-density-field-gap: var(--afenda-density-compact-field-gap);
}

[data-afenda-density="default"] {
  --afenda-density-control-height: var(--afenda-density-default-control-height);
  --afenda-density-gap: var(--afenda-density-default-gap);
  --afenda-density-section-gap: var(--afenda-density-default-section-gap);
  --afenda-density-table-row-height: var(--afenda-density-default-table-row-height);
  --afenda-density-toolbar-gap: var(--afenda-density-default-toolbar-gap);
  --afenda-density-field-gap: var(--afenda-density-default-field-gap);
}

[data-afenda-density="comfortable"] {
  --afenda-density-control-height: var(--afenda-density-comfortable-control-height);
  --afenda-density-gap: var(--afenda-density-comfortable-gap);
  --afenda-density-section-gap: var(--afenda-density-comfortable-section-gap);
  --afenda-density-table-row-height: var(--afenda-density-comfortable-table-row-height);
  --afenda-density-toolbar-gap: var(--afenda-density-comfortable-toolbar-gap);
  --afenda-density-field-gap: var(--afenda-density-comfortable-field-gap);
}
`;
}

function buildRuntimeBridgeCssFile(): string {
  return `/**
 * @generated — do not edit manually.
 * PAS-005 B30: Parts B–F synced from design-system token registry.
 * Source: packages/design-system/scripts/generate-tokens-css.ts
 * Regenerate: pnpm --filter @afenda/design-system build
 *
 * Requires @afenda/design-system/css/afenda-tokens.css before this import.
 */
${buildRuntimeBridgePartsCss()}`;
}

function buildDesignSystemShimCss(tokensImport: string): string {
  return `/**
 * @generated — do not edit manually.
 * @deprecated PAS-005 B30 — prefer @afenda/design-system/css/afenda-tokens.css
 *   + @afenda/css-authority/css/afenda-css-authority.css (same composition as @afenda/ui/afenda-ui.css).
 * Strangler deprecation shim — composes token authority + CSS Authority runtime bundle.
 * Regenerate: pnpm --filter @afenda/design-system build
 */
@import "${tokensImport}";
@import "@afenda/css-authority/css/afenda-css-authority.css";
`;
}

const count = allTokens.length;
const darkCount = darkTokens.length;

const tokensCss = buildTokensCss();
const srcDesignSystemCss = buildDesignSystemShimCss("./afenda-tokens.css");
const distDesignSystemCss = buildDesignSystemShimCss("./tokens.css");
const runtimeBridgeCss = buildRuntimeBridgeCssFile();

// 1. tokens.css — raw --afenda-* vars only
const distTokensPath = join(packageRoot, "dist/css/tokens.css");
mkdirSync(dirname(distTokensPath), { recursive: true });
writeFileSync(distTokensPath, tokensCss, "utf8");

const srcTokensPath = join(packageRoot, "src/css/afenda-tokens.css");
mkdirSync(dirname(srcTokensPath), { recursive: true });
writeFileSync(srcTokensPath, tokensCss, "utf8");

// 2. afenda-design-system.css — B30 deprecation shim (tokens + css-authority)
const distDesignSystemPath = join(
  packageRoot,
  "dist/css/afenda-design-system.css"
);
mkdirSync(dirname(distDesignSystemPath), { recursive: true });
writeFileSync(distDesignSystemPath, distDesignSystemCss, "utf8");

const srcDesignSystemPath = join(
  packageRoot,
  "src/css/afenda-design-system.css"
);
mkdirSync(dirname(srcDesignSystemPath), { recursive: true });
writeFileSync(srcDesignSystemPath, srcDesignSystemCss, "utf8");

// 3. PAS-005 B30 — sync runtime bridge (Parts B–F) into css-authority (single source)
const cssAuthorityBridgePath = join(
  packageRoot,
  "../css-authority/src/css/afenda-runtime-bridge.css"
);
mkdirSync(dirname(cssAuthorityBridgePath), { recursive: true });
writeFileSync(cssAuthorityBridgePath, runtimeBridgeCss, "utf8");

console.log(
  `✓ Generated dist/css/tokens.css                (${count} tokens, ${darkCount} with dark overrides)`
);
console.log(
  `✓ Generated src/css/afenda-tokens.css          (${count} tokens, ${darkCount} with dark overrides)`
);
console.log(
  "✓ Generated dist/css/afenda-design-system.css  (B30 deprecation shim)"
);
console.log(
  "✓ Generated src/css/afenda-design-system.css   (B30 deprecation shim)"
);
console.log(
  `✓ Synced css-authority afenda-runtime-bridge.css (${count} tokens, ${darkCount} with dark overrides)`
);
