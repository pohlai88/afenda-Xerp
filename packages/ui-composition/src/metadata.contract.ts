import { METADATA_LIFECYCLES } from "./metadata.constants.js";
import type { MetadataLifecycle } from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const METADATA_CONTRACT_OWNERSHIPS = [
  "metadata-vocabulary",
  "metadata-identity",
  "metadata-lifecycle",
  "metadata-governance",
  "metadata-authority-identity",
] as const;

export type MetadataContractOwnership =
  (typeof METADATA_CONTRACT_OWNERSHIPS)[number];

export const METADATA_CONTRACT_GOVERNANCE_RULES = [
  "governed-arrays-are-sole-source-of-metadata-vocabulary",
  "contract-version-must-bump-when-authority-changes",
  "tests-must-verify-every-governed-array-change",
  "downstream-packages-must-consume-metadata-contracts",
  "metadata-ui-must-not-redefine-governed-arrays",
] as const;

export type MetadataContractGovernanceRule =
  (typeof METADATA_CONTRACT_GOVERNANCE_RULES)[number];

export const METADATA_CONTRACT_PROHIBITIONS = [
  "ui-implementation",
  "react-components",
  "renderers",
  "renderer-implementation",
  "css",
  "tailwind",
  "design-tokens",
  "business-logic",
  "database-access",
  "database-schemas",
  "permission-execution",
  "auth-services",
  "observability-services",
] as const;

export type MetadataContractProhibition =
  (typeof METADATA_CONTRACT_PROHIBITIONS)[number];

export interface MetadataContract {
  readonly authority: "metadata";

  /**
   * Machine-readable governance rules for CI and package-boundary checks.
   */
  readonly governance: readonly MetadataContractGovernanceRule[];

  /**
   * Governed lifecycle vocabulary exposed by the metadata authority.
   */
  readonly lifecycle: readonly MetadataLifecycle[];

  /**
   * Canonical ownership scope of the metadata authority.
   *
   * This package owns metadata vocabulary and governance only.
   * It must not become a UI, renderer, database, auth, or business package.
   */
  readonly owns: readonly MetadataContractOwnership[];

  /**
   * Explicitly forbidden responsibilities for @afenda/ui-composition.
   */
  readonly prohibits: readonly MetadataContractProhibition[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const metadataContract = {
  authority: "metadata",
  version: METADATA_CONTRACT_VERSION,

  owns: METADATA_CONTRACT_OWNERSHIPS,

  lifecycle: METADATA_LIFECYCLES,

  governance: METADATA_CONTRACT_GOVERNANCE_RULES,

  prohibits: METADATA_CONTRACT_PROHIBITIONS,
} as const satisfies MetadataContract;
