/**
 * Metadata workspace preview — live tenant human reference wire fixtures (ADR-0023).
 *
 * Only scopes with `persistenceStatus: "live"` in `@afenda/database` registry.
 */

import type { MetadataTenantHumanReferenceFieldBinding } from "@afenda/metadata-ui";

export const METADATA_WORKSPACE_PREVIEW_HUMAN_REFERENCE_FIXTURES = [
  {
    scope: "sku",
    wireValue: "LETTUCE-ROMAINE-001",
  },
  {
    scope: "warehouse",
    wireValue: "WH-KL-01",
  },
] as const satisfies readonly MetadataTenantHumanReferenceFieldBinding[];

export type MetadataWorkspacePreviewHumanReferenceFixture =
  (typeof METADATA_WORKSPACE_PREVIEW_HUMAN_REFERENCE_FIXTURES)[number];

export interface MetadataWorkspacePreviewHumanReferenceRow {
  readonly column: string;
  readonly scopeLabel: string;
  readonly wireValue: string;
}
