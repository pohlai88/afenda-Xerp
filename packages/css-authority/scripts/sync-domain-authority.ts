import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  CssAuthorityDomainSource,
  CssAuthorityIdSequence,
  CssAuthorityToken,
  CssTokenAuthorityDomain,
  CssTokenCategory,
} from "../src/contracts/css-authority.contract.js";
import { isCssTokenCategory } from "../src/contracts/css-authority.contract.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, "..");
const repoRoot = join(packageRoot, "../..");
const authoritiesRoot = join(packageRoot, "src/authorities");
const idSequencePath = join(authoritiesRoot, "id-sequence.json");

const AFENDA_TOKENS_CSS = join(
  repoRoot,
  "packages/design-system/src/css/afenda-tokens.css"
);
const APPSHELL_CSS = join(
  repoRoot,
  "packages/appshell/src/styles/afenda-appshell.css"
);
const AUTH_EDITORIAL_CSS = join(
  repoRoot,
  "packages/appshell/src/styles/afenda-appshell-studio.css"
);

const AFENDA_EXTENSIONS_JSON = join(authoritiesRoot, "afenda-extensions.json");
const APPSHELL_JSON = join(authoritiesRoot, "appshell.json");
const AUTH_EDITORIAL_JSON = join(authoritiesRoot, "auth-editorial.json");

const CUSTOM_PROPERTY_RE = /^\s*(--[a-z0-9-]+)\s*:/gm;
const TOKEN_ID_RE = /^CSS-TOKEN-(\d+)$/;

const AFENDA_CATEGORY_RULES: ReadonlyArray<{
  readonly category: CssTokenCategory;
  readonly matches: (segment: string) => boolean;
}> = [
  { category: "chart", matches: (s) => s.includes("chart") },
  {
    category: "feedback",
    matches: (s) =>
      ["destructive", "success", "warning", "info", "feedback"].some((part) =>
        s.includes(part)
      ),
  },
  {
    category: "spacing",
    matches: (s) =>
      s.includes("spacing") ||
      s.includes("density") ||
      s.startsWith("afenda-space"),
  },
  {
    category: "typography",
    matches: (s) =>
      [
        "typography",
        "font-size",
        "font-weight",
        "letter-spacing",
        "line-height",
        "leading",
        "type-",
      ].some((part) => s.includes(part)),
  },
  {
    category: "motion",
    matches: (s) =>
      ["duration", "ease", "motion", "animation"].some((part) =>
        s.includes(part)
      ),
  },
  { category: "radius", matches: (s) => s.includes("radius") },
  {
    category: "shadow",
    matches: (s) => s.includes("shadow") || s.includes("elevation"),
  },
  {
    category: "layout",
    matches: (s) => s.includes("z-index") || s.includes("z-"),
  },
  {
    category: "border",
    matches: (s) =>
      ["border", "ring", "input", "divider"].some((part) => s.includes(part)),
  },
  {
    category: "text",
    matches: (s) => s.includes("text") || s.includes("foreground"),
  },
  {
    category: "surface",
    matches: (s) =>
      [
        "surface",
        "background",
        "color-surface",
        "canvas",
        "card",
        "popover",
        "muted",
      ].some((part) => s.includes(part)),
  },
  {
    category: "interactive",
    matches: (s) =>
      ["primary", "secondary", "accent"].some((part) => s.includes(part)),
  },
];

function formatTokenId(sequenceNumber: number): string {
  return `CSS-TOKEN-${String(sequenceNumber).padStart(3, "0")}`;
}

function parseTokenSequenceNumber(id: string): number {
  const match = TOKEN_ID_RE.exec(id);
  if (match === null) {
    throw new Error(`Invalid token id: ${id}`);
  }
  return Number.parseInt(match[1] ?? "", 10);
}

function loadIdSequence(): CssAuthorityIdSequence {
  return JSON.parse(
    readFileSync(idSequencePath, "utf8")
  ) as CssAuthorityIdSequence;
}

function writeIdSequence(sequence: CssAuthorityIdSequence): void {
  writeFileSync(idSequencePath, `${JSON.stringify(sequence, null, 2)}\n`);
}

export function parseCustomPropertyDefinitions(
  css: string,
  options?: {
    readonly prefix?: string;
    readonly selectorIncludes?: string;
  }
): string[] {
  let source = css;

  if (options?.selectorIncludes !== undefined) {
    const selectorPattern = new RegExp(
      `[^{]*${escapeRegExp(options.selectorIncludes)}[^{]*\\{([\\s\\S]*?)\\}`,
      "m"
    );
    const match = selectorPattern.exec(css);
    if (match === null) {
      throw new Error(
        `CSS source: missing selector block containing "${options.selectorIncludes}"`
      );
    }
    source = match[1] ?? "";
  }

  const names = new Set<string>();
  for (const match of source.matchAll(CUSTOM_PROPERTY_RE)) {
    const name = match[1];
    if (name === undefined) {
      continue;
    }
    if (options?.prefix !== undefined && !name.startsWith(options.prefix)) {
      continue;
    }
    names.add(name);
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function inferCategoryForPrefix(
  domain: CssTokenAuthorityDomain,
  varName: string
): CssTokenCategory {
  const segment = varName.slice(2);

  if (domain === "afenda-extensions") {
    return inferAfendaExtensionCategory(segment);
  }
  if (domain === "appshell") {
    return inferAppshellCategory(segment);
  }
  if (domain === "auth-editorial") {
    return inferAuthEditorialCategory(segment);
  }

  return "surface";
}

function inferAfendaExtensionCategory(segment: string): CssTokenCategory {
  for (const rule of AFENDA_CATEGORY_RULES) {
    if (rule.matches(segment)) {
      return rule.category;
    }
  }
  return "surface";
}

function inferAppshellCategory(segment: string): CssTokenCategory {
  if (segment.startsWith("app-shell-z-")) {
    return "layout";
  }
  if (
    segment.includes("gap") ||
    segment.includes("padding") ||
    segment.includes("section-gap") ||
    segment.includes("density")
  ) {
    return "spacing";
  }
  if (
    segment.includes("type-") ||
    segment.includes("leading") ||
    segment.includes("letter-spacing")
  ) {
    return "typography";
  }
  if (segment.includes("duration") || segment.includes("ease")) {
    return "motion";
  }
  if (segment.includes("shadow")) {
    return "shadow";
  }
  if (segment.includes("radius")) {
    return "radius";
  }
  if (segment.includes("text-")) {
    return "text";
  }
  if (segment.includes("header-strip-height")) {
    return "layout";
  }
  return "layout";
}

function inferAuthEditorialCategory(segment: string): CssTokenCategory {
  if (segment.includes("font-")) {
    return "typography";
  }
  if (segment.includes("shadow")) {
    return "shadow";
  }
  if (segment.includes("border") || segment.includes("ring")) {
    return "border";
  }
  if (
    segment.includes("ink") ||
    segment.includes("brand-text") ||
    segment.includes("brand-muted")
  ) {
    return "text";
  }
  if (
    segment.includes("forest") ||
    segment.includes("parchment") ||
    segment.includes("paper")
  ) {
    return "surface";
  }
  return "surface";
}

interface SyncDomainOptions {
  readonly domain: CssAuthorityDomainSource["domain"];
  readonly introducedIn: string;
  readonly jsonPath: string;
  readonly owner: string;
  readonly propertyNames: readonly string[];
  readonly source: string;
}

export function syncDomainFromCss(
  options: SyncDomainOptions
): CssAuthorityDomainSource {
  const existing = JSON.parse(
    readFileSync(options.jsonPath, "utf8")
  ) as CssAuthorityDomainSource;

  const existingByName = new Map(
    existing.tokens.map((token) => [token.name, token] as const)
  );

  let sequence = loadIdSequence();
  let nextId = sequence.nextTokenId;
  const tokens: CssAuthorityToken[] = [];

  for (const name of options.propertyNames) {
    const preserved = existingByName.get(name);
    if (preserved !== undefined) {
      tokens.push({
        ...preserved,
        source: options.source,
        editable: false,
        authority: options.domain,
        owner: options.owner,
      });
      continue;
    }

    const id = formatTokenId(nextId);
    nextId += 1;

    const category = inferCategoryForPrefix(options.domain, name);
    if (!isCssTokenCategory(category)) {
      throw new Error(`Failed to infer category for ${name}`);
    }

    tokens.push({
      id,
      name,
      owner: options.owner,
      authority: options.domain,
      lifecycle: "stable",
      source: options.source,
      introducedIn: options.introducedIn,
      category,
      editable: false,
    });
  }

  tokens.sort(
    (a, b) => parseTokenSequenceNumber(a.id) - parseTokenSequenceNumber(b.id)
  );

  const domainSource: CssAuthorityDomainSource = {
    schemaVersion: 1,
    domain: options.domain,
    owner: options.owner,
    tokens,
  };

  writeFileSync(options.jsonPath, `${JSON.stringify(domainSource, null, 2)}\n`);

  const maxAssigned =
    tokens.length === 0
      ? 0
      : Math.max(...tokens.map((token) => parseTokenSequenceNumber(token.id)));

  if (nextId <= maxAssigned) {
    nextId = maxAssigned + 1;
  }

  sequence = { schemaVersion: 1, nextTokenId: nextId };
  writeIdSequence(sequence);

  return domainSource;
}

export function syncAfendaExtensionsAuthorityFromTokensCss(): CssAuthorityDomainSource {
  const css = readFileSync(AFENDA_TOKENS_CSS, "utf8");
  const propertyNames = parseCustomPropertyDefinitions(css, {
    prefix: "--afenda-",
  });

  return syncDomainFromCss({
    domain: "afenda-extensions",
    owner: "@afenda/css-authority",
    source: "packages/design-system/src/css/afenda-tokens.css",
    introducedIn: "PAS-005-B34",
    jsonPath: AFENDA_EXTENSIONS_JSON,
    propertyNames,
  });
}

export function syncAppshellAuthorityFromCss(): CssAuthorityDomainSource {
  const css = readFileSync(APPSHELL_CSS, "utf8");
  const propertyNames = parseCustomPropertyDefinitions(css, {
    prefix: "--app-shell-",
    selectorIncludes: ".app-shell-root",
  });

  return syncDomainFromCss({
    domain: "appshell",
    owner: "@afenda/appshell",
    source: "packages/appshell/src/styles/afenda-appshell.css",
    introducedIn: "PAS-005-B34",
    jsonPath: APPSHELL_JSON,
    propertyNames,
  });
}

export function syncAuthEditorialAuthorityFromStudioCss(): CssAuthorityDomainSource {
  const css = readFileSync(AUTH_EDITORIAL_CSS, "utf8");
  const propertyNames = parseCustomPropertyDefinitions(css, {
    prefix: "--auth-editorial-",
  });

  return syncDomainFromCss({
    domain: "auth-editorial",
    owner: "@afenda/appshell",
    source: "packages/appshell/src/styles/afenda-appshell-studio.css",
    introducedIn: "PAS-005-B34",
    jsonPath: AUTH_EDITORIAL_JSON,
    propertyNames,
  });
}
