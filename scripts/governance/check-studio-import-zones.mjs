#!/usr/bin/env node
/**
 * PAS-006 — shadcn-studio two-zone import policy gate.
 *
 * Zone A (authority): contracts + registry — relative imports only; no @/.
 * Zone B (MCP UI): @/components/ui and @/lib allowed; @/contracts and @/registry forbidden.
 * Cross-package self-import: from "@afenda/shadcn-studio" inside this package is forbidden.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const studioSrcRoot = join(repoRoot, "packages/shadcn-studio/src");

const FORBIDDEN_ALIAS_PATTERNS = [
  {
    id: "authority-at-alias",
    pattern: /from\s+["']@\//,
    zones: ["meta-contracts", "meta-registry"],
    message:
      "Zone A (contracts/registry) must use relative imports — no @/ alias",
  },
  {
    id: "block-contracts-alias",
    pattern: /from\s+["']@\/contracts\//,
    zones: ["all-src"],
    message:
      "Afenda seam imports must be relative — @/contracts/* is forbidden in src/**",
  },
  {
    id: "block-registry-alias",
    pattern: /from\s+["']@\/registry\//,
    zones: ["all-src"],
    message:
      "Afenda seam imports must be relative — @/meta-registry/* is forbidden in src/**",
  },
  {
    id: "self-package-import",
    pattern: /from\s+["']@afenda\/shadcn-studio(?:\/|["'])/,
    zones: ["all-src"],
    message:
      "Same-package imports must be relative — @afenda/shadcn-studio self-import forbidden",
  },
];

function collectSourceFiles(directory, files = []) {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      collectSourceFiles(absolutePath, files);
      continue;
    }

    if (
      /\.(ts|tsx)$/.test(entry) &&
      !/\.(test|stories)\.(ts|tsx)$/.test(entry)
    ) {
      files.push(absolutePath);
    }
  }

  return files;
}

function zoneForFile(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized.startsWith("meta-contracts/")) {
    return "meta-contracts";
  }

  if (normalized.startsWith("meta-registry/")) {
    return "meta-registry";
  }

  return "all-src";
}

function shouldCheckRule(rule, zone) {
  if (rule.zones.includes("all-src")) {
    return true;
  }

  return rule.zones.includes(zone);
}

function scanStudioImports() {
  const violations = [];

  for (const filePath of collectSourceFiles(studioSrcRoot)) {
    const relFromSrc = relative(studioSrcRoot, filePath).replace(/\\/g, "/");
    const zone = zoneForFile(relFromSrc);
    const source = readFileSync(filePath, "utf8");
    const lines = source.split(/\r?\n/);

    for (const rule of FORBIDDEN_ALIAS_PATTERNS) {
      if (!shouldCheckRule(rule, zone)) {
        continue;
      }

      for (let index = 0; index < lines.length; index += 1) {
        if (rule.pattern.test(lines[index])) {
          violations.push({
            file: `packages/shadcn-studio/src/${relFromSrc}`,
            line: index + 1,
            rule: rule.id,
            message: rule.message,
            snippet: lines[index].trim(),
          });
        }
      }
    }
  }

  return violations;
}

const violations = scanStudioImports();

if (violations.length > 0) {
  process.stderr.write("studio import zones: FAIL\n");
  for (const hit of violations) {
    process.stderr.write(
      `- ${hit.file}:${hit.line} [${hit.rule}] ${hit.message}\n  ${hit.snippet}\n`
    );
  }
  process.exit(1);
}

process.stdout.write("studio import zones: OK\n");
process.exit(0);
