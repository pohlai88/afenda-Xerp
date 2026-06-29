#!/usr/bin/env tsx
/**
 * One-shot link rewrite: root PAS-004* paths + legacy slice/ → ENTERPRISE-KNOWLEDGE composed SSOT.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const EK_SLICES = [
  "b24-knowledge-charter-mvp",
  "b25-10-json-data-authority",
  "b26-kernel-mapping-gate",
  "b27-consumer-proof",
  "b28-glossary-sync-gate",
  "b29-coverage-expansion",
  "b30-enterprise-accepted-attestation",
  "b31-ontology-completion",
  "b32-erp-consumer-integration",
  "b33-kernel-identity-mapping-gate",
  "b34-metadata-consumer-proof",
  "b35-docs-consumer-proof",
  "b36-acceptance-graph-queries",
  "b37-enterprise-accepted-attestation",
  "b38-pas004c-concept-vocabulary",
  "b39-pas004c-contextual-meaning",
  "b40-pas004c-domain-axis-split",
  "b41-pas004c-accepted-vs-applicable",
  "b42-pas004c-semantic-edges",
  "b43-pas004c-consumer-profiles",
  "b44-pas004c-realization-mapping",
  "b45-pas004c-lifecycle-transition-governance",
  "b46-pas004c-semantic-attestation",
  "b47-pas004c-consumer-projection-adoption",
  "b48-pas004c-docs-consumer-projection-adoption",
  "b49-pas004d-authority-mirror-sync",
] as const;

const REPLACEMENTS: [string, string][] = [
  [
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
  ],
  [
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
  ],
  [
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
  ],
  [
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
    "docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
  ],
  [
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
  ],
  [
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
  ],
  [
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
  ],
  [
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
    "../PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
  ],
  [
    "../../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "../../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "../../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "../../../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "(ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)",
    "(ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)",
  ],
  [
    "(ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md)",
    "(ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md)",
  ],
  [
    "(ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md)",
    "(ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md)",
  ],
  [
    "(ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md)",
    "(ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md)",
  ],
  [
    "(ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md)",
    "(ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md)",
  ],
  [
    "[ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md]",
    "[ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md]",
  ],
  [
    "[ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md]",
    "[ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md]",
  ],
  [
    "[ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md]",
    "[ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md]",
  ],
  [
    "[ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md]",
    "[ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md]",
  ],
  [
    "[ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
    "[ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
  ],
  // Package tombstone relative paths
  [
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md",
  ],
  [
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md",
  ],
  [
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md",
  ],
  [
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md",
  ],
  [
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
    "../../docs/PAS/ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md",
  ],
];

for (const slug of EK_SLICES) {
  REPLACEMENTS.push([
    `docs/PAS/slice/${slug}.md`,
    `docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/${slug}.md`,
  ]);
  REPLACEMENTS.push([
    `../slice/${slug}.md`,
    `../ENTERPRISE-KNOWLEDGE/SLICE/${slug}.md`,
  ]);
  REPLACEMENTS.push([
    `](SLICE/${slug}.md)`,
    `](SLICE/${slug}.md)`,
  ]);
}

REPLACEMENTS.sort((a, b) => b[0].length - a[0].length);

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".next"]);

const TEXT_EXT = new Set([
  ".md",
  ".mdc",
  ".mts",
  ".ts",
  ".tsx",
  ".json",
  ".mdx",
  ".yml",
  ".yaml",
]);

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if ([...TEXT_EXT].some((ext) => name.endsWith(ext))) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(repoRoot)) {
  if (file.includes(`${join("docs", "PAS", "ENTERPRISE-KNOWLEDGE")}`)) {
    continue;
  }
  if (file.includes(`${join("docs", "PAS", "PAS-004")}`)) {
    continue;
  }

  let content = readFileSync(file, "utf8");
  let next = content;
  for (const [from, to] of REPLACEMENTS) {
    next = next.replaceAll(from, to);
  }
  if (next !== content) {
    writeFileSync(file, next, "utf8");
    changed++;
    console.log(`updated: ${file.replace(repoRoot, "")}`);
  }
}

console.log(`rewrite-enterprise-knowledge-pas-links: ${changed} file(s) updated`);
