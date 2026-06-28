#!/usr/bin/env tsx
/**
 * PAS-005 — CSS Authority domain sync drift gate.
 * Compares token counts in authority JSON sources against CSS definition sites.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCustomPropertyDefinitions } from "../../packages/css-authority/scripts/sync-domain-authority.ts";
import { parseRootCustomProperties } from "../../packages/css-authority/scripts/sync-shadcn-theme-authority.ts";
import type { CssAuthorityDomainSource } from "../../packages/css-authority/src/contracts/css-authority.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const authoritiesRoot = join(
  repoRoot,
  "packages/css-authority/src/authorities"
);

interface DomainExpectation {
  readonly expectedCount: number;
  readonly jsonFile: string;
  readonly label: string;
}

function loadDomainTokenCount(jsonFile: string): number {
  const path = join(authoritiesRoot, jsonFile);
  if (!existsSync(path)) {
    throw new Error(`Missing authority JSON: ${path}`);
  }
  const domain = JSON.parse(
    readFileSync(path, "utf8")
  ) as CssAuthorityDomainSource;
  return domain.tokens.length;
}

function countAfendaExtensionsFromCss(): number {
  const cssPath = join(
    repoRoot,
    "packages/css-authority/src/css/afenda-tokens.css"
  );
  return parseCustomPropertyDefinitions(readFileSync(cssPath, "utf8"), {
    prefix: "--afenda-",
  }).length;
}

function countAppshellFromCss(): number {
  const cssPath = join(
    repoRoot,
    "packages/appshell/src/styles/afenda-appshell.css"
  );
  return parseCustomPropertyDefinitions(readFileSync(cssPath, "utf8"), {
    prefix: "--app-shell-",
    selectorIncludes: ".app-shell-root",
  }).length;
}

function countAuthEditorialFromCss(): number {
  const cssPath = join(
    repoRoot,
    "packages/appshell/src/styles/afenda-appshell-studio.css"
  );
  return parseCustomPropertyDefinitions(readFileSync(cssPath, "utf8"), {
    prefix: "--auth-editorial-",
  }).length;
}

function countShadcnFromCss(): number {
  const cssPath = join(
    repoRoot,
    "packages/css-authority/src/css/vendored/shadcn-theme.css"
  );
  return parseRootCustomProperties(readFileSync(cssPath, "utf8")).length;
}

const DOMAIN_CHECKS: ReadonlyArray<{
  readonly jsonFile: string;
  readonly label: string;
  readonly countFromCss: () => number;
}> = [
  {
    jsonFile: "shadcn-theme.json",
    label: "shadcn-theme",
    countFromCss: countShadcnFromCss,
  },
  {
    jsonFile: "afenda-extensions.json",
    label: "afenda-extensions",
    countFromCss: countAfendaExtensionsFromCss,
  },
  {
    jsonFile: "appshell.json",
    label: "appshell",
    countFromCss: countAppshellFromCss,
  },
  {
    jsonFile: "auth-editorial.json",
    label: "auth-editorial",
    countFromCss: countAuthEditorialFromCss,
  },
];

const mismatches: string[] = [];
const summary: DomainExpectation[] = [];

for (const check of DOMAIN_CHECKS) {
  const jsonCount = loadDomainTokenCount(check.jsonFile);
  const cssCount = check.countFromCss();
  summary.push({
    jsonFile: check.jsonFile,
    label: check.label,
    expectedCount: cssCount,
  });

  if (jsonCount !== cssCount) {
    mismatches.push(
      `${check.label}: authority JSON has ${jsonCount} token(s) but CSS source defines ${cssCount} — run pnpm --filter @afenda/css-authority build`
    );
  }
}

if (mismatches.length > 0) {
  process.stderr.write("css-authority-domain-sync: FAIL\n");
  for (const message of mismatches) {
    process.stderr.write(`  - ${message}\n`);
  }
  process.exit(1);
}

const total = summary.reduce((sum, row) => sum + row.expectedCount, 0);
const domainSummary = summary
  .map((row) => `${row.label}=${row.expectedCount}`)
  .join(", ");

process.stdout.write(
  `css-authority-domain-sync: PASS (${domainSummary}, total=${total})\n`
);
