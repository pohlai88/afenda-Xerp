/**
 * L1 contracts inventory SSOT — flat `meta-contracts/` only (no `blocks/` per-block files).
 * Gate: `pnpm check:studio-l1-contracts`
 */

export const L1_CONTRACT_ENVELOPE_MARKER = "@afenda.l1-contract-envelope" as const;

export const L1_CONTRACT_ENVELOPE_SERIES = "flat-L1" as const;

export const L1_CONTRACT_ENVELOPE_REFACTORED = "2026-07-01" as const;

/** Paths under `meta-contracts/` that must not reappear after flat-series refactor. */
export const FORBIDDEN_L1_CONTRACT_PATHS = [
  "blocks/",
  "erp-shell.contract.ts",
  "block-governance.contract.ts",
] as const;

export type L1ContractEnvelope = {
  readonly file: string;
  readonly family: string;
  readonly role: string;
  readonly reliesOn: readonly string[];
  readonly reliedOnBy: readonly string[];
  readonly refactored: typeof L1_CONTRACT_ENVELOPE_REFACTORED;
};

export const L1_CONTRACT_ENVELOPE_REGISTRY = [
  {
    file: "wire-guard.helpers.ts",
    family: "wire-guard",
    role: "Shared JSON wire runtime guards",
    reliesOn: [],
    reliedOnBy: [
      "acceptance-record.contract",
      "app-shell.contract",
      "block-data.contract",
      "metadata-binding.contract",
      "metadata-binding-waiver.contract",
      "surface-template.contract",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "block-lifecycle.contract.ts",
    family: "block-lifecycle",
    role: "Block lifecycle state vocabulary + guard",
    reliesOn: [],
    reliedOnBy: [
      "acceptance-record.contract",
      "registry/block-lifecycle",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "surface-template.contract.ts",
    family: "surface-template",
    role: "Surface template class wire + bindings",
    reliesOn: ["wire-guard.helpers"],
    reliedOnBy: [
      "block-metadata.contract",
      "block-metadata.builders",
      "metadata-binding.contract",
      "registry/surface-template.registry",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "block-data.contract.ts",
    family: "block-data",
    role: "Datatable/form field wire descriptors",
    reliesOn: ["wire-guard.helpers"],
    reliedOnBy: [
      "registry/block-slot.registry",
      "registry/build-metadata-binding-from-data-contracts",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "block-metadata.contract.ts",
    family: "block-metadata",
    role: "BlockMetadata wire shape + BLOCK_METADATA_VERSION",
    reliesOn: ["surface-template.contract"],
    reliedOnBy: [
      "block-metadata.builders",
      "governance/block-metadata.registry",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "block-metadata.builders.ts",
    family: "block-metadata",
    role: "buildBlockMetadata() derived from registry SSOT",
    reliesOn: [
      "block-metadata.contract",
      "surface-template.contract",
      "registry/block-slot.registry",
    ],
    reliedOnBy: ["governance/block-metadata.registry"],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "acceptance-record.contract.ts",
    family: "acceptance-record",
    role: "Acceptance record wire + ACPA seal fields",
    reliesOn: ["block-lifecycle.contract", "wire-guard.helpers"],
    reliedOnBy: [
      "acceptance-record.validator",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "acceptance-record.validator.ts",
    family: "acceptance-record",
    role: "validateAcceptanceRecordSeal()",
    reliesOn: ["acceptance-record.contract"],
    reliedOnBy: ["index barrel", "__tests__"],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "metadata-binding.contract.ts",
    family: "metadata-binding",
    role: "Metadata binding wire (field → slot)",
    reliesOn: ["surface-template.contract", "wire-guard.helpers"],
    reliedOnBy: [
      "registry/metadata-binding.registry",
      "registry/build-metadata-binding-from-data-contracts",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "metadata-binding-waiver.contract.ts",
    family: "metadata-binding",
    role: "Metadata binding waiver wire (NO path)",
    reliesOn: ["wire-guard.helpers"],
    reliedOnBy: [
      "registry/metadata-binding-waiver.registry",
      "registry/assert-metadata-binding-coverage",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "block-slot-dom-marker.contract.ts",
    family: "block-slot-dom-marker",
    role: "data-afenda-slot DOM marker props helper",
    reliesOn: [],
    reliedOnBy: [
      "registry/assert-block-slot-dom-marker-coverage",
      "storybook/metadata-slot-hydration-lab",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
  {
    file: "app-shell.contract.ts",
    family: "app-shell",
    role: "App shell nav + operating context wire guards",
    reliesOn: ["wire-guard.helpers"],
    reliedOnBy: [
      "components/app-shell",
      "apps/erp AppProtectedShell",
      "index barrel",
    ],
    refactored: L1_CONTRACT_ENVELOPE_REFACTORED,
  },
] as const satisfies readonly L1ContractEnvelope[];

export const L1_CONTRACT_ENVELOPE_FILES = L1_CONTRACT_ENVELOPE_REGISTRY.map(
  (entry) => entry.file
);

/** Registry file itself — excluded from flat L1 inventory scans. */
export const L1_CONTRACT_REGISTRY_EXCLUDED_FILES = [
  "_contract-envelope.registry.ts",
] as const;

export type L1ContractEnvelopeInventoryDiff = {
  readonly discoveredCount: number;
  readonly discoveredOnly: readonly string[];
  readonly missingOnDisk: readonly string[];
  readonly registeredCount: number;
};

export function diffL1ContractEnvelopeRegistry(
  discoveredFiles: readonly string[]
): L1ContractEnvelopeInventoryDiff {
  const registered = L1_CONTRACT_ENVELOPE_FILES;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredFiles);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredFiles.length,
    missingOnDisk: registered.filter((file) => !discoveredSet.has(file)),
    discoveredOnly: discoveredFiles.filter((file) => !registeredSet.has(file)),
  };
}

export function assertL1ContractEnvelopeRegistryComplete(
  discoveredFiles: readonly string[]
): boolean {
  const diff = diffL1ContractEnvelopeRegistry(discoveredFiles);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function formatL1ContractEnvelopeInventoryDiff(
  diff: L1ContractEnvelopeInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(`unregistered on disk: ${diff.discoveredOnly.join(", ")}`);
  }

  return lines.join(" · ");
}
