import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  CssAuthorityDomainSource,
  CssAuthorityIdSequence,
  CssAuthorityToken,
  CssTokenCategory,
} from "../src/contracts/css-authority.contract.js";
import { isCssTokenCategory } from "../src/contracts/css-authority.contract.js";

const SHADCN_THEME_CSS = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "../src/css/vendored/shadcn-theme.css"
);
const SHADCN_THEME_JSON = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "../src/authorities/shadcn-theme.json"
);
const ID_SEQUENCE_JSON = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "../src/authorities/id-sequence.json"
);

const ROOT_BLOCK_RE = /:root\s*\{([\s\S]*?)\}/;
const TOKEN_SEQUENCE_RE = /^CSS-TOKEN-(\d+)$/;

function inferCategory(varName: string): CssTokenCategory {
  if (varName.startsWith("chart-")) {
    return "chart";
  }
  if (varName.startsWith("sidebar")) {
    return "layout";
  }
  if (varName.includes("foreground") || varName.startsWith("font-")) {
    return varName.startsWith("font-") ? "typography" : "text";
  }
  if (varName === "radius") {
    return "radius";
  }
  if (["border", "input", "ring"].includes(varName)) {
    return "border";
  }
  if (
    ["destructive", "success", "warning", "info"].some((prefix) =>
      varName.startsWith(prefix)
    )
  ) {
    return "feedback";
  }
  if (
    ["primary", "secondary", "accent", "muted"].some((prefix) =>
      varName.startsWith(prefix)
    )
  ) {
    return "interactive";
  }
  if (["background", "card", "popover"].includes(varName)) {
    return "surface";
  }
  return "surface";
}

function parseRootCustomProperties(css: string): string[] {
  const rootMatch = ROOT_BLOCK_RE.exec(css);
  if (rootMatch === null) {
    throw new Error("shadcn-theme.css: missing :root block");
  }

  const block = rootMatch[1] ?? "";
  const names = new Set<string>();
  const propertyRe = /^\s*(--[a-z0-9-]+)\s*:/gm;

  for (const match of block.matchAll(propertyRe)) {
    const name = match[1];
    if (name !== undefined) {
      names.add(name);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

function loadIdSequence(): CssAuthorityIdSequence {
  const raw = JSON.parse(
    readFileSync(ID_SEQUENCE_JSON, "utf8")
  ) as CssAuthorityIdSequence;
  return raw;
}

function writeIdSequence(sequence: CssAuthorityIdSequence): void {
  writeFileSync(ID_SEQUENCE_JSON, `${JSON.stringify(sequence, null, 2)}\n`);
}

function formatTokenId(sequenceNumber: number): string {
  return `CSS-TOKEN-${String(sequenceNumber).padStart(3, "0")}`;
}

function parseTokenSequenceNumber(id: string): number {
  const match = TOKEN_SEQUENCE_RE.exec(id);
  if (match === null) {
    throw new Error(`Invalid token id: ${id}`);
  }
  return Number.parseInt(match[1] ?? "", 10);
}

export function syncShadcnThemeAuthorityFromVendoredCss(): CssAuthorityDomainSource {
  const css = readFileSync(SHADCN_THEME_CSS, "utf8");
  const propertyNames = parseRootCustomProperties(css);

  const existing = JSON.parse(
    readFileSync(SHADCN_THEME_JSON, "utf8")
  ) as CssAuthorityDomainSource;

  const existingByName = new Map(
    existing.tokens.map((token) => [token.name, token] as const)
  );

  let sequence = loadIdSequence();
  let nextId = sequence.nextTokenId;
  const tokens: CssAuthorityToken[] = [];

  for (const name of propertyNames) {
    const preserved = existingByName.get(name);
    if (preserved !== undefined) {
      tokens.push({
        ...preserved,
        source: "packages/css-authority/src/css/vendored/shadcn-theme.css",
        editable: false,
        authority: "shadcn-theme",
        owner: "shadcn",
      });
      continue;
    }

    const id = formatTokenId(nextId);
    nextId += 1;

    const category = inferCategory(name.slice(2));
    if (!isCssTokenCategory(category)) {
      throw new Error(`Failed to infer category for ${name}`);
    }

    tokens.push({
      id,
      name,
      owner: "shadcn",
      authority: "shadcn-theme",
      lifecycle: "stable",
      source: "packages/css-authority/src/css/vendored/shadcn-theme.css",
      introducedIn: "shadcn@4.11.0",
      category,
      editable: false,
    });
  }

  tokens.sort(
    (a, b) => parseTokenSequenceNumber(a.id) - parseTokenSequenceNumber(b.id)
  );

  const domainSource: CssAuthorityDomainSource = {
    schemaVersion: 1,
    domain: "shadcn-theme",
    owner: "shadcn",
    tokens,
  };

  writeFileSync(
    SHADCN_THEME_JSON,
    `${JSON.stringify(domainSource, null, 2)}\n`
  );

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
