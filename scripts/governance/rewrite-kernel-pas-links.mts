#!/usr/bin/env tsx
/**
 * One-shot link rewrite: root PAS-001* paths → KERNEL composed SSOT.
 * Excludes docs/PAS/KERNEL/archive/ (historical filenames preserved).
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const REPLACEMENTS: [string, string][] = [
  [
    "docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    "docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
  ],
  [
    "docs/PAS/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md",
    "docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md",
  ],
  [
    "docs/PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md",
    "docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
  ],
  [
    "../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    "../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
  ],
  [
    "../PAS/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md",
    "../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md",
  ],
  [
    "../PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md",
    "../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
  ],
  [
    "../../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    "../../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
  ],
  [
    "../../PAS/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md",
    "../../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md",
  ],
  [
    "../../PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md",
    "../../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
  ],
  [
    "../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    "../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
  ],
  [
    "../../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md",
    "../../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md",
  ],
  [
    "(PAS-001-KERNEL-AUTHORITY-STANDARD.md)",
    "(KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)",
  ],
  [
    "(PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md",
    "(KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md",
  ],
  [
    "(PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md",
    "(KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md",
  ],
  [
    "[PAS-001-KERNEL-AUTHORITY-STANDARD.md]",
    "[KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md]",
  ],
  [
    "[PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md]",
    "[KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md]",
  ],
  [
    "[PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md]",
    "[KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md]",
  ],
  [
    "`PAS-001-KERNEL-AUTHORITY-STANDARD.md`",
    "`KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`",
  ],
  ["compatibility redirect", "removed"],
  ["compatibility redirects", "removed"],
  [
    "Root `docs/PAS/PAS-001*.md` files are **compatibility redirects** only.",
    "",
  ],
  [
    "Root `docs/PAS/PAS-001*.md` paths are **compatibility redirects** only.",
    "",
  ],
];

const SKIP_DIR_NAMES = new Set(["node_modules", ".git", "dist", ".turbo"]);
const SKIP_PATH_PARTS = ["docs/PAS/KERNEL/archive"];

const EXT = new Set([".md", ".mdc", ".mts", ".ts", ".json"]);

function shouldSkip(absPath: string): boolean {
  if (
    SKIP_PATH_PARTS.some((part) => absPath.includes(part.replace(/\//g, "\\")))
  ) {
    return true;
  }
  if (SKIP_PATH_PARTS.some((part) => absPath.includes(part))) {
    return true;
  }
  if (absPath.endsWith("rewrite-kernel-pas-links.mts")) {
    return true;
  }
  return false;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (shouldSkip(abs)) {
      continue;
    }
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (SKIP_DIR_NAMES.has(name)) {
        continue;
      }
      walk(abs, out);
    } else if (EXT.has(abs.slice(abs.lastIndexOf(".")))) {
      out.push(abs);
    }
  }
  return out;
}

let changed = 0;
for (const file of walk(repoRoot)) {
  const original = readFileSync(file, "utf8");
  let next = original;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  if (next !== original) {
    writeFileSync(file, next, "utf8");
    changed++;
    console.log(
      `updated: ${file.replace(`${repoRoot}\\`, "").replace(`${repoRoot}/`, "")}`
    );
  }
}

console.log(`rewrite-kernel-pas-links: ${changed} file(s) updated`);
