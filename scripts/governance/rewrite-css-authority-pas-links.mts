#!/usr/bin/env tsx
/**
 * One-shot link rewrite: root PAS-005* paths + legacy slice/ → CSS-AUTHORITY composed SSOT.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const REPLACEMENTS: [string, string][] = [
  // Absolute docs paths — PAS composed SSOT
  [
    "docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md",
    "docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md",
  ],
  [
    "docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
    "docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
  ],
  [
    "docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
    "docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
  ],
  // Legacy pas005 slice paths only (do not blanket-replace docs/PAS/slice/)
  ["docs/PAS/slice/b27-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b27-pas005"],
  ["docs/PAS/slice/b28-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005"],
  ["docs/PAS/slice/b29-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b29-pas005"],
  ["docs/PAS/slice/b30-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b30-pas005"],
  ["docs/PAS/slice/b33-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b33-pas005"],
  ["docs/PAS/slice/b34-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b34-pas005"],
  ["docs/PAS/slice/b35-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b35-pas005"],
  ["docs/PAS/slice/b36-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b36-pas005"],
  ["docs/PAS/slice/b37-pas005", "docs/PAS/CSS-AUTHORITY/SLICE/b37-pas005"],
  ["docs/PAS/slice/b38-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b38-pas005a"],
  ["docs/PAS/slice/b39-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b39-pas005a"],
  ["docs/PAS/slice/b40-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b40-pas005a"],
  ["docs/PAS/slice/b41-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b41-pas005a"],
  ["docs/PAS/slice/b42-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42-pas005a"],
  ["docs/PAS/slice/b42b-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42b-pas005a"],
  ["docs/PAS/slice/b42c-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42c-pas005a"],
  ["docs/PAS/slice/b42d-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42d-pas005a"],
  ["docs/PAS/slice/b42e-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42e-pas005a"],
  ["docs/PAS/slice/b42f-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42f-pas005a"],
  ["docs/PAS/slice/b42g-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42g-pas005a"],
  ["docs/PAS/slice/b42h-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42h-pas005a"],
  ["docs/PAS/slice/b42i-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42i-pas005a"],
  ["docs/PAS/slice/b42j-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42j-pas005a"],
  ["docs/PAS/slice/b42k-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42k-pas005a"],
  ["docs/PAS/slice/b42l-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42l-pas005a"],
  ["docs/PAS/slice/b42m-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42m-pas005a"],
  ["docs/PAS/slice/b42n-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42n-pas005a"],
  ["docs/PAS/slice/b42o-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42o-pas005a"],
  ["docs/PAS/slice/b42p-pas005a", "docs/PAS/CSS-AUTHORITY/SLICE/b42p-pas005a"],
  ["docs/PAS/slice/b43-pas005b", "docs/PAS/CSS-AUTHORITY/SLICE/b43-pas005b"],
  ["docs/PAS/slice/b42j-*.md", "docs/PAS/CSS-AUTHORITY/SLICE/b42j-*.md"],
  ["docs/PAS/slice/b42k-*.md", "docs/PAS/CSS-AUTHORITY/SLICE/b42k-*.md"],
  ["docs/PAS/slice/b42l-*.md", "docs/PAS/CSS-AUTHORITY/SLICE/b42l-*.md"],
  ["docs/PAS/slice/b42m-*.md", "docs/PAS/CSS-AUTHORITY/SLICE/b42m-*.md"],
  ["docs/PAS/slice/b42n-*.md", "docs/PAS/CSS-AUTHORITY/SLICE/b42n-*.md"],
  // Relative from docs/PAS/ index and pas-status-index
  [
    "(PAS-005-CSS-AUTHORITY-STANDARD.md)",
    "(CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md)",
  ],
  [
    "(PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)",
    "(CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)",
  ],
  [
    "(PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md)",
    "(CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md)",
  ],
  [
    "[PAS-005-CSS-AUTHORITY-STANDARD.md]",
    "[CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md]",
  ],
  [
    "[PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md]",
    "[CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md]",
  ],
  [
    "[PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md]",
    "[CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md]",
  ],
  // Relative slice links from composed PAS docs (now under CSS-AUTHORITY/)
  ["](slice/", "](SLICE/"],
  ["`slice/", "`SLICE/"],
  // Package tombstone relative paths
  [
    "../../docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md",
    "../../docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md",
  ],
  [
    "../../docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
    "../../docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
  ],
  [
    "../../docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
    "../../docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
  ],
  [
    "../../../docs/PAS/PAS-005-CSS-AUTHORITY-STANDARD.md",
    "../../../docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md",
  ],
  [
    "../../../docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
    "../../../docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md",
  ],
  [
    "../../../docs/PAS/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
    "../../../docs/PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md",
  ],
  // README index table short links
  [
    "[PAS-005](PAS-005-CSS-AUTHORITY-STANDARD.md)",
    "[PAS-005](CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md)",
  ],
  [
    "[PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)",
    "[PAS-005A](CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md)",
  ],
  [
    "[PAS-005B](PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md)",
    "[PAS-005B](CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md)",
  ],
];

const SKIP_DIR_NAMES = new Set(["node_modules", ".git", "dist", ".turbo"]);
const EXT = new Set([".md", ".mdc", ".mts", ".ts", ".json"]);

function shouldSkip(absPath: string): boolean {
  if (absPath.endsWith("rewrite-css-authority-pas-links.mts")) {
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

console.log(`rewrite-css-authority-pas-links: ${changed} file(s) updated`);
