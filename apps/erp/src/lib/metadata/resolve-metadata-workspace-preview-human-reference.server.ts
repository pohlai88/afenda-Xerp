import {
  METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS,
  resolveMetadataTenantHumanReferenceScopeLabel,
} from "@afenda/metadata-ui";

import {
  METADATA_WORKSPACE_PREVIEW_HUMAN_REFERENCE_FIXTURES,
  type MetadataWorkspacePreviewHumanReferenceRow,
} from "./metadata-workspace-preview-human-reference.contract.js";
import {
  normalizeMetadataTenantHumanReferenceAtBoundary,
  parseMetadataTenantHumanReferenceAtBoundary,
} from "./resolve-metadata-tenant-human-reference.server.js";

/** Parses preview fixtures at the ERP/kernel trust boundary for metadata diagnostics. */
export function resolveMetadataWorkspacePreviewHumanReferenceRows(): readonly MetadataWorkspacePreviewHumanReferenceRow[] {
  return METADATA_WORKSPACE_PREVIEW_HUMAN_REFERENCE_FIXTURES.map((fixture) => {
    const branded = parseMetadataTenantHumanReferenceAtBoundary(
      fixture.scope,
      fixture.wireValue
    );
    const wireValue = normalizeMetadataTenantHumanReferenceAtBoundary(
      fixture.scope,
      branded
    );

    return {
      scopeLabel: resolveMetadataTenantHumanReferenceScopeLabel(fixture.scope),
      column: METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS[fixture.scope],
      wireValue,
    };
  });
}
