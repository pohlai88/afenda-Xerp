#!/usr/bin/env tsx
/**
 * PAS-004D §4.3 — B51: semantic corpus depth gate.
 *
 * Validates:
 * 1. ≥3 perspectives each for tenant, legal_entity, organization_unit.
 * 2. ≥6 atoms with contextualValidity in parsed corpus.
 * 3. ≥8 entries in KNOWLEDGE_EDGES.
 * 4. Platform identity + accounting invariant atoms have realizationMapping
 *    and NO implementationMapping at loader boundary.
 */

import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
import { KNOWLEDGE_EDGES } from "../../packages/enterprise-knowledge/src/data/knowledge-edge.registry.ts";
import { ENTERPRISE_KNOWLEDGE_PERSPECTIVES } from "../../packages/enterprise-knowledge/src/policy/knowledge-perspective.policy.ts";
import {
  formatKnowledgeCorpusDepthErrors,
  KNOWLEDGE_CORPUS_DEPTH_RULE,
  validateKnowledgeCorpusDepth,
} from "../../packages/enterprise-knowledge/src/policy/knowledge-corpus-depth.policy.ts";

export function checkKnowledgeCorpusDepth(): string[] {
  return [
    ...validateKnowledgeCorpusDepth(
      ENTERPRISE_KNOWLEDGE_ATOMS,
      ENTERPRISE_KNOWLEDGE_PERSPECTIVES,
      KNOWLEDGE_EDGES
    ),
  ];
}

function main(): void {
  const errors = checkKnowledgeCorpusDepth();

  if (errors.length > 0) {
    console.error(formatKnowledgeCorpusDepthErrors(errors));
    console.error(`corpus-depth-rule: ${KNOWLEDGE_CORPUS_DEPTH_RULE}`);
    process.exit(1);
  }

  console.log(formatKnowledgeCorpusDepthErrors(errors));
  console.log(`corpus-depth-rule: ${KNOWLEDGE_CORPUS_DEPTH_RULE}`);
}

main();
