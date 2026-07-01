/**
 * L2 lib inventory SSOT — flat `lib/*.ts` modules only (no subfolders).
 * Gate: vitest `lib-inventory.registry`
 */

export const LIB_INVENTORY_MARKER = "@afenda.lib-inventory" as const;

export const LIB_INVENTORY_SERIES = "flat-L2-lib" as const;

export const LIB_INVENTORY_REFACTORED = "2026-07-01" as const;

export const LIB_INVENTORY_GATE = "check:studio-lib-inventory" as const;

export type LibModuleEntry = {
  readonly file: string;
  readonly exports: readonly string[];
  readonly role: string;
  readonly serializable: boolean;
};

export const LIB_MODULE_REGISTRY = [
  {
    file: "compose-class-name.ts",
    exports: ["composeClassName", "ClassNameInput", "ClassNameStateFn"],
    role: "Base UI stateful className merge helper",
    serializable: false,
  },
  {
    file: "governed-primitive-props.ts",
    exports: ["WithoutGovernedDataSlot"],
    role: "Omit governed data-slot from consumer primitive props",
    serializable: false,
  },
  {
    file: "compute-pagination-range.ts",
    exports: [
      "computePaginationRange",
      "ComputePaginationRangeInput",
      "ComputePaginationRangeResult",
    ],
    role: "Pure datatable pagination window (not a React hook)",
    serializable: true,
  },
  {
    file: "user-profile-avatar.contract.ts",
    exports: [
      "userProfileAvatarHeroClassName",
      "userProfileAvatarPresetGridClassName",
      "userProfileAvatarPresetButtonClassName",
      "userProfileAvatarPresetSelectedClassName",
      "userProfileAvatarPresetIdleClassName",
      "userProfileAvatarPanelClassName",
      "userProfileAvatarFallbackClassName",
    ],
    role: "Profile avatar picker className SSOT (sidebar-user-dropdown)",
    serializable: false,
  },
  {
    file: "user-profile-avatar.policy.ts",
    exports: [
      "USER_PROFILE_AVATAR_PRESETS",
      "DEFAULT_USER_PROFILE_AVATAR_PRESET_ID",
      "UserProfileAvatarPreset",
      "UserProfileAvatarPresetId",
      "getUserProfileAvatarPreset",
      "resolveUserProfileAvatarFallback",
      "resolveUserProfileAvatarImageSrc",
    ],
    role: "Curated avatar presets + resolve helpers for lab surfaces",
    serializable: false,
  },
] as const satisfies readonly LibModuleEntry[];

export const LIB_MODULE_FILES = LIB_MODULE_REGISTRY.map((entry) => entry.file);

export const LIB_REGISTRY_EXCLUDED_FILES = [
  "_lib-inventory.registry.ts",
] as const;

export type LibModuleInventoryDiff = {
  readonly registeredCount: number;
  readonly discoveredCount: number;
  readonly missingOnDisk: readonly string[];
  readonly discoveredOnly: readonly string[];
};

export function diffLibModuleRegistry(
  discoveredFiles: readonly string[]
): LibModuleInventoryDiff {
  const registered = LIB_MODULE_FILES;
  const registeredSet = new Set<string>(registered);
  const discoveredSet = new Set<string>(discoveredFiles);

  return {
    registeredCount: registered.length,
    discoveredCount: discoveredFiles.length,
    missingOnDisk: registered.filter((file) => !discoveredSet.has(file)),
    discoveredOnly: discoveredFiles.filter((file) => !registeredSet.has(file)),
  };
}

export function assertLibModuleRegistryComplete(
  discoveredFiles: readonly string[]
): boolean {
  const diff = diffLibModuleRegistry(discoveredFiles);

  return (
    diff.registeredCount === diff.discoveredCount &&
    diff.missingOnDisk.length === 0 &&
    diff.discoveredOnly.length === 0
  );
}

export function assertLibModuleRegistryCompleteOrThrow(
  discoveredFiles: readonly string[]
): void {
  if (!assertLibModuleRegistryComplete(discoveredFiles)) {
    throw new Error(
      `lib module registry incomplete: ${formatLibModuleInventoryDiff(
        diffLibModuleRegistry(discoveredFiles)
      )}`
    );
  }
}

export function formatLibModuleInventoryDiff(
  diff: LibModuleInventoryDiff
): string {
  const lines = [
    `registered=${diff.registeredCount} discovered=${diff.discoveredCount}`,
  ];

  if (diff.missingOnDisk.length > 0) {
    lines.push(`missing on disk: ${diff.missingOnDisk.join(", ")}`);
  }

  if (diff.discoveredOnly.length > 0) {
    lines.push(
      `unregistered on disk: ${diff.discoveredOnly.join(", ")} — add to _lib-inventory.registry.ts`
    );
  }

  return lines.join(" · ");
}

export function listSerializableLibModules(): readonly LibModuleEntry[] {
  return LIB_MODULE_REGISTRY.filter((entry) => entry.serializable);
}
