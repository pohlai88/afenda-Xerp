/**
 * Canonical governance import surface for @afenda/enterprise-knowledge.
 *
 * Governance scripts import package `src/` via relative paths (same pattern as
 * database and architecture-authority gates). This module centralizes those
 * paths so constants and query helpers stay aligned with the package authority.
 */

export { KNOWLEDGE_REGISTRY_LOADER_MAX_LINES } from "../../../packages/enterprise-knowledge/src/constants/knowledge-json-authority.ts";
export { ENTERPRISE_KNOWLEDGE_ATOMS } from "../../../packages/enterprise-knowledge/src/data/knowledge.registry.ts";
export {
  isPlatformIdentityAtomId,
  PLATFORM_IDENTITY_ATOM_IDS,
  validateKnowledgeKernelIdentityMapping,
} from "../../../packages/enterprise-knowledge/src/policy/knowledge-kernel-identity-mapping.policy.ts";
export {
  getKnowledgeAtomsByDomain,
  getKnowledgeEdgesFrom,
  getSupersessionChain,
  resolveAcceptanceGraphRoots,
} from "../../../packages/enterprise-knowledge/src/query/knowledge-graph.query.ts";
