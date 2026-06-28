#!/usr/bin/env tsx
/**
 * PAS-004A §4.1 — B25: JSON data authority gate.
 *
 * Validates:
 * 1. atoms.json and edges.json are valid JSON.
 * 2. JSON schema (structural + constitutional rules) passes.
 * 3. knowledge.registry.ts is a thin loader (no inline atom literals).
 * 4. edges.json atom refs resolve to known atomIds.
 * 5. 12 B24 atom IDs are all present (no renames).
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  validateAtomCorpus,
  validateEdgeCorpus,
} from "../../packages/enterprise-knowledge/src/data/knowledge-data.schema.ts";
import { KNOWLEDGE_REGISTRY_LOADER_MAX_LINES } from "./shared/enterprise-knowledge-governance.imports.mts";

const B24_ATOM_IDS = [
  "legal_entity",
  "organization_unit",
  "workspace",
  "surface",
  "payload",
  "invariant",
  "contract",
  "metadata",
  "double_entry",
  "accounting_equation",
  "organization_split",
  "ifrs_10",
] as const;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(repoRoot, "packages/enterprise-knowledge/src/data");
const loaderPath = join(dataDir, "knowledge.registry.ts");

const errors: string[] = [];
let atomIds = new Set<string>();

// ── 1. atoms.json valid JSON ──────────────────────────────────────────────
let atomsRaw: unknown[];
try {
  const text = readFileSync(join(dataDir, "atoms.json"), "utf8");
  atomsRaw = JSON.parse(text) as unknown[];
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  errors.push(`atoms.json: invalid JSON — ${message}`);
  atomsRaw = [];
}

// ── 2. atoms.json schema validation ──────────────────────────────────────
const atomErrors = validateAtomCorpus(atomsRaw);
for (const e of atomErrors) {
  errors.push(`atoms.json schema: ${e.path} — ${e.message}`);
}
atomIds = new Set(
  atomsRaw
    .filter((r): r is { atomId: string } => typeof (r as Record<string, unknown>).atomId === "string")
    .map((r) => r.atomId)
);

// ── 3. B24 atom ID preservation ──────────────────────────────────────────
for (const id of B24_ATOM_IDS) {
  if (!atomIds.has(id)) {
    errors.push(`atoms.json: B24 atom ID "${id}" is missing — rename requires a supersession slice`);
  }
}
if (atomsRaw.length < B24_ATOM_IDS.length) {
  errors.push(
    `atoms.json: expected at least ${B24_ATOM_IDS.length} atoms, found ${atomsRaw.length}`
  );
}

const jsonAtomIds = atomsRaw
  .filter((r): r is { atomId: string } => typeof (r as Record<string, unknown>).atomId === "string")
  .map((r) => r.atomId);
const b24Prefix = jsonAtomIds.slice(0, B24_ATOM_IDS.length);
if (b24Prefix.join(",") !== B24_ATOM_IDS.join(",")) {
  errors.push(
    "atoms.json: B24 atomId prefix order diverges from frozen B24_KNOWLEDGE_ATOM_IDS — update via supersession slice only"
  );
}

// ── 4. edges.json valid JSON ──────────────────────────────────────────────
let edgesRaw: unknown[];
try {
  const text = readFileSync(join(dataDir, "edges.json"), "utf8");
  edgesRaw = JSON.parse(text) as unknown[];
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  errors.push(`edges.json: invalid JSON — ${message}`);
  edgesRaw = [];
}

// ── 5. edges.json schema + atomId cross-reference ────────────────────────
const edgeErrors = validateEdgeCorpus(edgesRaw, atomIds);
for (const e of edgeErrors) {
  errors.push(`edges.json schema: ${e.path} — ${e.message}`);
}

// ── 6. loader is thin (no inline atoms) ──────────────────────────────────
try {
  const loaderSrc = readFileSync(loaderPath, "utf8");
  const lines = loaderSrc.split("\n");
  if (lines.length > KNOWLEDGE_REGISTRY_LOADER_MAX_LINES) {
    errors.push(
      `knowledge.registry.ts: ${lines.length} lines — exceeds ${KNOWLEDGE_REGISTRY_LOADER_MAX_LINES}-line thin-loader limit (PAS-004A §8). Inline atoms detected or loader too large.`
    );
  }
  if (/atomId:\s*["']/.test(loaderSrc) || /acceptanceChain:/.test(loaderSrc)) {
    errors.push("knowledge.registry.ts: contains inline atom literal — corpus must live in atoms.json");
  }
  if (!/parseAtomCorpus\(/.test(loaderSrc)) {
    errors.push("knowledge.registry.ts: must load atoms via parseAtomCorpus() after JSON validation");
  }
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  errors.push(`knowledge.registry.ts: could not read — ${message}`);
}

// ── Result ────────────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error("check:knowledge-json-authority: FAIL");
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(
  `check:knowledge-json-authority: PASS — ${atomsRaw.length} atoms, ${edgesRaw.length} edges, loader is thin`
);
