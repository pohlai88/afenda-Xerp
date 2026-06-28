import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  CssAuthorityDomainSource,
  CssAuthorityFileRegistry,
  CssAuthorityIdSequence,
  CssAuthorityRegistry,
  CssAuthorityToken,
} from "../src/contracts/css-authority.contract.js";
import {
  assertCssTokenId,
  isCssTokenAuthorityDomain,
  isCssTokenCategory,
  isCssTokenLifecycle,
} from "../src/contracts/css-authority.contract.js";

import {
  syncAfendaExtensionsAuthorityFromTokensCss,
  syncAppshellAuthorityFromCss,
  syncAuthEditorialAuthorityFromStudioCss,
} from "./sync-domain-authority.js";
import { syncShadcnThemeAuthorityFromVendoredCss } from "./sync-shadcn-theme-authority.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, "..");
const authoritiesRoot = join(packageRoot, "src/authorities");
const generatedRoot = join(packageRoot, "src/generated");
const distRoot = join(packageRoot, "dist");

const DOMAIN_FILES = [
  "shadcn-theme.json",
  "afenda-extensions.json",
  "appshell.json",
  "auth-editorial.json",
] as const;

const TOKEN_SEQUENCE_RE = /^CSS-TOKEN-(\d+)$/;

function loadDomain(fileName: string): CssAuthorityDomainSource {
  const raw = JSON.parse(
    readFileSync(join(authoritiesRoot, fileName), "utf8")
  ) as CssAuthorityDomainSource;

  if (raw.schemaVersion !== 1) {
    throw new Error(
      `${fileName}: unsupported schemaVersion ${raw.schemaVersion}`
    );
  }

  if (!isCssTokenAuthorityDomain(raw.domain)) {
    throw new Error(
      `${fileName}: invalid token authority domain ${raw.domain}`
    );
  }

  for (const token of raw.tokens) {
    assertCssTokenId(token.id);
    if (!token.name.startsWith("--")) {
      throw new Error(`${fileName}: token ${token.id} name must start with --`);
    }
    if (!isCssTokenLifecycle(token.lifecycle)) {
      throw new Error(`${fileName}: invalid lifecycle on ${token.id}`);
    }
    if (!isCssTokenCategory(token.category)) {
      throw new Error(`${fileName}: invalid category on ${token.id}`);
    }
    if (token.authority !== raw.domain) {
      throw new Error(
        `${fileName}: token ${token.id} authority must match domain ${raw.domain}`
      );
    }
    if (token.parentId !== undefined) {
      assertCssTokenId(token.parentId);
    }
  }

  return raw;
}

function loadIdSequence(): CssAuthorityIdSequence {
  const raw = JSON.parse(
    readFileSync(join(authoritiesRoot, "id-sequence.json"), "utf8")
  ) as CssAuthorityIdSequence;

  if (raw.schemaVersion !== 1) {
    throw new Error(
      `id-sequence.json: unsupported schemaVersion ${raw.schemaVersion}`
    );
  }

  if (!Number.isInteger(raw.nextTokenId) || raw.nextTokenId < 1) {
    throw new Error("id-sequence.json: nextTokenId must be a positive integer");
  }

  return raw;
}

function loadFileRegistry(): CssAuthorityFileRegistry {
  const raw = JSON.parse(
    readFileSync(join(authoritiesRoot, "css-files.json"), "utf8")
  ) as CssAuthorityFileRegistry;

  if (raw.schemaVersion !== 1) {
    throw new Error(
      "css-files.json: unsupported schemaVersion — expected file inventory shape"
    );
  }

  for (const file of raw.files) {
    if (!file.path.startsWith("packages/")) {
      throw new Error(
        `css-files.json: file path must be repo-relative under packages/: ${file.path}`
      );
    }
    if (!isCssTokenLifecycle(file.lifecycle)) {
      throw new Error(`css-files.json: invalid lifecycle on ${file.path}`);
    }
  }

  return raw;
}

function parseTokenSequenceNumber(id: string): number {
  const match = TOKEN_SEQUENCE_RE.exec(id);
  if (match === null) {
    throw new Error(`Invalid token id for sequence parse: ${id}`);
  }
  return Number.parseInt(match[1] ?? "", 10);
}

function validateIdSequence(
  tokens: readonly CssAuthorityToken[],
  sequence: CssAuthorityIdSequence
): void {
  if (tokens.length === 0) {
    if (sequence.nextTokenId !== 1) {
      throw new Error(
        "id-sequence.json: nextTokenId must be 1 when registry has zero tokens"
      );
    }
    return;
  }

  const maxId = Math.max(
    ...tokens.map((token) => parseTokenSequenceNumber(token.id))
  );
  if (sequence.nextTokenId <= maxId) {
    throw new Error(
      `id-sequence.json: nextTokenId (${sequence.nextTokenId}) must be greater than max assigned id (${maxId})`
    );
  }
}

function validateParentReferences(tokens: readonly CssAuthorityToken[]): void {
  const ids = new Set(tokens.map((token) => token.id));

  for (const token of tokens) {
    if (token.parentId !== undefined && !ids.has(token.parentId)) {
      throw new Error(
        `Token ${token.id} references missing parentId ${token.parentId}`
      );
    }
  }
}

function mergeTokens(): CssAuthorityToken[] {
  const byId = new Map<string, CssAuthorityToken>();
  const byName = new Map<string, CssAuthorityToken>();

  for (const fileName of DOMAIN_FILES) {
    const domain = loadDomain(fileName);
    for (const token of domain.tokens) {
      const existingByName = byName.get(token.name);
      if (existingByName !== undefined) {
        throw new Error(
          `Duplicate CSS token name ${token.name} (${existingByName.id} vs ${token.id})`
        );
      }

      const existingById = byId.get(token.id);
      if (existingById !== undefined) {
        throw new Error(`Duplicate CSS token id ${token.id}`);
      }

      byId.set(token.id, token);
      byName.set(token.name, token);
    }
  }

  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function emitRegistryModule(): string {
  return `/**
 * @generated — do not edit manually.
 * Source: packages/css-authority/src/authorities/*.json
 * Regenerate: pnpm --filter @afenda/css-authority generate:css-authority-registry
 */
import type { CssAuthorityRegistry, CssAuthorityToken } from "../contracts/css-authority.contract.js";

import registryJson from "./css-authority-registry.json" with { type: "json" };

/** JSON import widens literals — conformance gate validates shape at CI. */
export const CSS_AUTHORITY_REGISTRY = registryJson as CssAuthorityRegistry;

export const CSS_AUTHORITY_TOKENS: readonly CssAuthorityToken[] =
  CSS_AUTHORITY_REGISTRY.tokens;

export const CSS_TOKEN_IDS: readonly string[] = CSS_AUTHORITY_TOKENS.map(
  (token) => token.id
);

/** Validated at trust boundaries via \`isCssTokenId()\` — not a 568-member literal union. */
export type CssTokenId = string;

export const CSS_AUTHORITY_TOKEN_NAMES: readonly string[] = CSS_AUTHORITY_TOKENS.map(
  (token) => token.name
);

export function getCssAuthorityTokenById(id: string): CssAuthorityToken | undefined {
  return CSS_AUTHORITY_TOKENS.find((token) => token.id === id);
}

export function getCssAuthorityTokenByName(name: string): CssAuthorityToken | undefined {
  return CSS_AUTHORITY_TOKENS.find((token) => token.name === name);
}

export function allowedConsumptionVarNames(): ReadonlySet<string> {
  return new Set(
    CSS_AUTHORITY_TOKENS.filter((token) => token.lifecycle !== "removed").map(
      (token) => token.name.slice(2)
    )
  );
}
`;
}

function emitRuntimeCss(): string {
  return `/**
 * @generated — do not edit manually.
 * PAS-005 runtime bundle: Afenda semantic bridge + @theme + base (B29 cutover).
 * Requires @afenda/design-system/css/afenda-tokens.css before this import.
 * Regenerate: pnpm --filter @afenda/css-authority build
 */
@import "./afenda-runtime-bridge.css";
`;
}

function main(): void {
  syncShadcnThemeAuthorityFromVendoredCss();
  syncAfendaExtensionsAuthorityFromTokensCss();
  syncAppshellAuthorityFromCss();
  syncAuthEditorialAuthorityFromStudioCss();
  loadFileRegistry();
  const sequence = loadIdSequence();
  const tokens = mergeTokens();
  validateIdSequence(tokens, sequence);
  validateParentReferences(tokens);

  const registry: CssAuthorityRegistry = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    tokens,
  };

  mkdirSync(generatedRoot, { recursive: true });
  mkdirSync(join(distRoot, "css"), { recursive: true });
  mkdirSync(join(distRoot, "generated"), { recursive: true });
  mkdirSync(join(distRoot, "css/vendored"), { recursive: true });
  mkdirSync(join(packageRoot, "src/css"), { recursive: true });

  const vendoredSource = join(packageRoot, "src/css/vendored/shadcn-theme.css");
  const bridgeSource = join(packageRoot, "src/css/afenda-runtime-bridge.css");
  copyFileSync(vendoredSource, join(distRoot, "css/vendored/shadcn-theme.css"));
  copyFileSync(bridgeSource, join(distRoot, "css/afenda-runtime-bridge.css"));

  const registryTs = emitRegistryModule();
  writeFileSync(join(generatedRoot, "css-authority-registry.ts"), registryTs);
  writeFileSync(
    join(generatedRoot, "css-authority-registry.json"),
    `${JSON.stringify(registry, null, 2)}\n`
  );

  const runtimeCss = emitRuntimeCss();
  writeFileSync(
    join(packageRoot, "src/css/afenda-css-authority.css"),
    runtimeCss
  );
  writeFileSync(join(distRoot, "css/afenda-css-authority.css"), runtimeCss);
  writeFileSync(
    join(distRoot, "generated/css-authority-registry.json"),
    `${JSON.stringify(registry, null, 2)}\n`
  );

  process.stdout.write(
    `Generated CSS Authority Registry (${tokens.length} tokens) → src/generated/\n`
  );
}

main();
