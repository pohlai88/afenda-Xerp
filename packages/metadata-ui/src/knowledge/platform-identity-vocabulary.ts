/**
 * PAS-004B — metadata-ui consumes accepted platform identity meaning via metadata only.
 * Do not add a direct runtime dependency on the enterprise-knowledge package (layer boundary).
 */
export {
  isPlatformIdentityKnowledgeAtomId,
  PLATFORM_IDENTITY_KNOWLEDGE_ATOM_IDS,
  type PlatformIdentityKnowledgeAtomId,
  resolvePlatformIdentityKnowledgeBusinessTitle,
  resolvePlatformIdentityKnowledgeCanonicalDefinition,
  resolvePlatformIdentityKnowledgeLabel,
} from "@afenda/metadata";
