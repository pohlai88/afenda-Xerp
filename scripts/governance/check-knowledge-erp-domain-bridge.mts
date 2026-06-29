#!/usr/bin/env tsx
/**
 * PAS-004D §4.5 — B53: ERP-domain meaning bridge gate.
 *
 * Validates:
 * 1. Required B53 bridge atom IDs exist in corpus.
 * 2. Each has kernel realizationMapping under packages/kernel/src/erp-domain/.
 * 3. Each cites KV-INV or KV-PROC in realizationMapping notes (not slug-only).
 * 4. Referenced contract paths exist on disk (*.contract.ts only; no parsers).
 * 5. Bridge policy module does not import @afenda/database.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import {
  formatKnowledgeErpDomainBridgeErrors,
  KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE,
  validateKnowledgeErpDomainBridge,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-erp-domain-bridge.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const bridgePolicyPath = join(
  repoRoot,
  "packages/enterprise-knowledge/src/policy/knowledge-erp-domain-bridge.policy.ts"
);

export function checkKnowledgeErpDomainBridge(): string[] {
  const errors: string[] = [];

  const policySource = readFileSync(bridgePolicyPath, "utf8");
  if (policySource.includes("@afenda/database")) {
    errors.push(
      "knowledge-erp-domain-bridge.policy.ts must not import @afenda/database"
    );
  }

  errors.push(
    ...validateKnowledgeErpDomainBridge(ENTERPRISE_KNOWLEDGE_ATOMS, {
      repoRoot,
    })
  );

  return errors;
}

function main(): void {
  const errors = checkKnowledgeErpDomainBridge();

  if (errors.length > 0) {
    console.error(formatKnowledgeErpDomainBridgeErrors(errors));
    console.error(`bridge-rule: ${KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE}`);
    process.exit(1);
  }

  console.log(formatKnowledgeErpDomainBridgeErrors(errors));
  console.log(`bridge-rule: ${KNOWLEDGE_ERP_DOMAIN_BRIDGE_RULE}`);
}

main();
