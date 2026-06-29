#!/usr/bin/env tsx
/**
 * PAS-004A B28 — glossary representation sync gate.
 *
 * Validates:
 * 1. glossary.md header still demotes glossary to representation (registry wins).
 * 2. knowledge-atom-ids manifest is present and every ID exists in the registry.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { KNOWLEDGE_ATOM_IDS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const glossaryPath = join(
  repoRoot,
  "docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md"
);
const glossary = readFileSync(glossaryPath, "utf8");
const errors: string[] = [];

const authorityHeader =
  "This glossary is a **synced representation** for human readers; when it conflicts with the Knowledge Atom registry, the registry wins";
if (!glossary.includes(authorityHeader)) {
  errors.push(
    "glossary.md: missing representation demotion header (registry wins authority)"
  );
}

const manifestMatch = glossary.match(
  /<!--\s*knowledge-atom-ids:\s*([^>]+)\s*-->/
);
if (manifestMatch?.[1]) {
  const manifestIds = manifestMatch[1]
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (manifestIds.length === 0) {
    errors.push("glossary.md: knowledge-atom-ids manifest is empty");
  }

  const registryIds = new Set<string>(KNOWLEDGE_ATOM_IDS);
  for (const id of manifestIds) {
    if (!registryIds.has(id)) {
      errors.push(
        `glossary.md: manifest atom "${id}" is not in KNOWLEDGE_ATOM_IDS registry`
      );
    }
  }

  for (const id of KNOWLEDGE_ATOM_IDS) {
    if (!manifestIds.includes(id)) {
      errors.push(
        `glossary.md: manifest missing registry atom "${id}" (full parity required)`
      );
    }
  }

  const unique = new Set(manifestIds);
  if (unique.size !== manifestIds.length) {
    errors.push(
      "glossary.md: duplicate atom IDs in knowledge-atom-ids manifest"
    );
  }
} else {
  errors.push(
    "glossary.md: missing <!-- knowledge-atom-ids: ... --> manifest comment"
  );
}

if (errors.length > 0) {
  console.error("glossary-knowledge-sync: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("glossary-knowledge-sync: PASS");
