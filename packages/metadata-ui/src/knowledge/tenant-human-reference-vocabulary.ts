import {
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS,
  type MetadataTenantHumanReferenceScope,
} from "@afenda/ui-composition";

import { resolvePlatformIdentityKnowledgeLabel } from "./platform-identity-vocabulary.js";

/** PAS-004 human_reference atom — metadata consumer profile wording. */
export function resolveMetadataTenantHumanReferenceConceptLabel(): string {
  return resolvePlatformIdentityKnowledgeLabel("human_reference");
}

export function resolveMetadataTenantHumanReferenceScopeLabel(
  scope: MetadataTenantHumanReferenceScope
): string {
  return METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS[scope];
}
