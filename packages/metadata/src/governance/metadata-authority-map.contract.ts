import { ACTION_CONTRACT_OWNERSHIPS } from "../action.contract.js";
import { LAYOUT_CONTRACT_OWNERSHIPS } from "../layout.contract.js";
import { METADATA_CONTRACT_OWNERSHIPS } from "../metadata.contract.js";
import type { MetadataAuthorityKey } from "../metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import { PRESENTATION_CONTRACT_OWNERSHIPS } from "../presentation.contract.js";
import { REGISTRY_CONTRACT_OWNERSHIPS } from "../registry.contract.js";
import { RENDERER_CONTRACT_OWNERSHIPS } from "../renderer.contract.js";
import { RUNTIME_CONTRACT_OWNERSHIPS } from "../runtime.contract.js";
import { SECTION_CONTRACT_OWNERSHIPS } from "../section.contract.js";
import { SURFACE_CONTRACT_OWNERSHIPS } from "../surface.contract.js";

export const METADATA_AUTHORITY_CONSUMERS = [
  "@afenda/metadata-ui",
] as const;

export type MetadataAuthorityConsumer =
  (typeof METADATA_AUTHORITY_CONSUMERS)[number];

/** Union of every domain contract ownership key — derived from domain contracts. */
export const METADATA_AUTHORITY_OWNERSHIPS = [
  ...METADATA_CONTRACT_OWNERSHIPS,
  ...SURFACE_CONTRACT_OWNERSHIPS,
  ...LAYOUT_CONTRACT_OWNERSHIPS,
  ...SECTION_CONTRACT_OWNERSHIPS,
  ...RENDERER_CONTRACT_OWNERSHIPS,
  ...REGISTRY_CONTRACT_OWNERSHIPS,
  ...PRESENTATION_CONTRACT_OWNERSHIPS,
  ...RUNTIME_CONTRACT_OWNERSHIPS,
  ...ACTION_CONTRACT_OWNERSHIPS,
] as const;

export type MetadataAuthorityOwnership =
  (typeof METADATA_AUTHORITY_OWNERSHIPS)[number];

export const METADATA_AUTHORITY_PROHIBITIONS = [
  "ui-implementation",
  "react-components",
  "renderers",
  "renderer-implementation",
  "renderer-behavior",
  "rendering-implementation",

  "design-tokens",
  "component-styling",
  "visual-styling",
  "ui-components",

  "business-logic",
  "database-schemas",
  "database-access",
  "permission-execution",
  "auth-services",
  "observability-services",

  "layout-arrangements",
  "section-definitions",
] as const;

export type MetadataAuthorityProhibition =
  (typeof METADATA_AUTHORITY_PROHIBITIONS)[number];

export const METADATA_AUTHORITY_CHANGE_RULES = [
  "requires-adr-contract-version-bump-and-governance-tests",
  "requires-surface-types-change-and-contract-version-bump",
  "requires-layout-types-change-and-contract-version-bump",
  "requires-section-types-change-and-contract-version-bump",
  "requires-renderer-compatibility-rules-change-and-contract-version-bump",
  "requires-registry-entry-contract-change-and-contract-version-bump",
  "requires-presentation-modes-or-density-modes-change-and-contract-version-bump",
  "requires-runtime-context-change-and-contract-version-bump",
  "requires-action-vocabulary-change-and-contract-version-bump",
] as const;

export type MetadataAuthorityChangeRule =
  (typeof METADATA_AUTHORITY_CHANGE_RULES)[number];

export interface MetadataAuthorityEntry {
  readonly authority: MetadataAuthorityKey;

  /**
   * Canonical responsibilities owned by this authority.
   *
   * These are machine-readable governance keys.
   * Human explanation belongs in documentation, not in this contract.
   */
  readonly owns: readonly MetadataAuthorityOwnership[];

  /**
   * Responsibilities this authority is explicitly forbidden from owning.
   */
  readonly doesNotOwn: readonly MetadataAuthorityProhibition[];

  /**
   * Primary downstream implementation consumer.
   */
  readonly downstreamConsumer: MetadataAuthorityConsumer;

  /**
   * Required governance process when this authority changes.
   */
  readonly changeRule: MetadataAuthorityChangeRule;
}

export type MetadataAuthorityMap = {
  readonly [Key in MetadataAuthorityKey]: MetadataAuthorityEntry & {
    readonly authority: Key;
  };
};

export const metadataAuthorityMap = {
  metadata: {
    authority: "metadata",
    owns: METADATA_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "ui-implementation",
      "react-components",
      "renderers",
      "design-tokens",
      "business-logic",
      "database-schemas",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-adr-contract-version-bump-and-governance-tests",
  },

  surface: {
    authority: "surface",
    owns: SURFACE_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "section-definitions",
      "renderers",
      "visual-styling",
      "layout-arrangements",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-surface-types-change-and-contract-version-bump",
  },

  layout: {
    authority: "layout",
    owns: LAYOUT_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "visual-styling",
      "renderer-behavior",
      "section-definitions",
      "ui-components",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-layout-types-change-and-contract-version-bump",
  },

  section: {
    authority: "section",
    owns: SECTION_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "layout-arrangements",
      "renderer-implementation",
      "visual-styling",
      "database-access",
      "business-logic",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-section-types-change-and-contract-version-bump",
  },

  renderer: {
    authority: "renderer",
    owns: RENDERER_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "renderer-implementation",
      "business-logic",
      "database-access",
      "ui-components",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule:
      "requires-renderer-compatibility-rules-change-and-contract-version-bump",
  },

  registry: {
    authority: "registry",
    owns: REGISTRY_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "rendering-implementation",
      "ui-components",
      "business-logic",
      "database-access",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule:
      "requires-registry-entry-contract-change-and-contract-version-bump",
  },

  presentation: {
    authority: "presentation",
    owns: PRESENTATION_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "design-tokens",
      "component-styling",
      "visual-styling",
      "ui-components",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule:
      "requires-presentation-modes-or-density-modes-change-and-contract-version-bump",
  },

  runtime: {
    authority: "runtime",
    owns: RUNTIME_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "permission-execution",
      "database-access",
      "auth-services",
      "observability-services",
      "business-logic",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-runtime-context-change-and-contract-version-bump",
  },

  action: {
    authority: "action",
    owns: ACTION_CONTRACT_OWNERSHIPS,
    doesNotOwn: [
      "permission-execution",
      "audit-writing",
      "renderer-implementation",
      "ui-implementation",
      "business-logic",
      "database-access",
    ],
    downstreamConsumer: "@afenda/metadata-ui",
    changeRule: "requires-action-vocabulary-change-and-contract-version-bump",
  },
} as const satisfies MetadataAuthorityMap;

export const METADATA_AI_GOVERNANCE_MAY = [
  "consume-approved-metadata-contracts",
  "generate-schemas-from-governed-arrays",
  "implement-renderers-in-metadata-ui",
  "create-metadata-governance-tests",
] as const;

export type MetadataAiGovernanceMay =
  (typeof METADATA_AI_GOVERNANCE_MAY)[number];

export const METADATA_AI_GOVERNANCE_MAY_NOT = [
  "invent-new-metadata-authority-domains",
  "invent-surface-types-outside-surface-types",
  "invent-layout-types-outside-layout-types",
  "invent-section-types-outside-section-types",
  "invent-registry-architecture-outside-registry-contract",
  "invent-runtime-architecture-outside-runtime-contract",
  "merge-metadata-with-metadata-ui",
  "add-react-css-renderer-database-or-business-logic-to-metadata",
] as const;

export type MetadataAiGovernanceMayNot =
  (typeof METADATA_AI_GOVERNANCE_MAY_NOT)[number];

export const METADATA_AI_GOVERNANCE_MUST = [
  "update-contract-version-when-authority-changes",
  "update-tests-when-governed-arrays-change",
  "update-readme-when-ownership-changes",
  "keep-metadata-governance-separate-from-metadata-ui-implementation",
] as const;

export type MetadataAiGovernanceMust =
  (typeof METADATA_AI_GOVERNANCE_MUST)[number];

export interface MetadataAiGovernanceRules {
  readonly version: typeof METADATA_CONTRACT_VERSION;
  readonly may: readonly MetadataAiGovernanceMay[];
  readonly mayNot: readonly MetadataAiGovernanceMayNot[];
  readonly must: readonly MetadataAiGovernanceMust[];
}

export const metadataAiGovernanceRules = {
  version: METADATA_CONTRACT_VERSION,
  may: METADATA_AI_GOVERNANCE_MAY,
  mayNot: METADATA_AI_GOVERNANCE_MAY_NOT,
  must: METADATA_AI_GOVERNANCE_MUST,
} as const satisfies MetadataAiGovernanceRules;
