/**
 * Metadata UI package governance contract.
 *
 * Authority:
 * - Defines package-level ownership and boundary rules for @afenda/metadata-ui.
 * - Does not define metadata vocabulary — that belongs to @afenda/metadata.
 */

import { METADATA_CONTRACT_VERSION } from "@afenda/metadata";

export const METADATA_UI_CONTRACT_VERSION = "0.1.0" as const;

export const METADATA_UI_PACKAGE_NAME = "@afenda/metadata-ui" as const;

export const METADATA_UI_AUTHORITY = "metadata-ui" as const;

export const METADATA_UI_CONSUMES = ["@afenda/metadata"] as const;

export const METADATA_UI_OWNS = [
  "metadata rendering",
  "surface composition",
  "layout rendering",
  "section rendering",
  "renderer resolution",
  "renderer registry",
  "presentation resolution",
  "metadata diagnostics presentation",
  "metadata render context",
  "metadata UI accessibility contracts",
  "metadata UI server/client boundaries",
] as const;

export const METADATA_UI_DOES_NOT_OWN = [
  "metadata authority",
  "metadata vocabulary",
  "surface vocabulary",
  "layout vocabulary",
  "section vocabulary",
  "renderer vocabulary",
  "permission execution",
  "authorization decisions",
  "server action execution",
  "session verification",
  "database schemas",
  "ERP business rules",
  "AppShell navigation",
  "design tokens",
  "React primitive design authority",
] as const;

export const METADATA_UI_PROHIBITS = [
  "defining metadata vocabulary",
  "defining design tokens",
  "executing database writes directly",
  "executing permission decisions directly",
  "executing server actions directly",
  "owning ERP business rules",
  "owning AppShell route navigation",
  "declaring package-level dependency on ERP app code",
] as const;

export interface MetadataUiContract {
  readonly authority: typeof METADATA_UI_AUTHORITY;

  /**
   * Upstream governance packages consumed by metadata-ui.
   */
  readonly consumes: typeof METADATA_UI_CONSUMES;

  /**
   * Responsibilities explicitly not owned by @afenda/metadata-ui.
   */
  readonly doesNotOwn: typeof METADATA_UI_DOES_NOT_OWN;

  /**
   * Version of the upstream metadata authority contract this package expects.
   */
  readonly metadataContractVersion: typeof METADATA_CONTRACT_VERSION;

  /**
   * Responsibilities owned by @afenda/metadata-ui.
   */
  readonly owns: typeof METADATA_UI_OWNS;
  readonly packageName: typeof METADATA_UI_PACKAGE_NAME;

  /**
   * Hard boundary prohibitions.
   */
  readonly prohibits: typeof METADATA_UI_PROHIBITS;
  readonly version: typeof METADATA_UI_CONTRACT_VERSION;
}

export const metadataUiContract = {
  packageName: METADATA_UI_PACKAGE_NAME,
  authority: METADATA_UI_AUTHORITY,
  version: METADATA_UI_CONTRACT_VERSION,
  consumes: METADATA_UI_CONSUMES,
  metadataContractVersion: METADATA_CONTRACT_VERSION,
  owns: METADATA_UI_OWNS,
  doesNotOwn: METADATA_UI_DOES_NOT_OWN,
  prohibits: METADATA_UI_PROHIBITS,
} as const satisfies MetadataUiContract;
