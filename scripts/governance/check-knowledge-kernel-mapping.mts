#!/usr/bin/env tsx
/**
 * PAS-004A §4.2 — B26: Kernel mapping + accepting authority lint gate.
 *
 * Validates:
 * 1. Atoms with implementationMapping cite existing kernel contract evidence paths.
 * 2. No atom evidence references *.parser.ts under packages/kernel.
 * 3. Every acceptanceChain.by resolves via AcceptingAuthorityRegistry (incl. legacy aliases).
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isResolvableAcceptingAuthorityRef } from "../../packages/enterprise-knowledge/src/data/accepting-authority.registry.ts";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import { validateKnowledgeKernelMapping } from "../../packages/enterprise-knowledge/src/policy/knowledge-kernel-mapping.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors: string[] = [];

errors.push(
  ...validateKnowledgeKernelMapping(ENTERPRISE_KNOWLEDGE_ATOMS, { repoRoot })
);

for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
  for (const entry of atom.acceptanceChain) {
    if (!isResolvableAcceptingAuthorityRef(entry.by)) {
      errors.push(
        `${atom.atomId}: acceptanceChain references unknown authority "${entry.by}"`
      );
    }
  }
}

if (errors.length > 0) {
  console.error("knowledge-kernel-mapping: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("knowledge-kernel-mapping: PASS");
