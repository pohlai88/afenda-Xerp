#!/usr/bin/env tsx
/**
 * PAS-004B §4.1 — B33: Kernel identity constitution mapping gate.
 *
 * Validates platform identity atoms cite ADR-0021 identity surfaces — never
 * parser/assert modules — with structured brandedId + contractPath fields.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  PLATFORM_IDENTITY_ATOM_IDS,
  validateKnowledgeKernelIdentityMapping,
} from "./shared/enterprise-knowledge-governance.imports.mts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = validateKnowledgeKernelIdentityMapping(
  ENTERPRISE_KNOWLEDGE_ATOMS,
  { repoRoot }
);

if (errors.length > 0) {
  console.error("knowledge-kernel-identity-mapping: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(
  `knowledge-kernel-identity-mapping: PASS (${PLATFORM_IDENTITY_ATOM_IDS.length} platform identity atoms)`
);
