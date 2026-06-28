import type { PlatformIdentityKnowledgeAtomId } from "./platform-identity-vocabulary.js";
import { resolvePlatformIdentityKnowledgeLabel } from "./platform-identity-vocabulary.js";

/** Scope dimensions shown in metadata workspace / operating-context surfaces. */
export const METADATA_PLATFORM_IDENTITY_DIMENSION_ATOM_IDS = [
  "tenant",
  "legal_entity",
  "organization_unit",
  "workspace",
] as const satisfies readonly PlatformIdentityKnowledgeAtomId[];

export type MetadataPlatformIdentityDimensionAtomId =
  (typeof METADATA_PLATFORM_IDENTITY_DIMENSION_ATOM_IDS)[number];

/** Afenda-preferred dimension label from authoritative Knowledge Atoms (via metadata). */
export function resolveMetadataPlatformIdentityDimensionLabel(
  atomId: MetadataPlatformIdentityDimensionAtomId
): string {
  return resolvePlatformIdentityKnowledgeLabel(atomId);
}
