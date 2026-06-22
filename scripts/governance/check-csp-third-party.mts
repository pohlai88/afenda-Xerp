#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { checkCspSriBuildHtml } from "./csp-sri-governance.mjs";
import { checkCspThirdPartyGovernance } from "./csp-third-party-governance.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);
const erpSrcRoot = join(repoRoot, "apps/erp/src");
const erpSignInHtmlPath = join(
  repoRoot,
  "apps/erp/.next/server/app/sign-in.html"
);
const allowlistPath = join(
  repoRoot,
  "apps/erp/src/lib/security/csp-allowlist.ts"
);

const FORBIDDEN_ALLOWLIST_PATTERN =
  /["'](?:\*|https:|http:|'unsafe-inline')["']/u;

function validateAllowlistFile(): string[] {
  const source = readFileSync(allowlistPath, "utf8");
  const violations: string[] = [];

  if (FORBIDDEN_ALLOWLIST_PATTERN.test(source)) {
    violations.push(
      "csp-allowlist.ts contains forbidden wildcard or unsafe CSP origin."
    );
  }

  return violations;
}

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(?:tsx?|jsx?)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function validateSriBuildArtifact(): string[] {
  if (!existsSync(erpSignInHtmlPath)) {
    console.warn(
      "Skipping SRI build artifact check — apps/erp/.next/server/app/sign-in.html not found. Run pnpm --filter @afenda/erp build first."
    );
    return [];
  }

  const html = readFileSync(erpSignInHtmlPath, "utf8");
  return checkCspSriBuildHtml(html).map(
    (violation) => `apps/erp/.next/server/app/sign-in.html: ${violation}`
  );
}

function main(): void {
  const violations: string[] = [...validateAllowlistFile()];

  for (const filePath of collectSourceFiles(erpSrcRoot)) {
    const source = readFileSync(filePath, "utf8");
    const relativePath = relative(repoRoot, filePath).replaceAll("\\", "/");
    const fileViolations = checkCspThirdPartyGovernance(source, relativePath);

    for (const violation of fileViolations) {
      violations.push(`${relativePath}: ${violation}`);
    }
  }

  violations.push(...validateSriBuildArtifact());

  if (violations.length > 0) {
    console.error("CSP third-party governance failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("CSP third-party governance passed");
}

main();
