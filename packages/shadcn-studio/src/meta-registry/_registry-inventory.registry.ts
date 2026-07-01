/**
 * @afenda.registry-inventory L1-inventory
 * Role: Sole registry/ folder inventory SSOT — fail-fast on add/delete
 * Family: registry-inventory
 * Relies on: (none — pure inventory)
 * Relied on by: check:studio-registry-inventory, meta-registry/__tests__/registry-inventory.registry.test.ts
 * Refactored: 2026-07-01 · series flat-L1-registry
 * Gate: check:studio-registry-inventory
 */

export const REGISTRY_INVENTORY_MARKER = "@afenda.registry-inventory" as const;

export const REGISTRY_INVENTORY_SERIES = "flat-L1-registry" as const;

export const REGISTRY_INVENTORY_REFACTORED = "2026-07-01" as const;

export const REGISTRY_INVENTORY_GATE =
  "check:studio-registry-inventory" as const;

export const REGISTRY_MODULE_FAMILIES = [
  "acceptance-record",
  "block-slot",
  "presentation-inventory",
  "block-lifecycle",
  "surface-template",
  "metadata-binding",
  "block-slot-dom-marker",
  "studio-block-component",
] as const;

export type RegistryModuleFamily = (typeof REGISTRY_MODULE_FAMILIES)[number];

export type RegistryModuleEntry = {
  readonly file: string;
  readonly family: RegistryModuleFamily;
  readonly role: string;
  readonly serializable: boolean;
};

/** Envelope-registered registry/ source modules (excludes this meta file). */
export const REGISTRY_MODULE_REGISTRY = [
  {
    file: "acceptance-record.registry.ts",
    family: "acceptance-record",
    role: "Sealed acceptance records for governed blocks",
    serializable: true,
  },
  {
    file: "block-slot.types.ts",
    family: "block-slot",
    role: "Shared slot role and entry types",
    serializable: true,
  },
  {
    file: "block-slot-template-families.ts",
    family: "block-slot",
    role: "Template families for MCP block slot derivation",
    serializable: true,
  },
  {
    file: "block-slot.registry.ts",
    family: "block-slot",
    role: "Block slot + data-contract inventory SSOT",
    serializable: true,
  },
  {
    file: "mcp-seed-block-manifest.ts",
    family: "presentation-inventory",
    role: "MCP seed block manifest",
    serializable: true,
  },
  {
    file: "studio-block-parity.registry.ts",
    family: "presentation-inventory",
    role: "Install parity inventory for MCP blocks",
    serializable: true,
  },
  {
    file: "build-presentation-inventory-from-parity.ts",
    family: "presentation-inventory",
    role: "Derives presentation inventory rows from parity",
    serializable: false,
  },
  {
    file: "presentation-inventory.registry.ts",
    family: "presentation-inventory",
    role: "Presentation inventory SSOT",
    serializable: true,
  },
  {
    file: "block-lifecycle.ts",
    family: "block-lifecycle",
    role: "Lifecycle state vocabulary",
    serializable: true,
  },
  {
    file: "block-lifecycle-mutation.ts",
    family: "block-lifecycle",
    role: "Lifecycle transition guards",
    serializable: false,
  },
  {
    file: "surface-template.registry.ts",
    family: "surface-template",
    role: "Surface template class inventory",
    serializable: true,
  },
  {
    file: "metadata-binding.registry.ts",
    family: "metadata-binding",
    role: "Operator metadata binding SSOT",
    serializable: true,
  },
  {
    file: "metadata-binding-waiver.registry.ts",
    family: "metadata-binding",
    role: "Binding waiver inventory (NO path)",
    serializable: true,
  },
  {
    file: "metadata-binding-overrides.registry.ts",
    family: "metadata-binding",
    role: "Binding override inventory",
    serializable: true,
  },
  {
    file: "metadata-binding-module-assignment.ts",
    family: "metadata-binding",
    role: "ERP module slug → KV id assignment",
    serializable: true,
  },
  {
    file: "build-metadata-binding-from-data-contracts.ts",
    family: "metadata-binding",
    role: "Derives bindings from block data contracts",
    serializable: false,
  },
  {
    file: "assert-metadata-binding-coverage.ts",
    family: "metadata-binding",
    role: "Binding coverage gate helper",
    serializable: false,
  },
  {
    file: "assert-block-slot-dom-marker-coverage.ts",
    family: "block-slot-dom-marker",
    role: "DOM marker coverage gate helper",
    serializable: false,
  },
  {
    file: "studio-block-component.registry.tsx",
    family: "studio-block-component",
    role: "Block id → React preview component map",
    serializable: false,
  },
] as const satisfies readonly RegistryModuleEntry[];

export const REGISTRY_MODULE_FILES = REGISTRY_MODULE_REGISTRY.map(
  (entry) => entry.file
);

export const REGISTRY_INVENTORY_EXCLUDED = [
  "_registry-inventory.registry.ts",
] as const;

export type RegistryModuleInventoryDiff = {
  readonly registeredCount: number;
  readonly discoveredCount: number;
  readonly missingOnDisk: readonly string[];
  readonly discoveredOnly: readonly string[];
};

export function diffRegistryModuleInventory(
  discoveredFiles: readonly string[]
): RegistryModuleInventoryDiff {
  const registered = REGISTRY_MODULE_FILES;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredFiles);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredFiles.length,
    missingOnDisk: registered.filter((file) => !discoveredSet.has(file)),
    discoveredOnly: discoveredFiles.filter((file) => !registeredSet.has(file)),
  };
}

export function assertRegistryModuleInventoryComplete(
  discoveredFiles: readonly string[]
): boolean {
  const diff = diffRegistryModuleInventory(discoveredFiles);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function assertRegistryModuleInventoryCompleteOrThrow(
  discoveredFiles: readonly string[]
): void {
  if (!assertRegistryModuleInventoryComplete(discoveredFiles)) {
    throw new Error(
      `registry module inventory incomplete: ${formatRegistryModuleInventoryDiff(
        diffRegistryModuleInventory(discoveredFiles)
      )}`
    );
  }
}

export function formatRegistryModuleInventoryDiff(
  diff: RegistryModuleInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(
      `unregistered on disk: ${diff.discoveredOnly.join(", ")} — add to _registry-inventory.registry.ts`
    );
  }

  return lines.join(" · ");
}

export function listSerializableRegistryModules(): readonly RegistryModuleEntry[] {
  return REGISTRY_MODULE_REGISTRY.filter((entry) => entry.serializable);
}
