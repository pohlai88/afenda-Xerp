#!/usr/bin/env tsx
/**
 * PAS-005B B44 — Design-system retirement readiness gate.
 *
 * Verifies:
 * 1. Every --afenda-* in css-authority afenda-tokens.css is registered in afenda-extensions.json
 * 2. No @afenda/design-system TS imports outside the retirement allowlist
 * 3. @afenda/ui CSS chain imports css-authority tokens (not design-system)
 * 4. design-authority registry surfaces exist under packages/ui
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { parseCustomPropertyDefinitions } from "../../packages/css-authority/scripts/sync-domain-authority.ts";
import type { CssAuthorityDomainSource } from "../../packages/css-authority/src/contracts/css-authority.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const AFENDA_TOKENS_CSS = join(
  repoRoot,
  "packages/css-authority/src/css/afenda-tokens.css"
);
const AFENDA_EXTENSIONS_JSON = join(
  repoRoot,
  "packages/css-authority/src/authorities/afenda-extensions.json"
);
const UI_AFENDA_CSS = join(repoRoot, "packages/ui/src/styles/afenda-ui.css");
const UI_DESIGN_AUTHORITY = join(
  repoRoot,
  "packages/ui/src/design-authority/index.ts"
);

/** TS import allowlist — governance scripts and docs may reference retired package name. */
const DESIGN_SYSTEM_IMPORT_ALLOWLIST: ReadonlyArray<string> = [
  "packages/ui-composition/src/governance/cross-package-authority.contract.ts",
  "packages/architecture-authority/src/__tests__/",
  "packages/ai-governance/src/__tests__/",
  "scripts/governance/check-downstream-integration.mts",
  "scripts/css/check-css-governance.mts",
  "scripts/css/css-theme-contract.mts",
  "scripts/css/css-registry.mts",
  "docs/",
];

const DESIGN_SYSTEM_IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,]+)\s+from\s+["']@afenda\/design-system(?:\/[^"']*)?["']/mu;

const failures: string[] = [];

function loadAfendaExtensionNames(): ReadonlySet<string> {
  const domain = JSON.parse(
    readFileSync(AFENDA_EXTENSIONS_JSON, "utf8")
  ) as CssAuthorityDomainSource;
  return new Set(domain.tokens.map((token) => token.name));
}

function checkAfendaTokenParity(): void {
  if (!existsSync(AFENDA_TOKENS_CSS)) {
    failures.push(
      `Missing css-authority token CSS: ${relative(repoRoot, AFENDA_TOKENS_CSS)}`
    );
    return;
  }

  const cssTokens = parseCustomPropertyDefinitions(
    readFileSync(AFENDA_TOKENS_CSS, "utf8"),
    { prefix: "--afenda-" }
  );
  const jsonNames = loadAfendaExtensionNames();

  const missingInJson: string[] = [];
  for (const name of cssTokens) {
    if (!jsonNames.has(name)) {
      missingInJson.push(name);
    }
  }

  if (missingInJson.length > 0) {
    failures.push(
      `${missingInJson.length} --afenda-* token(s) in afenda-tokens.css missing from afenda-extensions.json (first 5: ${missingInJson.slice(0, 5).join(", ")})`
    );
  }

  process.stdout.write(
    `Afenda token parity: ${cssTokens.length} CSS definitions, ${jsonNames.size} JSON registry entries\n`
  );
}

function isAllowlisted(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, "/");
  return DESIGN_SYSTEM_IMPORT_ALLOWLIST.some((prefix) =>
    normalized.startsWith(prefix.replace(/\\/g, "/"))
  );
}

function collectSourceFiles(
  directory: string,
  extensions: readonly string[] = [".ts", ".tsx", ".mts"]
): string[] {
  const files: string[] = [];
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".next", ".git"].includes(entry.name)) {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath, extensions));
      continue;
    }
    if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(absolutePath);
    }
  }
  return files;
}

function checkImportAllowlist(): void {
  const scanRoots = [
    join(repoRoot, "packages"),
    join(repoRoot, "apps"),
    join(repoRoot, "scripts"),
  ];

  const violations: string[] = [];
  for (const root of scanRoots) {
    for (const filePath of collectSourceFiles(root)) {
      const rel = relative(repoRoot, filePath).replace(/\\/g, "/");
      if (isAllowlisted(rel)) {
        continue;
      }
      const source = readFileSync(filePath, "utf8");
      if (DESIGN_SYSTEM_IMPORT_RE.test(source)) {
        violations.push(rel);
      }
    }
  }

  if (violations.length > 0) {
    failures.push(
      `${violations.length} file(s) import @afenda/design-system outside allowlist:\n  - ${violations.slice(0, 10).join("\n  - ")}`
    );
  } else {
    process.stdout.write(
      "Import allowlist: no forbidden @afenda/design-system TS imports\n"
    );
  }
}

function checkUiCssChain(): void {
  const css = readFileSync(UI_AFENDA_CSS, "utf8");
  if (css.includes("@afenda/design-system/")) {
    failures.push(
      "packages/ui/src/styles/afenda-ui.css still imports @afenda/design-system — use @afenda/css-authority/css/afenda-tokens.css"
    );
  }
  if (!css.includes("@afenda/css-authority/css/afenda-tokens.css")) {
    failures.push(
      "packages/ui/src/styles/afenda-ui.css must import @afenda/css-authority/css/afenda-tokens.css"
    );
  }
  if (!css.includes("@afenda/css-authority/css/afenda-css-authority.css")) {
    failures.push(
      "packages/ui/src/styles/afenda-ui.css must import @afenda/css-authority/css/afenda-css-authority.css"
    );
  }
}

function checkDesignAuthorityInternalized(): void {
  if (!existsSync(UI_DESIGN_AUTHORITY)) {
    failures.push("Missing packages/ui/src/design-authority/index.ts");
    return;
  }
  const indexSource = readFileSync(UI_DESIGN_AUTHORITY, "utf8");
  if (!indexSource.includes("designSystemContract")) {
    failures.push(
      "packages/ui/src/design-authority/index.ts missing designSystemContract export"
    );
  }

  const registryPaths = [
    "packages/ui/src/design-authority/registries/recipe.registry.ts",
    "packages/ui/src/design-authority/registries/variant.registry.ts",
    "packages/ui/src/design-authority/registries/state.registry.ts",
    "packages/ui/src/design-authority/registries/motion.registry.ts",
  ];
  for (const relPath of registryPaths) {
    if (!existsSync(join(repoRoot, relPath))) {
      failures.push(`Missing internalized registry: ${relPath}`);
    }
  }

  process.stdout.write(
    "Design authority: recipe/variant/state/motion registries present under packages/ui\n"
  );
}

function main(): void {
  checkAfendaTokenParity();
  checkImportAllowlist();
  checkUiCssChain();
  checkDesignAuthorityInternalized();

  if (failures.length > 0) {
    console.error("\nDesign-system retirement readiness FAILED:\n");
    for (const failure of failures) {
      console.error(`  ✗ ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nDesign-system retirement readiness PASSED.");
}

main();
