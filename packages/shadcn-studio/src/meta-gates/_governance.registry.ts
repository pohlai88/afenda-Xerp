/**
 * @afenda.governance-envelope governance-inventory
 * Role: Sole governance inventory SSOT — envelope file list + UI primitive slug list
 * Family: governance-inventory
 * Relies on: (none — pure inventory)
 * Relied on by: index, block-metadata.registry, ui-primitive-metadata.registry, check:studio-governance-envelope, check:studio-ui-primitive-metadata
 * Refactored: 2026-07-01 · series flat-governance
 * Gate: check:studio-governance-envelope
 */

export const GOVERNANCE_ENVELOPE_MARKER =
  "@afenda.governance-envelope" as const;

export const GOVERNANCE_ENVELOPE_SERIES = "flat-governance" as const;

export const GOVERNANCE_ENVELOPE_REFACTORED = "2026-07-01" as const;

export const GOVERNANCE_ENVELOPE_GATE =
  "check:studio-governance-envelope" as const;

/** Meta file — excluded from governance/ envelope scans. */
export const GOVERNANCE_REGISTRY_EXCLUDED = ["_governance.registry.ts"] as const;

export const UI_PRIMITIVE_METADATA_MARKER = GOVERNANCE_ENVELOPE_MARKER;

export const UI_PRIMITIVE_METADATA_SERIES = GOVERNANCE_ENVELOPE_SERIES;

export const UI_PRIMITIVE_METADATA_REFACTORED = GOVERNANCE_ENVELOPE_REFACTORED;

export const UI_PRIMITIVE_METADATA_GATE =
  "check:studio-ui-primitive-metadata" as const;

export type GovernanceEnvelope = {
  readonly file: string;
  readonly family: string;
  readonly role: string;
  readonly reliesOn: readonly string[];
  readonly reliedOnBy: readonly string[];
  readonly refactored: typeof GOVERNANCE_ENVELOPE_REFACTORED;
};

/** Envelope-registered governance/ source files (aggregators + barrel — not this meta file). */
export const GOVERNANCE_ENVELOPE_REGISTRY = [
  {
    file: "index.ts",
    family: "governance-barrel",
    role: "@afenda/shadcn-studio/governance subpath exports",
    reliesOn: [
      "block-metadata.registry",
      "ui-primitive-metadata.registry",
      "_governance.registry",
      "registry/assert-block-slot-dom-marker-coverage",
    ],
    reliedOnBy: [
      "scripts/governance/check-studio-*",
      "package.json ./governance export",
    ],
    refactored: GOVERNANCE_ENVELOPE_REFACTORED,
  },
  {
    file: "block-metadata.registry.ts",
    family: "block-metadata",
    role: "Runtime aggregator — BLOCK_METADATA_REGISTRY from registry/block-slot",
    reliesOn: [
      "contracts/block-metadata.builders",
      "contracts/block-metadata.contract",
      "registry/block-slot.registry",
    ],
    reliedOnBy: [
      "governance/index",
      "check:studio-block-contracts",
      "blocks/__tests__/metadata-bound-blocks.render.test",
    ],
    refactored: GOVERNANCE_ENVELOPE_REFACTORED,
  },
  {
    file: "ui-primitive-metadata.registry.ts",
    family: "ui-primitive-metadata",
    role: "Runtime aggregator — UI_PRIMITIVE_METADATA_REGISTRY from L2 contracts",
    reliesOn: ["_governance.registry", "components-ui/*.contract"],
    reliedOnBy: [
      "governance/index",
      "check:studio-ui-primitive-metadata",
    ],
    refactored: GOVERNANCE_ENVELOPE_REFACTORED,
  },
] as const satisfies readonly GovernanceEnvelope[];

export const GOVERNANCE_ENVELOPE_FILES = GOVERNANCE_ENVELOPE_REGISTRY.map(
  (entry) => entry.file
);

/** Every governed `components-ui/{slug}.contract.ts` stem (sorted). */
export const UI_PRIMITIVE_CONTRACT_SLUGS = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "attachment",
  "avatar",
  "background-ripple",
  "badge",
  "bg-dot-grid",
  "bg-silk",
  "border-beam",
  "breadcrumb",
  "bubble",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "category-bar",
  "chart",
  "checkbox",
  "circular-progress",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "marker",
  "menubar",
  "message",
  "message-scroller",
  "native-select",
  "navigation-menu",
  "number-ticker",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "rating",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "timeline",
  "toggle",
  "toggle-group",
  "tooltip",
] as const;

export type UiPrimitiveContractSlug =
  (typeof UI_PRIMITIVE_CONTRACT_SLUGS)[number];

export const UI_PRIMITIVE_ID_PREFIX = "shadcn-studio.ui." as const;

export const UI_PRIMITIVE_GOLD_VERSION = "1.2.0" as const;

export type GovernanceEnvelopeInventoryDiff = {
  readonly registeredCount: number;
  readonly discoveredCount: number;
  readonly missingOnDisk: readonly string[];
  readonly discoveredOnly: readonly string[];
};

export type UiPrimitiveMetadataInventoryDiff = {
  readonly registeredCount: number;
  readonly discoveredCount: number;
  readonly missingOnDisk: readonly string[];
  readonly discoveredOnly: readonly string[];
};

export function diffGovernanceEnvelopeRegistry(
  discoveredFiles: readonly string[]
): GovernanceEnvelopeInventoryDiff {
  const registered = GOVERNANCE_ENVELOPE_FILES;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredFiles);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredFiles.length,
    missingOnDisk: registered.filter((file) => !discoveredSet.has(file)),
    discoveredOnly: discoveredFiles.filter((file) => !registeredSet.has(file)),
  };
}

export function assertGovernanceEnvelopeRegistryComplete(
  discoveredFiles: readonly string[]
): boolean {
  const diff = diffGovernanceEnvelopeRegistry(discoveredFiles);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function formatGovernanceEnvelopeInventoryDiff(
  diff: GovernanceEnvelopeInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(
      `unregistered on disk: ${diff.discoveredOnly.join(", ")} — add to _governance.registry.ts + envelope header`
    );
  }

  return lines.join(" · ");
}

export function toUiPrimitiveId(
  slug: UiPrimitiveContractSlug
): `${typeof UI_PRIMITIVE_ID_PREFIX}${UiPrimitiveContractSlug}` {
  return `${UI_PRIMITIVE_ID_PREFIX}${slug}`;
}

export function diffUiPrimitiveMetadataRegistry(
  discoveredSlugs: readonly string[]
): UiPrimitiveMetadataInventoryDiff {
  const registered = UI_PRIMITIVE_CONTRACT_SLUGS;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredSlugs);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredSlugs.length,
    missingOnDisk: registered.filter((slug) => !discoveredSet.has(slug)),
    discoveredOnly: discoveredSlugs.filter((slug) => !registeredSet.has(slug)),
  };
}

export function assertUiPrimitiveMetadataRegistryComplete(
  discoveredSlugs: readonly string[]
): boolean {
  const diff = diffUiPrimitiveMetadataRegistry(discoveredSlugs);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function formatUiPrimitiveMetadataInventoryDiff(
  diff: UiPrimitiveMetadataInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(
      `unregistered on disk: ${diff.discoveredOnly.join(", ")} — add slug to _governance.registry.ts + factory import in ui-primitive-metadata.registry.ts`
    );
  }

  return lines.join(" · ");
}
